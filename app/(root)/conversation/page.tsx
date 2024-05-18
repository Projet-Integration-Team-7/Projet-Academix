// Importation des modules et des fonctions nécessaires
import { currentUser } from '@clerk/nextjs'; // Importe la fonction pour obtenir l'utilisateur actuel
import { redirect } from "next/navigation"; // Importe la fonction pour rediriger vers une autre page
import { fetchUser } from '@/lib/actions/user.actions'; // Importe la fonction pour récupérer les informations d'un utilisateur
import PosterConversation from '@/components/forms/conversationMenu'; // Importe le composant pour afficher le formulaire de création de conversation

// Définition de la fonction de la page
async function Page() {
    // Obtient l'utilisateur actuel
    const user = await currentUser();

    // Vérifie si aucun utilisateur n'est connecté, puis arrête le rendu de la page
    if (!user) return null;

    // Récupère les informations détaillées de l'utilisateur à partir de son ID
    const userInfo = await fetchUser(user.id);

    // Vérifie si l'utilisateur a terminé le processus d'onboarding, sinon redirige vers la page d'onboarding
    if (!userInfo?.onboarded) redirect("/onboarding");

    // Rendu de la page avec le titre "Conversation" et le formulaire de création de conversation
    return (
        <>
            <h1 className="head-text">Conversation</h1>
            <PosterConversation userActif={userInfo} />
        </>
    );
}

// Exporte la fonction de la page
export default Page;
