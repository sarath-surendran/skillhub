from django.urls import path
from .views import *

urlpatterns = [
    path('mark_lesson_as_complete/', MarkLessonAsCompleted.as_view(), name="mark lesson as completed"),
    path('get_completed_lessons/', GetAllCompletedLessons.as_view(), name="get all completed lessons"),
    path('get_progress/',GetProgress.as_view(),name="get progress"),
]