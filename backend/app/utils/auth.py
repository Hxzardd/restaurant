from functools import wraps

from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt


def admin_required(fn):
    """Require a valid JWT whose claims include is_admin=True."""
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        if get_jwt().get("is_admin") is not True:
            return jsonify({"msg": "Admin access required"}), 403
        return fn(*args, **kwargs)
    return wrapper
