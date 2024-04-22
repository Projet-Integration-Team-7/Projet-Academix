from openai import OpenAI, OpenAIError
import threading
import queue
import datetime
from langdetect import detect
from googletrans import Translator

# Initialiser le client OpenAI
client = OpenAI(api_key="")

# Dictionnaire global pour stocker le contexte de chaque utilisateur
contexte_utilisateur = {}

# Fonction pour interagir avec l'API OpenAI
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

# Fonction pour que le thread vérifie continuellement les nouveaux messages
def message_handler(q):
    while True:
        id_utilisateur, message = q.get()
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] Utilisateur {id_utilisateur}: {message}")

        # Vérifier si le message indique que l'étudiant a terminé
        if message.lower() == "end chat":
            print(f"[{timestamp}] Fermeture du chat pour l'utilisateur {id_utilisateur}...")
            contexte_utilisateur.pop(id_utilisateur, None)
            break  # Sortir de la boucle et terminer le programme

        reponse = ai_interaction(id_utilisateur, message, "asst_NZnrQifCumhsxO5QBvIZAoEM")
        print(f"[{timestamp}] IA: {reponse}")
        q.task_done()

# Créer une file d'attente pour stocker les messages entrants
message_queue = queue.Queue()

# Créer un thread pour le gestionnaire de messages
thread = threading.Thread(target=message_handler, args=(message_queue,))
thread.daemon = True
thread.start()

# Boucle principale pour simuler les messages entrants
while True:
    id_utilisateur = input("Identifiant de l'utilisateur: ")
    saisie_utilisateur = input("Vous: ")
    message_queue.put((id_utilisateur, saisie_utilisateur))
