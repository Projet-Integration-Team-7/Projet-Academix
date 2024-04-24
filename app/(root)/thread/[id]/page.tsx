import { useEffect, useState } from 'react';
import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
// Le composant Page prend un paramètre id pour récupérer et afficher un fil de discussion spécifique

const Page = async ({ params }: { params: { id: string } }) => {
    // Si aucun id n'est fourni, retourner null

    if (!params.id) return null;
    // Utilisez le hook useState pour stocker le fil de discussion

    const [thread, setThread] = useState<any>(null); // Utilisez le hook useState pour stocker le thread
    // Récupérer l'utilisateur actuel

    const user = await currentUser();
    // Si aucun utilisateur n'est connecté, retourner null

    if (!user) return null;
    // Récupérer les informations de l'utilisateur

    const userInfo = await fetchUser(user.id);
    // Si l'utilisateur n'a pas terminé l'intégration, le rediriger vers la page d'intégration

    if (!userInfo?.onboarded) redirect('/onboarding');
    // Utilisez le hook useEffect pour récupérer le fil de discussion par son id toutes les 5 secondes

    useEffect(() => {
        const interval = setInterval(() => {
            fetchThreadById(params.id).then(updatedThread => {
                setThread(updatedThread); // Mettez à jour le thread avec le nouveau thread récupéré
            });
        }, 5000); // 5 secondes

        return () => clearInterval(interval);
    }, [params.id]);
    // Rendre le fil de discussion et ses commentaires

    return (
        <section className="relative">
            <div>
                <ThreadCard
                    key={thread?._id}
                    id={thread?._id}
                    currentUserId={user?.id || " "}
                    parentId={thread?.parentId}
                    content={thread?.text}
                    author={thread?.author}
                    community={thread?.community}
                    imgUrl={thread?.image || ""}
                    createdAt={thread?.createdAt?.toString()}
                    comments={thread?.children}
                    likes={thread?.likes?.toObject()}
                    threadType={thread?.threadType}
                    currentUser={null}
                />
            </div>

            <div className="mt-7">
                <Comment
                    threadId={thread?.id}
                    currentUserImg={userInfo?.image}
                    currentUserId={JSON.stringify(userInfo?._id)}
                />
            </div>

            <div className="mt-10">
                {thread?.children.map((childItem: any) => (
                    <ThreadCard
                        key={childItem._id}
                        id={childItem._id}
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
                        threadType={thread?.threadType}
                        currentUser={null}
                    />
                ))}
            </div>
        </section>
    )
}

export default Page;