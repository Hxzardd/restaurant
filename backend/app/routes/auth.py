from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

from app.extensions import db
from app.models.user import User
from app.utils.validators import is_valid_email

auth = Blueprint("auth", __name__, url_prefix="/auth")


@auth.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()

        name = (data.get("name") or "").strip()
        email = (data.get("email") or "").strip().lower()
        password = data.get("password") or ""

        if not all([name, email, password]):
            return jsonify({"msg": "Missing required fields"}), 400

        if not is_valid_email(email):
            return jsonify({"msg": "Invalid email address"}), 400

        if len(password) < 8:
            return jsonify({"msg": "Password must be at least 8 characters"}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({"msg": "Email already registered"}), 409

        hashed_password = generate_password_hash(password)

        user = User(
            name=name,
            email=email,
            password_hash=hashed_password,
            is_admin=False
        )

        db.session.add(user)
        db.session.commit()

        return jsonify({"msg": "User registered successfully"}), 201
    except Exception:
        db.session.rollback()
        current_app.logger.exception("Registration failed")
        return jsonify({"msg": "Registration failed"}), 500


@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not all([email, password]):
        return jsonify({"msg": "Missing credentials"}), 400

    # Case-insensitive lookup so accounts created before email normalization still work
    user = User.query.filter(db.func.lower(User.email) == email).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"msg": "Invalid email or password"}), 401

    access_token = create_access_token(
        identity=str(user.id),  
        additional_claims={
            "email": user.email,
            "is_admin": user.is_admin
        }
    )

    return jsonify({
        "access_token": access_token
    }), 200
