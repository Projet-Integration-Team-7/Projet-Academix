from flask import Flask, request, jsonify
import httpx
import openai
from openai import OpenAIError
import threading
import queue
import datetime
import os
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv('.env.local')

# Initialiser le client OpenAI
client = openai.Client(api_key= os.getenv('OPENAI_API_KEY'))

# Dictionnaire global pour stocker le contexte de chaque utilisateur
contexte_utilisateur = {}

# Fonction pour interagir avec l'API OpenAI
def ai_interaction(id_utilisateur, texte_entree):
    try:
        contexte = contexte_utilisateur.get(id_utilisateur, [])

        message = {
            "role": "user",
            "content": texte_entree
        }
        contexte.append(message)

        chat_completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=contexte
        )

        # Extraire le message de l'assistant de la réponse
        assistant_message = chat_completion.choices[0].message.content

        # Ajouter le message de l'assistant au contexte
        contexte.append({
            "role": "assistant",
            "content": assistant_message
        })

        contexte_utilisateur[id_utilisateur] = contexte

        return assistant_message
    except OpenAIError as e:
        if "Réessayez plus tard" in str(e):
            return "Désolé, nous avons rencontré une erreur. Veuillez réessayer plus tard."
        else:
            print(f"Exception: {e}")
            return "Désolé, je n'ai pas compris. Veuillez reformuler votre question."
    except Exception as e:
        print(f"Exception: {e}")
        return "Désolé, nous avons rencontré une erreur. Veuillez essayer de rafraîchir la page."

# Fonction pour le thread qui vérifie continuellement les nouveaux messages
def message_handler(q):
    while True:
        id_utilisateur, message = q.get()
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] Utilisateur {id_utilisateur}: {message}")

        # Vérifier si le message n'est pas None et indique que l'utilisateur a terminé
        if message and isinstance(message, str) and message.lower() == "end chat":
            print(f"[{timestamp}] Fermeture du chat pour l'utilisateur {id_utilisateur}...")
            contexte_utilisateur.pop(id_utilisateur, None)
            break # Sortir de la boucle et terminer le programme

        reponse = ai_interaction(id_utilisateur, message)
        print(f"[{timestamp}] IA: {reponse}")
        q.task_done()

# Créer une file d'attente pour stocker les messages entrants
message_queue = queue.Queue()

# Créer un thread pour le gestionnaire de messages
thread = threading.Thread(target=message_handler, args=(message_queue,))
thread.daemon = True
thread.start()

# Créer une application Flask
app = Flask(__name__)
CORS(app)  

# Point de terminaison pour recevoir les messages des utilisateurs
@app.route('/message', methods=['POST'])
def handle_message():
    try:
        data = request.json
        id_utilisateur = data.get('id_utilisateur')
        saisie_utilisateur = data.get('saisie_utilisateur')

        if id_utilisateur is None or saisie_utilisateur is None:
            return jsonify({'message': 'Format de requête invalide'}), 400

        message_queue.put((id_utilisateur, saisie_utilisateur))
        reponse = ai_interaction(id_utilisateur, saisie_utilisateur)
        return jsonify({'message': reponse})
    except Exception as e:
        return jsonify({'message': 'Une erreur est survenue', 'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
