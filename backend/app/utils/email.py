from flask_mail import Message
from app.extensions import mail

def send_order_ready_email(to_email, order_id):
    msg = Message(
        subject="Your rrder is Ready!",
        recipients=[to_email],
        body=f"Hello\nYour order ${order_id} is now READY.\n\nYou can expect it to be delivered shortly.\nThank you for ordering with us.\n- Restaurant Team"
    )
    mail.send(msg)
