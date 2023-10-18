"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

import os

from channels.routing import ProtocolTypeRouter

from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from chats.routing import websocket_urlpatterns
from admin_user.routing import websocket_urlpatterns_notifications

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')


django_asgi_app = get_asgi_application()

all_websocket_urlpatterns = websocket_urlpatterns + websocket_urlpatterns_notifications

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
            AuthMiddlewareStack(URLRouter( all_websocket_urlpatterns))
        ),
    
})

