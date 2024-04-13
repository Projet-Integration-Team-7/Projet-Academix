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
            <h1  className="head-text t mb-10"> Ressources    </h1>
            <section className="mt-20 flex flex-col gap-"></section>

          <div>
            <h2 className="head-text  " >
              Educative websites links
            </h2>
                        <h2 className="head-text text-base  " >
                          Mathetamics
                                       </h2>
                                       <h2 className="head-text text-base  " >
                          Physics
                                       </h2>
                                       <h2 className="head-text text-base  " >
                          Chemistry
                                       </h2>
            </div>

<div>
            <h2 className="head-text  mb-5" >
              Educative Youtube channel
            </h2>
            <h2 className="head-text text-base  " >
                          Mathetamics
                                       </h2>
                                       <h2 className="head-text text-base  " >
                          Physics
                                       </h2>
                                       <h2 className="head-text text-base  " >
                          Chemistry
                                       </h2>
            
            </div>

            <div>
            <h2 className="head-text mb-5" >
              tutoring websites links
              <h2 className="head-text text-base  " >
                          Mathetamics
                                       </h2>
                                       <h2 className="head-text text-base  " >
                          Physics
                                       </h2>
                                       <h2 className="head-text text-base  " >
                          Chemistry
                                       </h2>
             </h2>
             </div>
            </section>
            )}
            export default Page

