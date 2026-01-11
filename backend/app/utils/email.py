from flask_mail import Message
from flask import current_app
from app.extensions import mail
import socket

def send_order_ready_email(to_email, order_id):

    try:
        socket.setdefaulttimeout(10)
        
        if not current_app.config.get("MAIL_SERVER"):
            current_app.logger.warning("Mail server not configured, skipping email")
            return False

        msg = Message(
            subject="Your order is Ready!",
            recipients=[to_email],
            body=f"Hello\nYour order #{order_id} is now READY.\n\nYou can expect it to be delivered shortly.\nThank you for ordering with us.\n- Restaurant Team"
        )
        mail.send(msg)
        current_app.logger.info(f"Email sent successfully for order {order_id} to {to_email}")
        return True
    except socket.timeout:
        current_app.logger.error(
            f"[EMAIL TIMEOUT] Order {order_id} → {to_email}: Connection timeout"
        )
        return False
    except Exception as e:
        current_app.logger.error(
            f"[EMAIL ERROR] Order {order_id} → {to_email}: {e}"
        )
        return False
    finally:
        socket.setdefaulttimeout(None)
