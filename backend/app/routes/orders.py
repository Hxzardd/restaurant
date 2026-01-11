from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from app.extensions import db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.menu import MenuItem

from app.utils.email import send_order_ready_email


orders = Blueprint("orders", __name__, url_prefix="/orders")

def is_admin():
    claims = get_jwt()
    return claims.get("is_admin") is True

@orders.route("", methods=["POST"])
@jwt_required()
def place_order():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    items = data.get("items")
    if not items or not isinstance(items, list):
        return jsonify({"msg": "Invalid items"}), 400

    order = Order(user_id=user_id)
    db.session.add(order)
    db.session.flush()  

    for item in items:
        menu_item = MenuItem.query.get(item["menu_item_id"])
        if not menu_item or not menu_item.is_available:
            return jsonify({"msg": "Invalid menu item"}), 400

        order_item = OrderItem(
            order_id=order.id,
            menu_item_id=menu_item.id,
            quantity=item["quantity"],
            price=menu_item.price
        )

        db.session.add(order_item)

    db.session.commit()

    return jsonify({
        "msg": "Order placed successfully",
        "order_id": order.id
    }), 201

@orders.route("/my", methods=["GET"])
@jwt_required()
def my_orders():
    user_id = int(get_jwt_identity())

    orders = Order.query.filter_by(user_id=user_id).all()

    response = []
    for order in orders:
        response.append({
            "order_id": order.id,
            "status": order.status,
            "created_at": order.created_at,
            "items": [
                {
                    "name": item.menu_item.name,
                    "price": item.price,
                    "quantity": item.quantity
                }
                for item in order.items
            ]
        })

    return jsonify(response), 200

# Admin only to view all orders
@orders.route("/all", methods=["GET"])
@jwt_required()
def all_orders():
    if not is_admin():
        return jsonify({"msg": "Admin access required"}), 403

    orders = Order.query.all()

    response = []
    for order in orders:
        response.append({
            "order_id": order.id,
            "user_id": order.user_id,
            "status": order.status,
            "created_at": order.created_at,
            "items": [
                {
                    "name": item.menu_item.name,
                    "price": item.price,
                    "quantity": item.quantity
                }
                for item in order.items
            ]
        })

    return jsonify(response), 200

# Admin only to update orders
@orders.route("/<int:order_id>/status", methods=["PUT"])
@jwt_required()
def update_order_status(order_id):
    if not is_admin():
        return jsonify({"msg": "Admin access required"}), 403

    data = request.get_json()
    new_status = data.get("status")

    valid_statuses = ["Pending", "Preparing", "Ready", "Delivered"]
    if new_status not in valid_statuses:
        return jsonify({"msg": "Invalid status"}), 400

    try:
        order = Order.query.get_or_404(order_id)
        order.status = new_status
        db.session.commit()

        # Send email notification if status is Ready (non-blocking)
        if new_status == "Ready":
            try:
                # Check if user exists and has email
                if order.user and order.user.email:
                    send_order_ready_email(order.user.email, order.id)
                else:
                    current_app.logger.warning(f"Order {order.id} has no user or email")
            except Exception as e:
                # Log error but don't fail the request
                current_app.logger.error(f"Email failed for order {order.id}: {e}")

        return jsonify({"msg": "Order status updated"}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating order status: {e}")
        return jsonify({"msg": "Failed to update order status"}), 500
