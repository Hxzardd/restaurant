from flask import Blueprint, request, jsonify

from app.extensions import db
from app.models.menu import MenuItem
from app.utils.auth import admin_required
from app.utils.validators import parse_price

menu = Blueprint("menu", __name__, url_prefix="/menu")


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
        min_price = parse_price(min_price)
        if min_price is None:
            return jsonify({"msg": "Invalid min_price"}), 400
        query = query.filter(MenuItem.price >= min_price)

    if max_price:
        max_price = parse_price(max_price)
        if max_price is None:
            return jsonify({"msg": "Invalid max_price"}), 400
        query = query.filter(MenuItem.price <= max_price)

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


@menu.route("", methods=["POST"])
@admin_required
def add_menu_item():
    data = request.get_json()

    name = (data.get("name") or "").strip()
    price = data.get("price")
    category = data.get("category")
    description = data.get("description", "")

    if not all([name, price is not None, category]):
        return jsonify({"msg": "Missing required fields"}), 400

    price = parse_price(price)
    if price is None:
        return jsonify({"msg": "Price must be a non-negative number"}), 400

    item = MenuItem(
        name=name,
        price=price,
        category=category,
        description=description
    )

    db.session.add(item)
    db.session.commit()

    return jsonify({"msg": "Menu item added"}), 201


@menu.route("/<int:item_id>", methods=["PUT"])
@admin_required
def update_menu_item(item_id):
    item = MenuItem.query.get_or_404(item_id)
    data = request.get_json()

    if "price" in data:
        price = parse_price(data["price"])
        if price is None:
            return jsonify({"msg": "Price must be a non-negative number"}), 400
        item.price = price

    item.name = data.get("name", item.name)
    item.category = data.get("category", item.category)
    item.description = data.get("description", item.description)
    item.is_available = data.get("is_available", item.is_available)

    db.session.commit()

    return jsonify({"msg": "Menu item updated"}), 200


@menu.route("/<int:item_id>", methods=["DELETE"])
@admin_required
def delete_menu_item(item_id):
    item = MenuItem.query.get_or_404(item_id)

    db.session.delete(item)
    db.session.commit()

    return jsonify({"msg": "Menu item deleted"}), 200
