from django.urls import path
from.views import Enroll, PaymentSuccess,GetEnrollment,GetEnrolledCourses


urlpatterns = [
    path('get_enrollment/',GetEnrollment.as_view(), name="get enrollment"),
    path('add_enrollment/', Enroll.as_view(), name="add enrollment"),
    path('add_enrollment/success/',PaymentSuccess.as_view(), name="payment success"),
    path('enrolled_courses/',GetEnrolledCourses.as_view(),name="get enrolled courses"),
]