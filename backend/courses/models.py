from django.db import models
from users.models import CustomUser

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=100)

class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    instructor_id = models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    category_id = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="courses")
    is_free = models.BooleanField(default=True)
    enrollment_fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    course_duration = models.CharField(max_length=255)
    course_highlight = models.TextField()
    course_objective = models.TextField()
    prerequisites = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_blocked = models.BooleanField(default=False)
    thumbnail = models.ImageField(upload_to='course_thumbnail',null=True, blank=True)

    def __str__(self):
        return self.title

class Lesson(models.Model):
    title = models.CharField(max_length=500)
    content_video_url = models.URLField(blank=True, null=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="lessons")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title