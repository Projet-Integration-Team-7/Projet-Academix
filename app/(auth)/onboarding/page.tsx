import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser } from "@/lib/actions/user.actions";
import AccountProfile from "@/components/forms/AccountProfile";

async function Page() {
  // Récupérer l'utilisateur actuel
  const user = await currentUser();
  // Si l'utilisateur n'existe pas, retourner null pour éviter les avertissements TypeScript
  if (!user) throw new Error("Utilisateur non trouvé"); 

  // Récupérer les informations de l'utilisateur
  const userInfo = await fetchUser(user.id);
  // Si l'utilisateur a déjà été embarqué, le rediriger vers la page d'accueil
  if (userInfo?.onboarded) redirect('/');

  // Préparer les données de l'utilisateur pour le profil
  const userData = {
    id: user.id,
    objectId: userInfo?._id,
    username: userInfo?.username || user.username,
    name: userInfo?.name || user.firstName || "",
    bio: userInfo?.bio || "",
    image: userInfo?.image || user.imageUrl,
  };

  // Retourner le composant principal de la page
  return (
    <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
      <h1 className='head-text'>Onboarding</h1>
      <p className='mt-3 text-base-regular text-light-2'>
        Complétez votre profil maintenant, pour utiliser Threds.
      </p>

      <section className='mt-9 bg-dark-2 p-10'>
        <AccountProfile user={userData} btnTitle='Continue' />
      </section>
    </main>
  );
}

export default Page;