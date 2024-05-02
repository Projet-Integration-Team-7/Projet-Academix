import datetime
from mongoengine import Document, StringField, ListField, DateTimeField
class Message(Document):
    user_id = StringField(required=True)
    conversation_id = StringField(required=True)
    created_at = DateTimeField(default=datetime.datetime.now)
    # Add other fields as needed

    meta = {
        'collection': 'messages'  # Optional: Specify the collection name
    }