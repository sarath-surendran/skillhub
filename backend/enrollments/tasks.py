# tasks.py
from celery import shared_task
from django.core.mail import send_mail
from django.utils import timezone
from .models import Enrollment

@shared_task
def send_daily_reminders():
    # Get all incomplete enrollments for today
    # today = timezone.now().date()
    incomplete_enrollments = Enrollment.objects.filter(
        is_completed=False
    )
    print(incomplete_enrollments)
    # Create a dictionary to store pending enrollments for each user
    pending_enrollments = {}

    for enrollment in incomplete_enrollments:
        # Check if the user is already in the dictionary
        if enrollment.student_id.id not in pending_enrollments:
            pending_enrollments[enrollment.student_id.id] = {
                'user': enrollment.student_id,
                'courses': []
            }

        # Add the course title to the user's pending enrollments
        pending_enrollments[enrollment.student_id.id]['courses'].append(enrollment.course_id.title)

    # Send a consolidated email to each user
    for user_id, data in pending_enrollments.items():
        user = data['user']
        course_list = "\n".join(data['courses'])
        
        subject = "Course Reminder"
        message = f"Dear {user.name},\n\nPlease don't forget to complete the following courses:\n\n{course_list}"
        from_email = "sarathcm0@gmail.com"  # Replace with your email
        recipient_list = [user.email]
        print(message)
        send_mail(subject, message, from_email, recipient_list)
