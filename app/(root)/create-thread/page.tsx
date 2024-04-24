import { currentUser } from '@clerk/nextjs';
import { redirect } from "next/navigation";
import { fetchUser } from '@/lib/actions/user.actions';
import PostThread from '@/components/forms/PostThread';

async function Page() {
    // Récupérer l'utilisateur actuel
    const user = await currentUser();

    // Si aucun utilisateur n'est connecté, retourner null
    if (!user) return null;

    // Récupérer les informations de l'utilisateur
    const userInfo = await fetchUser(user.id);

    // Si l'utilisateur n'a pas terminé l'étape d'onboarding, rediriger vers la page d'onboarding
    if (!userInfo?.onboarded) redirect("/onboarding");

    return (
        <>
            <h1 className="head-text">Créer un fil de discussion</h1>
            <PostThread userId={userInfo._id} />
        </>
    );
}

export default Page;