// Importation des dépendances nécessaires
import { useEffect } from 'react';
import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

// Définition du composant Page
const Page = async ({ params }: { params: { id: string } }) => {
    // Si l'ID n'est pas fourni, on arrête l'exécution
    if (!params.id) return null;

    // Récupération de l'utilisateur courant
    const user = await currentUser();
    // Si l'utilisateur n'est pas connecté, on arrête l'exécution
    if (!user) return null;

    // Récupération des informations de l'utilisateur
    const userInfo = await fetchUser(user.id);
    // Si l'utilisateur n'a pas terminé son inscription, on le redirige vers la page d'onboarding
    if (!userInfo?.onboarded) redirect('/onboarding')

    // Récupération du fil de discussion par son ID
    const thread = await fetchThreadById(params.id)

    // Rendu du composant
    return (
        <section className="relative">
            <div>
            <ThreadCard 
                   key={thread._id}
                   id={JSON.stringify(thread._id)}
                   currentUserId={user?.id || " "}
                   parentId={thread.parentId}
                   content={thread.text}
                   author={thread.author}
                   community={thread.community}
                   imgUrl={thread.image || ""}
                   createdAt={thread.createdAt.toString()}
                   comments={thread.children}
                   isConnected={user !== null}
                   likes={thread.likes.toObject()}
                   threadType={thread.threadType} currentUser={null}                />
            </div>

            <div className="mt-7">
                <Comment
                    threadId={thread.id}
                    currentUserImg={userInfo.image}
                    currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>

            <div className="mt-10">
                {thread.children.map((childItem: any) => (
                    <ThreadCard
                        key={childItem._id}
                        id={JSON.stringify(childItem._id)}
                        currentUserId={user?.id || " "}
                        parentId={childItem.parentId}
                        content={childItem.text}
                        author={childItem.author}
                        community={childItem.community}
                        imgUrl={""}
                        createdAt={childItem.createdAt}
                        comments={childItem.children}
                        likes={childItem.likes.toObject()}
                        isComment
                        isConnected={user !== null}
                        threadType={thread.threadType} currentUser={null}                    />
                ))}
            </div>
        </section>
    )

}


export default Page;