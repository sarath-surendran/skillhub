import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from users.models import CustomUser
from .models import Message, CommunityMessage
from channels.db import database_sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            # Get user_id from the URL parameters
            self.reciever_id = self.scope["url_route"]["kwargs"]["reciever_id"]
            self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
            self.course_id = self.scope['url_route']["kwargs"]["course_id"]
            print(self.course_id)

            # Check if the user is authenticated
            user, reciever = await self.get_user(self.user_id, self.reciever_id)
            if user.is_anonymous or str(user.id) != self.user_id:
                await self.close()
            else:
                self.room_name = self.get_or_create_room(self.user_id, self.reciever_id)
                self.room_group_name = f"chat_{self.room_name}"

                await self.channel_layer.group_add(
                    self.room_group_name,
                    self.channel_name
                )
                await self.accept()
        except Exception as e:
            # Handle exceptions here, e.g., log them or send an error response to the client
            await self.close()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            print("entered receive")
            text_data_json = json.loads(text_data)
            message = text_data_json.get("message")
            is_typing = text_data_json.get("isTyping")
            print('isTyping',is_typing)
            if message:
                print("there is message")
                await self.save_message(message)

                await self.channel_layer.group_send(
                    self.room_group_name, {
                        "type": "chat.message",
                        "message": message,
                        "user_id": self.user_id,
                    }
                )
            
            if is_typing is not None:
                await self.channel_layer.group_send(
                    self.room_group_name, {
                        "type": "chat.typing",
                        "is_typing": is_typing,
                        "reciever_id": self.reciever_id,
                        "user_id":self.user_id,
                        "sender_channel": self.channel_name
                    }
                )

        except json.JSONDecodeError as e:
            print("json error", e)
            # Handle JSON decoding errors
            pass
        except Exception as e:
            print("execption", e)
            # Handle other exceptions here

    async def chat_message(self, event):
        message = event["message"]
        user_id = event["user_id"]

        await self.send(text_data=json.dumps({"type":"message","message": message, "user_id": user_id}))

    async def chat_typing(self, event):
        is_typing = event["is_typing"]
        reciever_id = event["reciever_id"]
        user_id = event["user_id"]

        await self.send(text_data=json.dumps({"type":"typing", "is_typing":is_typing, "reciever_id":reciever_id, "user_id": user_id }))

    @database_sync_to_async
    def get_user(self, user_id, reciever_id):
        user = CustomUser.objects.get(id=user_id)
        reciever = CustomUser.objects.get(id=reciever_id)
        return user, reciever

    def get_or_create_room(self, user_id, reciever_id):
        user_ids = sorted([user_id, reciever_id])
        room_name = f"room_{user_ids[0]}_{user_ids[1]}_on_course_{self.course_id}"
        return room_name

    @database_sync_to_async
    def save_message(self, message):
        Message.objects.create(
            sender_id=self.user_id,
            receiver_id=self.reciever_id,
            course_id=self.course_id,
            chat_room=self.room_name,
            content=message
        )


class CommunityChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            self.course_id = self.scope["url_route"]["kwargs"]["course_id"]
            self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
            
            self.user = await self.get_user(self.user_id)
            if self.user.is_anonymous or str(self.user.id) != self.user_id:
                
                await self.close()
            else:
                self.room_name = self.get_or_create_room_name(self.course_id)
                self.room_group_name = f"community_chat_{self.room_name}"
                print(self.room_group_name)

                await self.channel_layer.group_add(
                    self.room_group_name,
                    self.channel_name
                )
                await self.accept()

        except Exception as e:
            print(e)
            await self.close()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json["message"]
            await self.save_message(message)

            await self.channel_layer.group_send(
                self.room_group_name,{
                    "type": "chat.message",
                    "message": message,
                    "user_name": self.user.name,
                    "user_id" : self.user_id
                }
            )
        except json.JSONDecodeError as e:
            print(e)
            pass
        except Exception as e:
            print(e)

    async def chat_message(self, event):
        message = event["message"]
        user_name = event["user_name"]
        user_id = event["user_id"]

        await self.send(text_data=json.dumps({"message":message,"user_name":user_name, "user_id": user_id}))

    @database_sync_to_async
    def get_user(self, user_id):
        user = CustomUser.objects.get(id=user_id)
        return user
    
    def get_or_create_room_name(self, course_id):
        room_name = f"community_room_on_course_{course_id}"
        return room_name
    @database_sync_to_async
    def save_message(self, message):
        CommunityMessage.objects.create(
            sender_id=self.user_id,
            course_id=self.course_id,
            chat_room=self.room_name,
            content=message
        )