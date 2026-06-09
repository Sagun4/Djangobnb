import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import ConversationMessage


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        user = self.scope['user']
        if user.is_authenticated:
            # Join room
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
        else:
            await self.close()

    async def disconnect(self):
        # Leave room

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Recieve message from web sockets
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            payload = data.get('data', {})

            conversation_id = payload.get('conversation_id')
            sent_to_id = payload.get('sent_to_id')
            name = payload.get('name')
            body = payload.get('body')
            
            if not conversation_id or not sent_to_id or not body:
                print("ChatConsumer: Received incomplete payload:", data)
                return
            
            user = self.scope['user']
            sent_by_id = str(user.id) if user.is_authenticated else ''
            sent_by_name = user.name if user.is_authenticated else name
            sent_by_avatar_url = user.avatar_url() if (user.is_authenticated and hasattr(user, 'avatar_url')) else None

            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'body': body,
                    'name': name,
                    'sent_by_id': sent_by_id,
                    'sent_by_name': sent_by_name,
                    'sent_by_avatar_url': sent_by_avatar_url
                }
            )

            # Send notification to the recipient
            await self.channel_layer.group_send(
                f'user_{sent_to_id}',
                {
                    'type': 'chat_notification',
                    'conversation_id': conversation_id,
                    'body': body,
                    'name': sent_by_name,
                    'sent_by_id': sent_by_id
                }
            )

            await self.save_message(conversation_id, body, sent_to_id)
        except Exception as e:
            print("ChatConsumer error in receive:", str(e))
    
    # Sending messages
    async def chat_message(self, event):
        body = event['body']
        name = event['name']
        sent_by_id = event.get('sent_by_id', '')
        sent_by_name = event.get('sent_by_name', name)
        sent_by_avatar_url = event.get('sent_by_avatar_url', None)

        await self.send(text_data=json.dumps({
            'body': body,
            'name': name,
            'sent_by_id': sent_by_id,
            'sent_by_name': sent_by_name,
            'sent_by_avatar_url': sent_by_avatar_url
        }))

    @sync_to_async
    def save_message(self, conversation_id, body, sent_to_id):
        user = self.scope['user']
        from .models import Conversation
        from django.utils import timezone

        ConversationMessage.objects.create(conversation_id=conversation_id, body=body, sent_to_id=sent_to_id, created_by=user)
        # Also update the modified_at timestamp of the conversation
        Conversation.objects.filter(id=conversation_id).update(modified_at=timezone.now())


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        if user.is_authenticated:
            self.group_name = f'user_{user.id}'
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    async def chat_notification(self, event):
        await self.send(text_data=json.dumps(event))

    async def booking_notification(self, event):
        await self.send(text_data=json.dumps(event))