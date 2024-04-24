// Importation des modules et composants nécessaires
import { currentUser } from '@clerk/nextjs';
import { redirect } from "next/navigation";
import { fetchUser } from '@/lib/actions/user.actions';
import { fetchCommunities } from '@/lib/actions/community.actions';
import Community from '@/lib/models/community.model';

// Définition de la fonction asynchrone Page
async function Page() {
    // Récupérer l'utilisateur actuel
    const user = await currentUser();

    // Si aucun utilisateur n'est connecté, retourner null
    if (!user) return null;

    // Récupérer les informations de l'utilisateur
    const userInfo = await fetchUser(user.id);

    // Rediriger vers la page de création de profil si l'utilisateur n'a pas terminé l'onboarding
    if (!userInfo?.onboarded) redirect('/onboarding');

    // Récupérer les communautés
    const result = await fetchCommunities({
        searchString: '',
        pageNumber: 1,
        pageSize: 25
    });

    return (
        <section>
            <h1 className="head-text mb-10">Recherche</h1>
            {/* Barre de recherche */}
            <div className="mt-14 flex flex-col gap-9">
                {result.communities.length === 0 ? (
                    <p className="no-result">Aucune communauté</p>
                ) : (
                    <>
                        {result.communities.map((community) => (
                            <Community
                                key={community.id}
                                id={community.id}
                                name={community.name}
                                username={community.username}
                                imgUrl={community.image}
                                bio={community.bio}
                                members={community.members}
                            />
                        ))}
                    </>
                )}
            </div>
        </section>
    );
}

export default Page;
