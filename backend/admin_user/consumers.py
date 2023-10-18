import json
from channels.generic.websocket import AsyncWebsocketConsumer
from users.models import CustomUser as User
from channels.db import database_sync_to_async


class InstructorApplicationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
            user = await self.get_user(self.user_id)
            print(user)
            if user.is_admin:
                await self.accept()
                print("Socket connected")
                await self.channel_layer.group_add("instructor_application", self.channel_name)
            else:
                await self.close()
        except Exception as e:
            print(e)
            await self.close()
    async def disconnect(self, code):
        await self.channel_layer.group_discard("instructor_application", self.channel_name)
    
    # async def receive(self, text_data):
    #     print("msg received")
    #     content = json.loads(text_data)
    #     message = content.get("message")

        

    #     await self.channel_layer.group_send(
    #         "instructor_application", {
    #             "type":"instructor.notification",
    #             "message":message
    #         }
    #     )
    async def instructor_notification(self, event):
        applicant_id = event.get("applicant_id")
        applicant_name = event.get("applicant_name")
        application_status = event.get("application_status")
        await self.send(text_data=json.dumps({"type":"notification", "applicant_id":applicant_id, "applicant_name":applicant_name, "application_status":application_status}))

    @database_sync_to_async
    def get_user(self, user_id):
        user = User.objects.get(id = user_id)
        return user