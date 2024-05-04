import { currentUser } from '@clerk/nextjs';
import { redirect } from "next/navigation";
import {fetchUser} from '@/lib/actions/user.actions'
import PosterConversation from '@/components/forms/conversationMenu';

async function Page(){
    const user=await currentUser();


    if(!user) return null;


    const userInfo=await fetchUser(user.id);


    if(!userInfo?.onboarded)redirect("/onboarding");

    return (
        <>
    <h1 className="head-text">Conversation</h1>
    <PosterConversation userActif={userInfo}/>
    </>
    )
}
export default Page;