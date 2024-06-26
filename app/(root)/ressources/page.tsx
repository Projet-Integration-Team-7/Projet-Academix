// Importation des modules nécessaires
import React from 'react';
import { redirect } from "next/navigation";
import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/actions/user.actions';

// Définition de la fonction Page
async function Page() {
  // Récupération de l'utilisateur actuel
  const user = await currentUser();

  // Si l'utilisateur n'existe pas, on retourne null
  if (!user) return null;

  // Récupération des informations de l'utilisateur
  const userInfo = await fetchUser(user.id);

  // Si l'utilisateur n'a pas encore été intégré, on le redirige vers la page d'intégration
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Affichage des ressources
  return (
    <section>
      <h1 className="head-text t mb-5">Ressources</h1>
      <hr className="border-t border-white" />
      <section className="mt-20 flex flex-col gap-">
        {sections.map((section, index) => (
          <div key={index}>
            <h2 className="head-text mb-5">{section.title}</h2>
            {section.links.map((link, i) => (
              <div key={i} className="mb-6">
                <a href={link.url} className="text-yellow-300 text-sm font-bold">{link.label}</a>
              </div>
            ))}
          </div>
        ))}
      </section>
    </section>
  );
}
 
const sections = [
    {
        title: 'Liens de site web à titre éducatif',
        links: [
            { label: 'Khan academy website', url: 'https://www.coursera.org/' },
            { label: 'edX Website', url: 'https://www.edx.org/' },
            { label: 'Udemy Website', url: 'https://www.udemy.com/' },
            { label: 'Codecademy Website', url: 'https://www.codecademy.com/' },
            { label: 'MIT OpenCourseWare Website', url: 'https://ocw.mit.edu/index.htm' },
            { label: 'FutureLearn Website', url: 'https://www.futurelearn.com/' },
            { label: 'Udacity Website', url: 'https://www.udacity.com/' },
            { label: 'Alison Website', url: 'https://www.alison.com/' },
        ]
    },
    {
        title: " Section d'exercise " ,
        links: [
            { label: 'Physics Classroom', url: 'https://www.physicsclassroom.com/' },
            { label: 'Paul\'s Online Math Notes', url: 'http://tutorial.math.lamar.edu/' },
            { label: 'Brilliant', url: 'https://brilliant.org/' },
            { label: 'ChemCollective', url: 'https://chemcollective.org/' },
            { label: 'PhET Interactive Simulations', url: 'https://phet.colorado.edu/' },
            { label: 'Wolfram Alpha', url: 'https://www.wolframalpha.com/' },
            { label: 'OpenStax CNX', url: 'https://cnx.org/' },
            { label: 'Math.com', url: 'https://www.math.com/' },
        ]
    },
    {
        title: "Chaine youtube à contenue scientifique et éducatif",
        links: [
            { label: 'Vsauce', url: 'https://www.youtube.com/user/Vsauce' },
            { label: 'CrashCourse', url: 'https://www.youtube.com/user/crashcourse' },
            { label: 'Numberphile', url: 'https://www.youtube.com/user/numberphile' },
            { label: '3Blue1Brown', url: 'https://www.youtube.com/user/3Blue1Brown' },
            { label: 'SmarterEveryDay', url: 'https://www.youtube.com/user/SmarterEveryDay' },
            { label: 'Organic Chemistry Tutor', url: 'https://www.youtube.com/user/TheOrganicChemistry' },
            { label: 'Professor Dave Explains', url: 'https://www.youtube.com/user/ProfessorDaveExplains' },
            { label: 'blackpenredpen', url: 'https://www.youtube.com/user/blackpenredpen' },
            { label: 'Khan Academy', url: 'https://www.youtube.com/user/khanacademy' },
        ]
    },
    {
        title: "Sites web avec Tutorat",
        links: [
            { label: 'Varsity Tutors', url: 'https://www.varsitytutors.com/' },
            { label: 'Tutor.com', url: 'https://www.tutor.com/' },
            { label: 'Chegg Tutors', url: 'https://www.chegg.com/tutors/' },
            { label: 'Wyzant', url: 'https://www.wyzant.com/' },
            { label: 'Sylvan Learning', url: 'https://www.sylvanlearning.com/' },
            { label: 'Club Z! Tutoring', url: 'https://www.clubztutoring.com/' },
            { label: 'TutorMatch', url: 'https://www.tutormatch.com/' },
            { label: 'Tutor Doctor', url: 'https://www.tutordoctor.com/' },
            { label: 'Kumon', url: 'https://www.kumon.com/' },
            { label: 'Huntington Learning Center', url: 'https://www.huntingtonhelps.com/' },
        ]
    }
];
 
export default Page;