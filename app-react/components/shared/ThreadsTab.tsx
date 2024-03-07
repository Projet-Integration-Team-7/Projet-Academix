import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/dist/server/api-utils";
import { permanentRedirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";

/*Permet de poouvoir fetch les postes appartenant à cet exact utilisateur */
interface Props{
    currentUserId : string ;
    accountId : string ;
    accountType : string ;
}

const ThreadsTab=async ({currentUserId,accountId,accountType} :
     Props ) => {
let result=await fetchUserPosts(accountId);
if(!result) redirect('/')


    return (
    <section className="mt-9 flex flex-col gap-10">
        ThreadsTab
        {result.threads.map((thread : any) => (
         <ThreadCard 
         key={thread._id}
         id={thread._id}
         currentUserId={currentUserId}
         parentId={thread.parentId}
         content={thread.text}
         author={
            accountType==='User'
        ? { name : result.name, image : result.image, id: result.id}
        : {name : thread.author.name,image : thread.author.image,
          id: thread.author.id }
        }
         community={thread.community}// todo
         createdAt={thread.ceatedAt}
         comments={thread.children}
         />
        )
        )}
    </section>
)
}
export default ThreadsTab;