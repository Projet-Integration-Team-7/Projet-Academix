import datetime
from mongoengine import Document, StringField, ListField, DateTimeField, ReferenceField
from .messagemodel import Message

class Conversation(Document):
    name = StringField(required=True, default='New Conversation')
    participants = ListField(StringField(), required=True)
    messages = ListField(ReferenceField(Message))
    createdAt = DateTimeField(default=datetime.datetime.now)
    updatedAt = DateTimeField(default=datetime.datetime.now)

    meta = {
        'collection': 'conversations'  # Optional: Specify the collection name
    }