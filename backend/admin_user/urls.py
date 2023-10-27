from django.urls import path
from .views import *

urlpatterns = [
    path('get_users/', ViewAllUsers.as_view(), name="view all users"),
    path('get_instructors/', ViewAllInstructors.as_view(), name="view all instructors"),
    path('get_courses/',ViewAllCourses.as_view(), name="view all courses"),
    path('get_lessons/', ViewLessonsOfACourse.as_view(), name='view all lessons'),
    path('block_user/', BlockUser.as_view(), name="block user"),
    path('block_course/', BlockCourse.as_view(), name="block course"),
    path('make_admin/', MakeAdmin.as_view(), name="make admin"),
    path('make_instructor/', MakeInstructor.as_view(), name="make instructor"),
    path('suspend_instructor/', SuspendInstructor.as_view(), name="suspend instructor"),
    path('pending_requests/',GetPendingRequests.as_view(), name="get_pending_users"),
    path('pending_requests/reject/',RejectRequest.as_view(), name="reject_request"),
    path('pending_requests/accept/',AcceptRequest.as_view(), name="accept request"),
    path('get_paid_enrollments/', GetPaidCourseEnrollment.as_view(), name="get_paid_enrollments"),
    path('get_free_enrollments/', GetFreeEnrollments.as_view(), name="get_free_enrollments"),
    path('get_categories/', ViewCategories.as_view()),
    path('add_category/',AddCategory.as_view()),
]