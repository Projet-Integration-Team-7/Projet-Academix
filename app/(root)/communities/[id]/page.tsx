
import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import { communityTabs } from "@/constants";
import UserCard from "@/components/cards/UserCard";
import ThreadsTab from "@/components/shared/ThreadsTab";
import ExerciseTab from "@/components/shared/ExerciseTab";
import EvaluationTab from "@/components/shared/EvaluationTab";
import CourseNoteTab from "@/components/shared/CourseNoteTab";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { fetchCommunityDetails } from "@/lib/actions/community.actions";

// Page est une fonction asynchrone qui affiche les détails d'une communauté.
// Elle récupère l'utilisateur actuel et les détails de la communauté en fonction de l'id fourni.
// Elle rend ensuite une section contenant un ProfileHeader et un ensemble d'onglets.
// Chaque onglet correspond à un aspect différent de la communauté (fils de discussion, membres, demandes, etc.).
async function Page({ params }: { params: { id: string } }) {
  // Récupère l'utilisateur actuel

  const user = await currentUser();
  // Si aucun utilisateur n'est trouvé, retourne null

  if (!user) return null;
  // Récupère les détails de la communauté

  const communityDetails = await fetchCommunityDetails(params.id);
  // Affiche les détails de la communauté
  return (
    <section>
      {/* Affiche l'en-tête du profil de la communauté */}
      <ProfileHeader
        accountId={communityDetails?.createdBy?.id}
        name={communityDetails?.name}
        username={communityDetails?.username}
        imgUrl={communityDetails?.image}
        bio={communityDetails?.bio}
        type='Community' authUserId={""} />
      <div className='mt-9'>
        {/* Affiche les onglets de la communauté */}

        <Tabs defaultValue='threads' className='w-full'>
          <TabsList className='tab'>
            {communityTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className='object-contain'
                />
                <p className='max-sm:hidden'>{tab.label}</p>

                {tab.label === "Threads" && (
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {communityDetails?.threads?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {/* Affiche le contenu de l'onglet fils de discussion */}

          <TabsContent value='threads' className='w-full text-light-1'>
            <ThreadsTab
              currentUserId={user.id}
              accountId={communityDetails?._id}
              accountType="Community"
            />
          </TabsContent>
          {/* Affiche le contenu de l'onglet membres */}

          <TabsContent value='members' className='mt-9 w-full text-light-1'>
            <section className='mt-9 flex flex-col gap-10'>
              {communityDetails?.members.map((member: any) => (
                <UserCard
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  username={member.username}
                  imgUrl={member.image}
                  personType="User"
                />
              ))}
            </section>
          </TabsContent>
          {/* Affiche le contenu de l'onglet demandes */}

          <TabsContent value='requests' className='w-full text-light-1'>
            <ThreadsTab
              currentUserId={user.id}
              accountId={communityDetails?._id}
              accountType="Community"
            />
          </TabsContent>
          {/* Affiche le contenu de l'onglet exercices */}

          <TabsContent value='exercise' className='w-full text-light-1'>
            <ExerciseTab
              currentUserId={user.id}
              accountId={communityDetails?._id}
              accountType="Community"
            />
          </TabsContent>
          {/* Affiche le contenu de l'onglet notes de cours */}

          <TabsContent value='course_note' className='w-full text-light-1'>
            <CourseNoteTab
              currentUserId={user.id}
              accountId={communityDetails?._id}
              accountType="Community"
            />
          </TabsContent>
          {/* Affiche le contenu de l'onglet évaluations */}

          <TabsContent value='evaluation' className='w-full text-light-1'>
            <EvaluationTab
              currentUserId={user.id}
              accountId={communityDetails?._id}
              accountType="Community"
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default Page;
