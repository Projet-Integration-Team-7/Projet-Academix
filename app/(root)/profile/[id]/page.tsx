// Importation des bibliothèques et des composants nécessaires
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import FriendRequest from "@/components/forms/FriendRequest";
import ModifyCard from "@/components/cards/ModifyCard";

// Définition de la fonction Page
async function Page({ params }: { params: { id: string } }) {
  // Récupération de l'utilisateur courant
  const user = await currentUser();

  // Si l'utilisateur n'existe pas, retourner null
  if (!user) throw new Error("Utilisateur non trouvé");

  // Récupération des informations de l'utilisateur
  const userInfo = await fetchUser(params.id);

  // Si l'utilisateur n'est pas embarqué, rediriger vers '/onboarding'
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Retourne le JSX à rendre
  return (
    <section>
      <div className="flex">
        <ProfileHeader
          accountId={userInfo.id}
          authUserId={user.id}
          name={userInfo.name}
          username={userInfo.username}
          imgUrl={userInfo.image}
          bio={userInfo.bio}
        />
      
        {user.id === userInfo.id && <ModifyCard/>}

        <div className=" translate-y-6"> 
          {user.id !== userInfo.id && <FriendRequest currentUserId={JSON.parse(JSON.stringify(user.id))} userId={JSON.parse(JSON.stringify(userInfo.id))}/>}
        </div>
      </div>

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <p className="max-sm:hidden">{tab.label}</p>
                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo?.threads?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent
              key={"content-${tab.label}"}
              value={tab.value}
              className="w-full text-light-1"
            >
              <ThreadsTab
                currentUserId={user.id}
                accountId={userInfo.id}
                accountType="User"
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

// Exportation de la fonction Page par défaut
export default Page;