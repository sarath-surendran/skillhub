from django.urls import path
from .views import AddReview,ViewReview

urlpatterns = [
    path("add_review/",AddReview.as_view(), name="add review"),
    path("get_review/", ViewReview.as_view(), name="view review"),
]