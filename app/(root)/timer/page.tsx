import { currentUser } from '@clerk/nextjs';
import { redirect } from "next/navigation";
import { fetchUser, getActivity } from '@/lib/actions/user.actions'
import Pomodoro from '@/components/forms/Pomodoro';
// ceci est la page de la minuterie pomodoro 
async function Page() {
  const user = await currentUser();

//verification de l'utilisateur
  if (!user) return null;

//declaration de la variable userInfo
  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect('/onboarding');
  const activity = await getActivity(userInfo._id);


// retour   de la page de la minuterie pomodoro
  return (

    <section>
      <h1 className="head-text mb-10">Pomodoro minuterie   </h1>
      <section className="mt-10 flex flex-col gap-5">
        <div className='max-w-2xl min-h-screen mx-auto'>
          <Pomodoro />
        </div>
      </section>
    </section>
  )
}
export default Page
