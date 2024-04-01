import { currentUser } from '@clerk/nextjs';
import { redirect } from "next/navigation";
import {fetchUser} from '@/lib/actions/user.actions'
import PostThread from '@/components/forms/PostThread';
import ProfileHeader from '@/components/shared/ProfileHeader';
import EditCard from '@/components/cards/EditCard';

async function Page(){
    const user=await currentUser();


    if(!user) return null;


    const userInfo=await fetchUser(user.id);


    if(!userInfo?.onboarded)redirect("/onboarding");
    return(
        <section>
        <h1 className="head-text mb-10">Modify Profile  </h1>
        <EditCard
              key={user.id + "-profile"}
              id={user.id}
              name={""}
              username={user.username}
              imgUrl={user.imageUrl}
              personType='User'
            />
        </section>
    )
}

export default Page;