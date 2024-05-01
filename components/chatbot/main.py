import shutil
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



# Créer une application Flask
app = Flask(__name__)
CORS(app)  


load_dotenv('.env.local')
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Supprimer le contenu du dossier de téléchargement
def cleanup_upload_folder():
    shutil.rmtree(UPLOAD_FOLDER, ignore_errors=True)
    os.makedirs(UPLOAD_FOLDER)

# Appeler la fonction de nettoyage au démarrage de l'application
cleanup_upload_folder()

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# Initialiser le client OpenAI
client = openai.Client(api_key= os.getenv('OPENAI_API_KEY'))
assistantID = "asst_XMH0o0urrQx6x5I0iKhmdYjB"


# Dictionnaire global pour stocker le contexte de chaque utilisateur
contexte_utilisateur = {}

files= []
# Fonction pour interagir avec l'API OpenAI
def ai_interaction(id_utilisateur, texte_entree):
    try:
        contexte = contexte_utilisateur.get(id_utilisateur, [])
        uploaded_files = []
        if files:
            for file in files:
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], file)
                uploaded_file = client.files.create(
                    file = open(file_path, "rb"), purpose = "assistants"
                )
                uploaded_files.append(uploaded_file)
            


        # Create a thread with the user message and updated files
        thread = client.beta.threads.create(
            messages=[
                {
                    "role": "user",
                    "content": texte_entree,
                    "attachments": [
                        { "file_id": uploaded_file.id, "tools": [{"type": "file_search"}]}
                        for uploaded_file in uploaded_files
                    ],
                }
            ]
        )


        # Start the assistant in the thread
        run = client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=assistantID,
            model = "gpt-4-turbo"
        )

        # Wait for the assistant to complete
        while run.status != 'completed':
            run = client.beta.threads.runs.retrieve(
                thread_id=thread.id,
                run_id=run.id
            )
            print(run.status)
        
        messages = client.beta.threads.messages.list(thread.id)
        user_message_id = messages.data[0].id

        message = client.beta.threads.messages.retrieve(
         thread_id=thread.id,
         message_id= user_message_id
)

        # Extract the assistant message
        assistant_message_content = message.content[0].text
        assistant_message = assistant_message_content.value

        # Add the assistant message to the context
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


@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        uploaded_files = request.files.getlist('file')

        if not uploaded_files:
            return jsonify({'message': 'No files uploaded'}), 400

        # Add the uploaded files to the global files list
        for file in uploaded_files:
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
                files.append(file.filename)
            
        return jsonify({'message': 'Files uploaded successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500

    
if __name__ == '__main__':
    app.run(debug=True)
