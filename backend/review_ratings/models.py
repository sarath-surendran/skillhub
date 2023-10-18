from django.db import models
from users.models import CustomUser as User
from courses.models import Course

# Create your models here.

class Review_and_Ratings(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete= models.CASCADE)
    review = models.TextField()
    rating = models.IntegerField(default=0)
