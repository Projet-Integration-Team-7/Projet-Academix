from flask import Flask, request, jsonify
import httpx
from openai import OpenAI, OpenAIError
import threading
import queue
import datetime
import os
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

# Initialiser le client OpenAI
client = OpenAI(api_key='')

# Global dictionary to store the context of each user
contexte_utilisateur = {}

# Function to interact with the OpenAI API
def ai_interaction(id_utilisateur, texte_entree):
    try:
        contexte = contexte_utilisateur.get(id_utilisateur)
        if not contexte:
            contexte = None

        reponse = client.Completion.create(
            model="gpt-3.5-turbo",
            prompt=texte_entree,
            max_tokens=100,
            context=contexte
        )

        contexte_utilisateur[id_utilisateur] = reponse.choices[0].context

        return reponse.choices[0].text.strip()
    except OpenAIError as e:
        if "Réessayez plus tard" in str(e):
            return "Désolé, nous avons rencontré une erreur. Veuillez réessayer plus tard."
        else:
            return "Désolé, je n'ai pas compris. Veuillez reformuler votre question."
    except Exception as e:
        return "Désolé, nous avons rencontré une erreur. Veuillez essayer de rafraîchir la page."

# Function for the thread to continuously check for new messages
def message_handler(q):
    while True:
        id_utilisateur, message = q.get()
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] Utilisateur {id_utilisateur}: {message}")

        # Check if the message is not None and indicates that the user has finished
        if message and isinstance(message, str) and message.lower() == "end chat":
            print(f"[{timestamp}] Fermeture du chat pour l'utilisateur {id_utilisateur}...")
            contexte_utilisateur.pop(id_utilisateur, None)
            break # Exit the loop and end the program

        reponse = ai_interaction(id_utilisateur, message)
        print(f"[{timestamp}] IA: {reponse}")
        q.task_done()

# Create a queue to store incoming messages
message_queue = queue.Queue()

# Create a thread for the message handler
thread = threading.Thread(target=message_handler, args=(message_queue,))
thread.daemon = True
thread.start()

# Create a Flask application
app = Flask(__name__)
CORS(app)  # Enable CORS

# Endpoint to receive messages from users
@app.route('/message', methods=['POST'])
def handle_message():
    try:
        data = request.json
        id_utilisateur = data.get('id_utilisateur')
        saisie_utilisateur = data.get('saisie_utilisateur')

        if id_utilisateur is None or saisie_utilisateur is None:
            return jsonify({'message': 'Invalid request format'}), 400

        message_queue.put((id_utilisateur, saisie_utilisateur))
        reponse = ai_interaction(id_utilisateur, saisie_utilisateur)
        return jsonify({'message': reponse})
    except Exception as e:
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)