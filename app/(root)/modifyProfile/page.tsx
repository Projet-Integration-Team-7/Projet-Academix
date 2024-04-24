import { currentUser } from '@clerk/nextjs';
import { redirect } from "next/navigation";
import { fetchUser } from '@/lib/actions/user.actions';
import PostThread from '@/components/forms/PostThread';
import ProfileHeader from '@/components/shared/ProfileHeader';
import EditCard from '@/components/cards/EditCard';

async function Page() {
    // Récupère l'utilisateur actuel
    const user = await currentUser();

    // Si aucun utilisateur n'est connecté, retourne null
    if (!user) return null;

    // Récupère les informations de l'utilisateur
    const userInfo = await fetchUser(user.id);

    // Si l'utilisateur n'a pas terminé l'onboarding, redirige vers la page "/onboarding"
    interface Props {
        id: string;
        name: string;
        username: string | null;
        imgUrl: string;
        personType: string;
    }
}

export default Page;