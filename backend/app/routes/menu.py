from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt

from app.extensions import db
from app.models.menu import MenuItem

menu = Blueprint("menu", __name__, url_prefix="/menu")

def admin_required():
    claims = get_jwt()
    return claims.get("is_admin") is True


@menu.route("", methods=["GET"])
def get_menu():
    query = MenuItem.query

    # Doing all the filtering server side using query params just so that frontend is minimal. Frontend
    # app would just pass the selected filters to the backend
    category = request.args.get("category")
    min_price = request.args.get("min_price")
    max_price = request.args.get("max_price")
    search = request.args.get("q")
    available = request.args.get("available")

    if category:
        query = query.filter(MenuItem.category == category)

    if min_price:
        query = query.filter(MenuItem.price >= float(min_price))

    if max_price:
        query = query.filter(MenuItem.price <= float(max_price))

    if available is not None:
        query = query.filter(MenuItem.is_available == (available.lower() == "true"))

    if search:
        query = query.filter(MenuItem.name.ilike(f"%{search}%"))

    items = query.all()

    return jsonify([
        {
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "price": item.price,
            "category": item.category,
            "is_available": item.is_available
        }
        for item in items
    ]), 200

# Admin only!!
@menu.route("", methods=["POST"])
@jwt_required()
def add_menu_item():
    if not admin_required():
        return jsonify({"msg": "Admin access required"}), 403

    data = request.get_json()

    name = data.get("name")
    price = data.get("price")
    category = data.get("category")
    description = data.get("description", "")

    if not all([name, price, category]):
        return jsonify({"msg": "Missing required fields"}), 400

    item = MenuItem(
        name=name,
        price=price,
        category=category,
        description=description
    )

    db.session.add(item)
    db.session.commit()

    return jsonify({"msg": "Menu item added"}), 201

# Admin only
@menu.route("/<int:item_id>", methods=["PUT"])
@jwt_required()
def update_menu_item(item_id):
    if not admin_required():
        return jsonify({"msg": "Admin access required"}), 403

    item = MenuItem.query.get_or_404(item_id)
    data = request.get_json()

    item.name = data.get("name", item.name)
    item.price = data.get("price", item.price)
    item.category = data.get("category", item.category)
    item.description = data.get("description", item.description)
    item.is_available = data.get("is_available", item.is_available)

    db.session.commit()

    return jsonify({"msg": "Menu item updated"}), 200

# Admin only
@menu.route("/<int:item_id>", methods=["DELETE"])
@jwt_required()
def delete_menu_item(item_id):
    if not admin_required():
        return jsonify({"msg": "Admin access required"}), 403

    item = MenuItem.query.get_or_404(item_id)

    db.session.delete(item)
    db.session.commit()

    return jsonify({"msg": "Menu item deleted"}), 200
