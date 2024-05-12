
import { currentUser } from '@clerk/nextjs';
import { redirect } from "next/navigation";
import {fetchUser, getActivity} from '@/lib/actions/user.actions'
import Link from 'next/link';
import Image from 'next/image';


async function Page( ){
    const user=await currentUser();


    if(!user) return null;


    const userInfo=await fetchUser(user.id);

    if(!userInfo?.onboarded)redirect('/onboarding');
    // getActivity  
    const activity=await getActivity(userInfo._id);


    
      return (

        <section>
            <h1  className="head-text mb-10">Activité   </h1>
            <section className="mt-10 flex flex-col gap-5">
                {activity.length>0 ?(
                 <>
                 {activity.map((activity) =>(
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
a répondu à votre publication !
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
