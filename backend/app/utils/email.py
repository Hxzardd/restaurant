from flask_mail import Message
from flask import current_app
from app.extensions import mail

def send_order_ready_email(to_email, order_id):
    try:
        msg = Message(
            subject="Your order is Ready!",
            recipients=[to_email],
            body=f"Hello\nYour order ${order_id} is now READY.\n\nYou can expect it to be delivered shortly.\nThank you for ordering with us.\n- Restaurant Team"
        )
        mail.send(msg)
    except Exception as e:
        current_app.logger.error(
            f"[EMAIL ERROR] Order {order_id} → {to_email}: {e}"
        )
