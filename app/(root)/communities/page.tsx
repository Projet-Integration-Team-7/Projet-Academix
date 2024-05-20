// Importation des bibliothèques et des composants nécessaires
import { currentUser } from '@clerk/nextjs';
import { redirect } from "next/navigation";
import { fetchUser, fetchUserPosts, fetchUsers } from '@/lib/actions/user.actions'
import { fetchCommunities } from '@/lib/actions/community.actions';
import CommunityCard from '@/components/cards/CommunityCard';



// Définition de la fonction Page
async function Page() {
  // Récupération de l'utilisateur courant
  const user = await currentUser();

  // Si l'utilisateur n'existe pas, retourner null
  if (!user) throw new Error("Utilisateur non trouvé");

  // Récupération des informations de l'utilisateur
  const userInfo = await fetchUser(user.id);

  // Si l'utilisateur n'est pas embarqué, rediriger vers '/onboarding'
  if (!userInfo?.onboarded) redirect('/onboarding');

  // Récupération des communautés
  const result = await fetchCommunities({
    searchString: '',
    pageNumber: 1,
    pageSize: 25
})
    return (
        <section><h1  className="head-text mb-10">Recherche
            </h1>
            {/* search bar */}
            <div className="mt-14 flex flex-col gap-9">
                </div>
            </section>
{result.communities.length===0 ? (
    <p className="no-result">       Pas de communauté  </p>
)
: (
    <>
    {result.communities.map((community) => (
    <CommunityCard
    key={community.id}
    id={community.id}
    name={community.name}
    username={community.username}
    imgUrl={community.image}
    bio={"Ouvert à tous!"}
    members={community.members}
    />
    ))}
    </>
)
}

// Exportation de la fonction Page par défaut
export default Page;