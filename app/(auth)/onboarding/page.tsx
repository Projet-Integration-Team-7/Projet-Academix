
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import AccountProfile from "@/components/forms/AccountProfile";
/**
 * Récupère les informations de l'utilisateur actuel et affiche la page de profil d'intégration.
 * Si l'utilisateur a déjà complété son intégration, redirige vers la page d'accueil.
 */
async function Page() {
  // Tentative de récupération de l'utilisateur courant via Clerk.
  const user = await currentUser();
  if (!user) return null; // to avoid typescript warnings
  // Récupération des informations supplémentaires de l'utilisateur depuis un backend personnalisé.
  const userInfo = await fetchUser(user.id);

  // Redirection si l'utilisateur a déjà terminé son intégration.
  if (userInfo?.onboarded) {
    redirect('/');
    return;
  }
  // Compilation des données utilisateur, en utilisant des valeurs de substitution pour les informations manquantes.

  const userData = {
    id: user?.id,
    objectId: userInfo?._id,
    username: userInfo ? userInfo?.username : user?.username,
    name: userInfo ? userInfo?.name : user?.firstName || "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo?.image : user?.imageUrl,
  };
  // Affichage de la page d'intégration avec le composant de formulaire AccountProfile.

  return (
    <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
      <h1 className='head-text'>Onboarding</h1>
      <p className='mt-3 text-base-regular text-light-2'>
        Completer votre profile,pour utiliser Academix
      </p>

      <section className='mt-9 bg-dark-2 p-10'>
        <AccountProfile user={userData} btnTitle='Continue' />
      </section>
    </main>
  );
}

export default Page;
