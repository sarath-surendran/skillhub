from django.contrib import admin
from django.urls import path,include
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from users.views import MyTokenObtainPairView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    
    path('admin/', admin.site.urls),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/',TokenVerifyView.as_view(),name='token_verify'),
    path('api/users/', include('users.urls')),
    path('api/courses/', include('courses.urls')),
    path('api/enrollments/',include('enrollments.urls')),
    path('api/profile/', include('userprofile.urls')),
    path('api/review&ratings/',include('review_ratings.urls')),
    path('api/admin_user/', include("admin_user.urls")),
    path('api/course_progress/', include('course_progress.urls')),
    path('api/chats/',include("chats.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
