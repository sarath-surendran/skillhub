from django.urls import path
from .views import RegisterView,EmailVerification,ChangePassword,ForgotPasswordView,ForgotPasswordConfirmView

urlpatterns = [
    path('register/',RegisterView.as_view(), name="register"),
    # path('register/verify_email/<str:token>/',EmailVerification.as_view(),name="email_verification"),
    path('register/verify_email/',EmailVerification.as_view(),name="email_verification"),
    path('change_password/',ChangePassword.as_view(), name="change password"),
    path('forgot_password/',ForgotPasswordView.as_view(),name="forgot_password"),
    path('forgot_password_confirm/',ForgotPasswordConfirmView.as_view(),name="forgot_password_confirm"),
]