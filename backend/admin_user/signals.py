from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import InstructorApplication


@receiver(post_save, sender=InstructorApplication)
def HandleInstructorApplication(sender, instance, created, **kwargs):
    if created:
        #initiate websocket connection
        print("application created")
        from channels.layers import get_channel_layer
        from asgiref.sync import async_to_sync
        
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_add)("instructor_application", "InstructorApplicationConsumer")
        print(instance.applicant.name)
        message = {
            "type":"instructor_notification",
            "applicant_id" : instance.applicant.id,
            "applicant_name": instance.applicant.name,
            "application_status": instance.status


        }
        async_to_sync(channel_layer.group_send)("instructor_application", message)