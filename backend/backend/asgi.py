"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""
from django.core.asgi import get_asgi_application
django_asgi_app = get_asgi_application()
from django.conf import settings
from django.contrib.staticfiles.handlers import StaticFilesHandler

import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator


from channels.auth import AuthMiddlewareStack


from chats.routing import websocket_urlpatterns, websocket_urlpatterns_community
from admin_user.routing import websocket_urlpatterns_notifications






all_websocket_urlpatterns = websocket_urlpatterns + websocket_urlpatterns_notifications + websocket_urlpatterns_community

# application = ProtocolTypeRouter({
#     "http": django_asgi_app,
#     "websocket": AllowedHostsOriginValidator(
#             AuthMiddlewareStack(URLRouter( all_websocket_urlpatterns))
#         ),
    
# })
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        AllowedHostsOriginValidator(
            URLRouter(all_websocket_urlpatterns)
        )
    ),
})

# if settings.DEBUG:
#     # Serve static files during development
#     application = StaticFilesHandler(application)


