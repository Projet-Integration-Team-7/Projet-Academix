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
 * Composant CourseNoteTab.
 * 
 * Ce composant affiche les notes de cours pour un utilisateur ou une communauté spécifique.
 * Il récupère les threads de notes de cours en fonction du type de compte (utilisateur ou communauté).
 * Les threads sont filtrés pour n'inclure que ceux dont le threadType est 'course_note'.
 * Chaque thread est affiché sous forme de carte ThreadCard.
 * 
 * @param currentUserId - L'ID de l'utilisateur actuel.
 * @param accountId - L'ID du compte (utilisateur ou communauté).
 * @param accountType - Le type de compte ('User' pour utilisateur, 'Community' pour communauté).
 * @returns Le composant CourseNoteTab.
 */
const CourseNoteTab = async ({ currentUserId, accountId, accountType }: Props) => {
  let result: any;

  if (accountType === 'Community') {
    result = await fetchCommunityPosts(accountId);
  } else {
    result = await fetchUserPosts(accountId);
  }

  if (!result) redirect('/')

  // Filtrer les threads pour n'inclure que ceux dont le threadType est 'course_note'
  const exerciseThreads = result.threads.filter((thread: any) => thread.threadType === 'course_note');

  return (
    <section className="mt-9 flex flex-col gap-10">
      Notes de cours
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
  export default CourseNoteTab;