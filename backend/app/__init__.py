from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import db, jwt, mail

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)

    from app.routes.auth import auth
    app.register_blueprint(auth)

    from app.routes.menu import menu
    app.register_blueprint(menu)

    from app.routes.orders import orders
    app.register_blueprint(orders)

    return app
