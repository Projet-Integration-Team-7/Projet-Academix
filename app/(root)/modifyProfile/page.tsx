// Importation des bibliothèques et des composants nécessaires
import { currentUser } from '@clerk/nextjs';
import { redirect } from "next/navigation";
import { fetchUser } from '@/lib/actions/user.actions';
import EditCard from '@/components/cards/EditCard';

// Définition de la fonction Page
async function Page() {
  // Récupération de l'utilisateur courant
  const user = await currentUser();

  // Si l'utilisateur n'existe pas, retourner null
  if (!user) throw new Error("Utilisateur non trouvé");

  // Récupération des informations de l'utilisateur
  const userInfo = await fetchUser(user.id);

  // Si l'utilisateur n'est pas embarqué, rediriger vers '/onboarding'
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Retourne le JSX à rendre
return (
    <section>
        <h1 className="head-text mb-10">Modifier Profil</h1>
        <EditCard
            key={user.id + "-profile"}
            id={user.id}
            name={""}
            username={user.username ?? ""}
            imgUrl={user.imageUrl}
            personType='User'
        />
    </section>
);
}

// Exportation de la fonction Page par défaut
export default Page;