from django.urls import path
from .views import *


urlpatterns = [
    path('', ProfileView.as_view(), name="profile view"),
    path('apply_for_instructor/', ApplyForInstructor.as_view(), name="apply_for_instructor"),
]