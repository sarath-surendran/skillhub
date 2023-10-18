from django.apps import AppConfig


class AdminUserConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'admin_user'

    def ready(self):
        import admin_user.signals
