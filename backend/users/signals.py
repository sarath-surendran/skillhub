from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import ForgotPassword
from django.utils.crypto import get_random_string
from django.core.mail import send_mail

@receiver(post_save, sender = ForgotPassword)
def send_password_reset_email(sender, instance, created, **kwargs):
    if created:
        
        print("email to send")
        # instance.token = get_random_string(length=32)
        # instance.save()
        reset_link = f"https://skillhub.tech/forgot-password/token/{instance.token}"
        print(reset_link)
        # Send the reset email
        subject = "Password Reset Request"
        message = f"Click the following link to reset your password: {reset_link}"
        from_email = "sarathcm0@gmail.com"
        recipient_list = [instance.user.email]

        send_mail(subject, message, from_email, recipient_list)