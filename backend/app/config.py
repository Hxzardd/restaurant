import os
from dotenv import load_dotenv

load_dotenv()

# Get database URL first to determine if we need PostgreSQL-specific config
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///restaurant.db")

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Connection pooling for PostgreSQL (only applied if using PostgreSQL)
    # Flask-SQLAlchemy 3.x automatically reads this config
    if DATABASE_URL.startswith("postgresql"):
        SQLALCHEMY_ENGINE_OPTIONS = {
            "pool_size": 5,
            "max_overflow": 10,
            "pool_pre_ping": True,  # Verify connections before using (handles closed connections)
            "pool_recycle": 3600,   # Recycle connections after 1 hour
            "connect_args": {
                "connect_timeout": 10,
                "sslmode": "require"
            }
        }
    
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret")

    MAIL_SERVER = os.getenv("MAIL_SERVER")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS") == "true"
    MAIL_USE_SSL = os.getenv("MAIL_USE_SSL") == "true"
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER")