from django.urls import path
from .views import CreateCourseWithLessons,CategoryView,CoureseView,LessonView,UpdateLesson,AddLesson,DeleteLesson,DeleteCourse,UpdateCourse,CategorywiseFullCourses, GetCategory
from .views import CategorywiseCourses,CourseDetails

urlpatterns = [
    path('add_course/', CreateCourseWithLessons.as_view(), name="createcoursewithlessons"),
    path('view_categories/',CategoryView.as_view(),name="category_view"),
    path('view_courses/', CoureseView.as_view(), name="course_view"),
    path('view_courses/lessons/',LessonView.as_view(),name="lesson_view"),
    path('view_courses/lessons/update_lesson/',UpdateLesson.as_view(), name="update lesson"),
    path('view_courses/lessons/add_lesson/',AddLesson.as_view(),name="add lesson"),
    path('view_courses/lessons/delete/',DeleteLesson.as_view(),name="delete lesson"),
    path('view_courses/delete/',DeleteCourse.as_view(),name="delete course"),
    path('view_courses/update_course/',UpdateCourse.as_view(), name="update course"),
    path('view_courses_by_category/',CategorywiseCourses.as_view(), name="category wise courses"),
    path('get_course/',CourseDetails.as_view(),name="course details"),
    path('view_full_courses_by_category/',CategorywiseFullCourses.as_view()),
    path('get_category/',GetCategory.as_view()),
]