import os
from flask import Blueprint, request, jsonify
from flask_socketio import SocketIO, emit
from mongoengine import connect, errors
from dotenv import load_dotenv
from flask_cors import CORS
from .models.conversationmodel import Conversation
from .models.messagemodel import Message
from pymongo.errors import ServerSelectionTimeoutError

chat_app = Blueprint('chat', __name__)
CORS(chat_app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO()  
#Initiliaze clerk
load_dotenv('.env.local')  

@chat_app.record_once
def on_load(state):
    try:
        db = connect(host=os.getenv('MONGODB_URL'))
        # Attempt to retrieve a document from the database
        db.list_database_names()
        print("MongoDB connection successful")
    except (ServerSelectionTimeoutError, errors.ConnectionFailure):
        print("MongoDB connection failed")

#option method to allow cross origin
@chat_app.route('/createConversation', methods=['OPTIONS'])
def handle_options():
    response = jsonify({'message': 'OK'})
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'POST')
    return response
#create conversation post method
@chat_app.route('/createConversation', methods=['POST'])
def create_conversation():
    data = request.json
    name = str(data.get('name'))
    participants = str(data.get('participants'))
    conversation = Conversation(name=name, participants=(participants))
    conversation.save()
    response =jsonify({'message': 'Conversation created successfully', 'conversation_id': str(conversation.id)})
    return response 


#fonction get conversation
@chat_app.route('/getConversations/<string:user_id>', methods=['GET'])
def get_conversations(user_id):
    try:
        conversations = Conversation.objects(participants=user_id).order_by('-updatedAt')
        conversations_data = [{'id': str(conv.id), 'name': conv.name} for conv in conversations]
        return jsonify({'conversations': conversations_data})
    except Exception as e:
        print('Error fetching conversations:', e)
        return jsonify({'error': 'Failed to fetch conversations'}), 500
    
#fonction pour retrouver tous les messages d'une conversation
@chat_app.route('/getMessages/<string:conv_id>', methods=['GET'])
def get_messages(conv_id):
    try:
        conversation = Conversation.objects.get(id=conv_id)
        messages = Message.objects(conversation=conversation).order_by('createdAt')
        message_data = [{'id': str(msg.id), 'text': msg.text, 'user_id': msg.user_id, 'createdAt': msg.createdAt} for msg in messages]
        return jsonify({'messages': message_data})
    except Exception as e:
        print('Error fetching messages:', e)
        return jsonify({'error': 'Failed to fetch messages'}), 500

#socketio io function to receive messages
@socketio.on('messageReceived')
def handle_message(data):
    try:
        conversation_id = data.get('conversation_id')
        message = data.get('message')
        
        # Handle the message (e.g., save it to the conversation)
        
        emit('message', {'conversation_id': conversation_id, 'message': message}, broadcast=True)
    
    except Exception as e:
        print(f"Error handling message: {e}")

#socketio function to send messages
@socketio.on('sendMessage')
def handle_message(data):
    try:
        conversation_id = data.get('conversation_id')
        text = data.get('text')
        user_id = data.get('user_id')
        
        conversation = Conversation.objects.get(id=conversation_id)
        message = Message(conversation=conversation, text=text, user_id=user_id)
        message.save()

        message_data = {'id': str(message.id), 'text': message.text, 'user_id': message.user_id, 'createdAt': message.createdAt}
        socketio.emit('message', {'conversation_id': conversation_id, 'message': message_data}, broadcast=True)

    except Exception as e:
        print('Error handling message:', e)

def init_socketio(app):
    socketio.init_app(app)
