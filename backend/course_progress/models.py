from django.db import models
from users.models import CustomUser as User
from courses.models import Course, Lesson
from django.utils import timezone
# Create your models here.

class Progress(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(blank=True, null=True, default=timezone.now)

    class Meta:
        unique_together = ('student', 'lesson')