from flask import Flask
from flask_cors import CORS
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

    with app.app_context():
        db.create_all()

    return app