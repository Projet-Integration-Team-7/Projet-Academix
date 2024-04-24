
import { currentUser } from '@clerk/nextjs';
import { redirect } from "next/navigation";
import { fetchUser, getActivity } from '@/lib/actions/user.actions'
import Link from 'next/link';
import Image from 'next/image';
/**
 * Composant Page responsable de l'affichage des activités de l'utilisateur.
 * Il assure l'authentification de l'utilisateur, récupère les détails de l'utilisateur et ses activités.
 */

/**
 *Affiche les activités de l'utilisateur et les détails de l'utilisateur.
 * @returns 
 */
async function Page() {
    //Récupère l'utilisateur actuel
    const user = await currentUser();

    if (!user) return null;//Si l'utilisateur n'est pas connecté, retourne null

    const userInfo = await fetchUser(user.id);//Récupère les détails de l'utilisateur

    if (!userInfo?.onboarded) redirect('/onboarding');
    // Récupère les activités de l'utilisateur
    const activity = await getActivity(userInfo._id);


    return (
        // Affiche les activités de l'utilisateur
        <section>
            <h1 className="head-text mb-10">Activités</h1>
            <section className="mt-10 flex flex-col gap-5">
                {activity.length > 0 ? (
                    <>
                        {activity.map((activityItem) => (
                            <Link key={activityItem._id} href={`/thread/${activityItem.parentId}`}>
                                <article className="activity-card">
                                    <Image
                                        src={activityItem.author.image}
                                        alt="Photo de profil"
                                        width={20}
                                        height={20}
                                        className="rounded-full object-cover"
                                    />
                                    <p className="!text-small-regular text-light-1">
                                        <span className="mr-1 text-primary-5">
                                            {activityItem.author.name}
                                        </span>{" "}
                                        a répondu à votre post!
                                    </p>
                                </article>
                            </Link>
                        ))}
                    </>
                ) : (
                    <p className="!text-base-regular text-light-3">Aucune activité pour le moment</p>
                )}
            </section>
        </section>
    );
}
export default Page
