from django.db import models
from users.models import CustomUser
from courses.models import Course

# Create your models here.
class Payment(models.Model):
    amount = models.FloatField(blank=True)
    payment_id = models.CharField(max_length=255)
    payment_date = models.DateField()
    payment_status = models.BooleanField(default=False)
    payment_method = models.CharField(max_length=200,blank=True)
    student_id = models.ForeignKey(CustomUser,on_delete=models.CASCADE, related_name="payment")
    course_id = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="payment")
    pay_id_to_refund = models.CharField(max_length=255, default=0)

class Enrollment(models.Model):
    student_id = models.ForeignKey(CustomUser,on_delete=models.CASCADE, related_name="enrollment")
    course_id = models.ForeignKey(Course, on_delete= models.CASCADE, related_name="enrollment")
    enrollment_date = models.DateField(auto_now_add=True)
    payment = models.ForeignKey(Payment,on_delete=models.CASCADE,blank=True, null=True, related_name="enrollment")
    is_completed = models.BooleanField(default=False)


