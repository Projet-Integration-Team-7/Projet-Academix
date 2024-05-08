
import { currentUser } from '@clerk/nextjs';
import { redirect } from "next/navigation";
import { fetchUser, getActivity } from '@/lib/actions/user.actions'
import Link from 'next/link';
import Image from 'next/image';

async function Page() {
    // Récupérer l'utilisateur actuel
    const user = await currentUser();

    // Si l'utilisateur n'existe pas, retourner null pour éviter les avertissements TypeScript
    if (!user) return null;

    // Récupérer les informations de l'utilisateur
    const userInfo = await fetchUser(user.id);

    // Si l'utilisateur n'a pas encore été embarqué, le rediriger vers la page d'embarquement
    if (!userInfo?.onboarded) redirect('/onboarding');

    // Récupérer l'activité de l'utilisateur
    const activity = await getActivity(userInfo._id);



    return (

        <section>
            <h1 className="head-text mb-10">Activité   </h1>
            <section className="mt-10 flex flex-col gap-5">
                {activity.length > 0 ? (
                    <>
                        {activity.map((activity) => (
                            <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                                <article className="activity-card">
                                    <Image
                                        src={activity.author.image}
                                        alt="Profile Picture"
                                        width={20}
                                        height={20}
                                        className="rounded-full object-cover"
                                    />
                                    <p className="!text-small-regular text-light-1" >
                                        <span className="mr-1 text-primary-5" >
                                            {activity.author.name}

                                        </span>{" "}
                                        a répondu à votre thread !
                                    </p>
                                </article>
                            </Link>
                        ))}
                    </>
                ) : <p className="!text-base-regular text-light-3">pas d'activité encore </p>}

            </section>
        </section>
    )
}
export default Page
