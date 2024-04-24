import React from 'react';
import { currentUser } from '@clerk/nextjs';
import { redirect } from "next/navigation";
import { fetchUser } from '@/lib/actions/user.actions';
import Link from 'next/link';
import Image from 'next/image';

async function Page() {
  // Récupérer l'utilisateur actuel
  const user = await currentUser();

  if (!user) return null;

  // Récupérer les informations de l'utilisateur
  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect('/onboarding');
  // Retourner le composant de la page
  return (
    <section>
      <h1 className="head-text t mb-10">Ressources</h1>
      <section className="mt-20 flex flex-col gap-"></section>

      <div>
        <h2 className="head-text">Liens vers des sites éducatifs</h2>
        <h2 className="head-text text-base">Section d'apprentissage</h2>
        <div>
          <p className="mb-6"><a href="https://www.coursera.org/" className="text-purple-500 text-sm font-bold">Site web Khan Academy</a></p>
          <p className="mb-6"><a href="https://www.edx.org/" className="text-purple-500 text-sm font-bold">Site web edX</a></p>
          <p className="mb-6"><a href="https://www.coursera.org/" className="text-purple-500 text-sm font-bold">Site web Coursera</a></p>
          <p className="mb-6"><a href="https://www.udemy.com/" className="text-purple-500 text-sm font-bold">Site web Udemy</a></p>
          <p className="mb-6"><a href="https://www.codecademy.com/" className="text-purple-500 text-sm font-bold">Site web Codecademy</a></p>
          <p className="mb-6"><a href="https://ocw.mit.edu/index.htm" className="text-purple-500 text-sm font-bold">Site web MIT OpenCourseWare</a></p>
          <p className="mb-6"><a href="https://www.futurelearn.com/" className="text-purple-500 text-sm font-bold">Site web FutureLearn</a></p>
          <p className="mb-6"><a href="https://www.coursera.org/" className="text-purple-500 text-sm font-bold">Site web Coursera</a></p>
          <p className="mb-6"><a href="https://www.udacity.com/" className="text-purple-500 text-sm font-bold">Site web Udacity</a></p>
          <p className="mb-6"><a href="https://www.alison.com/" className="text-purple-500 text-sm font-bold">Site web Alison</a></p>
          <p className="mb-6"><a href="https://www.udemy.com/" className="text-purple-500 text-sm font-bold">Site web Udemy</a></p>
        </div>

        <h2 className="head-text text-base">Section d'exercices</h2>
        <div>
          <p className="mb-6"><a href="https://www.physicsclassroom.com/" className="text-purple-500 text-sm font-bold">Physics Classroom</a></p>
          <p className="mb-6"><a href="http://tutorial.math.lamar.edu/" className="text-purple-500 text-sm font-bold">Paul's Online Math Notes</a></p>
          <p className="mb-6"><a href="https://brilliant.org/" className="text-purple-500 text-sm font-bold">Brilliant</a></p>
          <p className="mb-6"><a href="https://chemcollective.org/" className="text-purple-500 text-sm font-bold">ChemCollective</a></p>
          <p className="mb-6"><a href="https://phet.colorado.edu/" className="text-purple-500 text-sm font-bold">PhET Interactive Simulations</a></p>
          <p className="mb-6"><a href="https://www.mathway.com/" className="text-purple-500 text-sm font-bold">Mathway</a></p>
          <p className="mb-6"><a href="https://www.wolframalpha.com/" className="text-purple-500 text-sm font-bold">Wolfram Alpha</a></p>
          <p className="mb-6"><a href="https://cnx.org/" className="text-purple-500 text-sm font-bold">OpenStax CNX</a></p>
          <p className="mb-6"><a href="https://www.math.com/" className="text-purple-500 text-sm font-bold">Math.com</a></p>
        </div>
      </div>

      <div>
        <h2 className="head-text mb-5">Chaînes YouTube éducatives</h2>
        <h2 className="head-text text-base">Sujets scientifiques</h2>
        <div>
          <p className="mb-6"><a href="https://www.youtube.com/user/Vsauce" className="text-purple-500 text-sm font-bold">Vsauce</a></p>
          <p className="mb-6"><a href="https://www.youtube.com/user/crashcourse" className="text-purple-500 text-sm font-bold">CrashCourse</a></p>
          <p className="mb-6"><a href="https://www.youtube.com/user/numberphile" className="text-purple-500 text-sm font-bold">Numberphile</a></p>
          <p className="mb-6"><a href="https://www.youtube.com/user/3Blue1Brown" className="text-purple-500 text-sm font-bold">3Blue1Brown</a></p>
          <p className="mb-6"><a href="https://www.youtube.com/user/SmarterEveryDay" className="text-purple-500 text-sm font-bold">SmarterEveryDay</a></p>
          <p className="mb-6"><a href="https://www.youtube.com/user/TheOrganicChemistry" className="text-purple-500 text-sm font-bold">Organic Chemistry Tutor</a></p>
          <p className="mb-6"><a href="https://www.youtube.com/user/ProfessorDaveExplains" className="text-purple-500 text-sm font-bold">Professor Dave Explains</a></p>
          <p className="mb-6"><a href="https://www.youtube.com/user/blackpenredpen" className="text-purple-500 text-sm font-bold">blackpenredpen</a></p>
          <p className="mb-6"><a href="https://www.youtube.com/user/khanacademy" className="text-purple-500 text-sm font-bold">Khan Academy</a></p>
        </div>
      </div>

      <div>
        <h2 className="head-text mb-5">Liens vers des sites de tutorat</h2>
        <h2 className="head-text text-base">Sujets scientifiques</h2>
        <div>
          <p><a href="https://www.varsitytutors.com/" className="text-purple-500 text-sm">Varsity Tutors</a></p>
          <p><a href="https://www.tutor.com/" className="text-purple-500 text-sm">Tutor.com</a></p>
          <p><a href="https://www.chegg.com/tutors/" className="text-purple-500 text-sm">Chegg Tutors</a></p>
          <p><a href="https://www.wyzant.com/" className="text-purple-500 text-sm">Wyzant</a></p>
          <p><a href="https://www.sylvanlearning.com/" className="text-purple-500 text-sm">Sylvan Learning</a></p>
          <p><a href="https://www.clubztutoring.com/" className="text-purple-500 text-sm">Club Z! Tutoring</a></p>
          <p><a href="https://www.tutormatch.com/" className="text-purple-500 text-sm">TutorMatch</a></p>
          <p><a href="https://www.tutordoctor.com/" className="text-purple-500 text-sm">Tutor Doctor</a></p>
          <p><a href="https://www.kumon.com/" className="text-purple-500 text-sm">Kumon</a></p>
          <p><a href="https://www.huntingtonhelps.com/" className="text-purple-500 text-sm">Huntington Learning Center</a></p>
        </div>
      </div>
    </section>
  );
}

export default Page;
