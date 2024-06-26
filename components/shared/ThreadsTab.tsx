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
 * Composant représentant l'onglet des fils de discussion.
 * 
 * @param currentUserId - L'ID de l'utilisateur actuel.
 * @param accountId - L'ID du compte.
 * @param accountType - Le type de compte ('Community' ou 'User').
 * @returns Le composant de l'onglet des fils de discussion.
 */
const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {
  let result: any;

  if (accountType === 'Community') {
    result = await fetchCommunityPosts(accountId);
  } else {
    result = await fetchUserPosts(accountId);
  }

  if (!result) redirect('/')

  // Filtrer les threads pour n'inclure que ceux dont le threadType est 'exercise'

  return (
    <section className="mt-9 flex flex-col gap-10">
      Les images ne sont pas disponibles dans la page de profile,
      veuillez cliquer sur le bouton commenter pour accéder à la 
      page de la publication!
  {result.threads.map((thread: any) => (
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
export default ThreadsTab;