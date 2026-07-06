from flask import Flask, jsonify
from flask_cors import CORS
from werkzeug.exceptions import HTTPException
from .config import Config
from .extensions import db, jwt, mail

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(
        app,
        resources={
            r"/*": {
                "origins": [
                    "https://restaurant.hxzard.com",
                    "http://localhost:5173"
                ]
            }
        },
        supports_credentials=True
    )

    # Initialize database (Flask-SQLAlchemy will automatically use SQLALCHEMY_ENGINE_OPTIONS from config)
    db.init_app(app)
    
    jwt.init_app(app)
    mail.init_app(app)

    from app.routes.auth import auth
    from app.routes.menu import menu
    from app.routes.orders import orders

    app.register_blueprint(auth)
    app.register_blueprint(menu)
    app.register_blueprint(orders)

    # Consistent JSON errors; never leak stack traces to clients.
    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        return jsonify({"msg": e.description}), e.code

    @app.errorhandler(Exception)
    def handle_unexpected_error(e):
        app.logger.exception("Unhandled exception")
        return jsonify({"msg": "Internal server error"}), 500

    with app.app_context():
        db.create_all()

    return app