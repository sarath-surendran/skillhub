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
    path('users/', include('users.urls')),
    path('courses/', include('courses.urls')),
    path('enrollments/',include('enrollments.urls')),
    path('profile/', include('userprofile.urls')),
    path('review&ratings/',include('review_ratings.urls')),
    path('admin_user/', include("admin_user.urls")),
    path('course_progress/', include('course_progress.urls')),
    path('chats/',include("chats.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
