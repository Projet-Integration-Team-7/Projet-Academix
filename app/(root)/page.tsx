import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts, removeAllDeletedThreadsFromUsers } from "@/lib/actions/thread.action";
import { removeDeletedUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  // Récupérer les posts de la page 1 à 30
  const result = await fetchPosts(1, 30);

  // Récupérer l'utilisateur actuel
  const user = await currentUser();

  // Supprimer les utilisateurs supprimés
  removeDeletedUsers();

  // Supprimer les threads supprimés des utilisateurs
  removeAllDeletedThreadsFromUsers();

  // Préparer les props pour ThreadCard
  const threadCardProps = (post: any) => ({
    key: post._id,
    id: post._id,
    currentUserId: user?.id || "",
    currentUser: { id: user?.id || "", name: user?.username || "" },
    parentId: post.parentId,
    content: post.text,
    author: post.author,
    community: post.community,
    imgUrl: post.image,
    createdAt: post.createdAt,
    comments: post.children,
    likes: post.likes.toObject(),
    threadType: post.threadType
  });
  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">Aucun thread trouvé</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <ThreadCard {...threadCardProps(post)} />
            ))}
          </>
        )}
      </section>
    </>
  );
}