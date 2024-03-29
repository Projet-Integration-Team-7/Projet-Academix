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

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  const communityDetails = await fetchCommunityDetails(params.id);

  return (
    <section>
      <ProfileHeader
        accountId={communityDetails?.createdBy?.id}
        authUserId={user.id}
        name={communityDetails?.name}
        username={communityDetails?.username}
        imgUrl={communityDetails?.image}
        bio={communityDetails?.bio}
        type='Community'
      />

      <div className='mt-9'>
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

          <TabsContent value='threads' className='w-full text-light-1'>
            {/* @ts-ignore */}
            <ThreadsTab
              currentUserId={user.id}
              accountId={communityDetails?._id}
              accountType="Community"
            />
          </TabsContent>

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

          <TabsContent value='requests' className='w-full text-light-1'>
            {/* @ts-ignore */}
            <ThreadsTab
              currentUserId={user.id}
              accountId={communityDetails?._id}
              accountType="Community"
            />
          </TabsContent>


          <TabsContent value='exercise' className='w-full text-light-1'>
            {/* @ts-ignore */}
            <ExerciseTab
              currentUserId={user.id}
              accountId={communityDetails?._id}
              accountType="Community"
            />
          </TabsContent>
          <TabsContent value='course_note' className='w-full text-light-1'>
            {/* @ts-ignore */}
            <CourseNoteTab
              currentUserId={user.id}
              accountId={communityDetails?._id}
              accountType="Community"
            />
          </TabsContent>
          <TabsContent value='evaluation' className='w-full text-light-1'>
            {/* @ts-ignore */}
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
