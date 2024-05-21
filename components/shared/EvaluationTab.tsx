import { fetchUserPosts } from "@/lib/actions/user.actions";
import { permanentRedirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";
import { redirect } from "next/navigation";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

/*Permet de poouvoir fetch les postes appartenant à cet exact utilisateur */
interface Props{
    currentUserId : string ;
    accountId : string ;
    accountType : string ;
}

/**
 * Composant de l'onglet d'évaluation.
 * 
 * @param currentUserId - L'ID de l'utilisateur actuel.
 * @param accountId - L'ID du compte.
 * @param accountType - Le type de compte.
 * @returns Le composant de l'onglet d'évaluation.
 */
const EvaluationTab = async ({ currentUserId, accountId, accountType }: Props) => {
    let result: any;
  
    if (accountType === 'Community') {
      result = await fetchCommunityPosts(accountId);
    } else {
      result = await fetchUserPosts(accountId);
    }
  
    if (!result) redirect('/')
  
    // Filtrer les threads pour n'inclure que ceux dont le threadType est 'evaluation'
    const exerciseThreads = result.threads.filter((thread: any) => thread.threadType === 'evaluation');
  
    return (
      <section className="mt-9 flex flex-col gap-10">
        Tableau d'évaluation
        {exerciseThreads.map((thread: any) => (
          <ThreadCard
            key={thread._id}
            id={JSON.parse(JSON.stringify(thread._id))}
            currentUserId={currentUserId}
            parentId={thread.parentId}
            content={thread.text}
            author={accountType === 'User'
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: thread.author.name, image: thread.author.image,
                  id: thread.author.id
                }}
            community={null} // todo
            createdAt={thread.createdAt}
            comments={thread.children}
            likes={thread.likes.toObject()} currentUser={null} threadType={thread.threadType} />
        ))}
      </section>
    )
}
  export default EvaluationTab;