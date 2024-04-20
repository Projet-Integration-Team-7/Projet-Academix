import { currentUser } from '@clerk/nextjs';
import { redirect } from "next/navigation";
import {fetchUser, getActivity} from '@/lib/actions/user.actions'
import Link from 'next/link';
import Image from 'next/image';
import { Main } from 'next/document';
import Timer from '@/components/forms/Timer';


async function Page( ){
    const user=await currentUser();


    if(!user) return null;


    const userInfo=await fetchUser(user.id);

    if(!userInfo?.onboarded)redirect('/onboarding');
    // getActivity  
    const activity=await getActivity(userInfo._id);



      return (

        <section>
            <h1  className="head-text mb-10"> Timer    </h1>
            <section className="mt-10 flex flex-col gap-5">
              <Timer />
            </section>
            </section>
            )}
            export default Page
