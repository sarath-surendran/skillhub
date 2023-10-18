from django.db import models
from users.models import CustomUser as User
from courses.models import Course

# Create your models here.

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_messages")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="course",default=1)
    content = models.TextField()
    chat_room = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender} to {self.receiver}: {self.content}'

class CommunityMessage(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="course_message")
    content = models.TextField()
    chat_room = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} send message in community chat of '{self.course}'"