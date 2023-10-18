from django.db import models
from users.models import CustomUser as User

# Create your models here.

class InstructorApplication(models.Model):
    APPLICANT_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    applicant = models.OneToOneField(User, on_delete=models.CASCADE, unique=True)
    status = models.CharField(max_length=10, choices=APPLICANT_STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"{self.applicant.name}'s application is {self.status}"