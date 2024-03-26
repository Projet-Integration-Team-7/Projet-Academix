import { currentUser } from '@clerk/nextjs';
import { redirect } from "next/navigation";
import {fetchUser} from '@/lib/actions/user.actions'
import { string } from 'zod';
import ProfileHeader from '@/components/shared/ProfileHeader';
import { Link, NavLink } from 'react-router-dom';
import {Tabs, TabsContent, TabsList ,TabsTrigger } from '@/components/ui/tabs'
import { profileTabs } from '@/constants';
import Image from 'next/image';
import ThreadsTab from '@/components/shared/ThreadsTab';
async function Page({ params } :{ params : { id : string}}){
    const user=await currentUser();


    if(!user) return null;


    const userInfo=await fetchUser(params.id);


    if(!userInfo?.onboarded)redirect('/onboarding');
    return(
    <section >
     <div className="flex items-center">





        <ProfileHeader 
               accountId={userInfo.id}
               authUserId={user.id}
               name={userInfo.name}
               username={userInfo.username}
               imgUrl={userInfo.image}
               bio={userInfo.bio}
        />
        <NavLink to="/"> 
         <button className="py-2 px-4 rounded text-white font-bold bg-black hover:bg-purple-300 focus:bg-purple-300 focus:outline-none">
Modifier Profile 
                
   </button>
   </NavLink>
   </div>     
<div className='mt-9'>
<Tabs defaultValue='threads' className="w-full">
    <TabsList className="tab">
{profileTabs.map(   (tab)=> (
    <TabsTrigger key={tab.label} value ={tab.value}
    className="tab">
        <Image
        src={tab.icon}
        alt={tab.label}
        width={24}
        height={24}
        className="object-contain"
        />
        <p className="max-sm:hidden">
            {tab.label}
        </p>
        {tab.label==='Threads' &&
    

        (
<p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
    {userInfo?.threads?.length}


</p>
        

        )}
    </TabsTrigger>
)
)}
    </TabsList>
    {profileTabs.map(   (tab)=>(
                /*Info necessaire pour supprimer le thread*/

        <TabsContent key={'content-${tab.label}'}value={tab.value}
        className="w-full text-light-1"> 
             <  ThreadsTab
             currentUserId={user.id}
             accountId={userInfo.id}
             accountType="User"
             />
        </TabsContent>    
    )  )}
</Tabs>

</div> </section>
    )
    
}

export default Page;