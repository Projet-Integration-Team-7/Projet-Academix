
import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts, removeAllDeletedThreadsFromUsers } from "@/lib/actions/thread.action";
import { fetchCommunityDetails} from "@/lib/actions/community.actions";
import { currentUser } from "@clerk/nextjs";
export default async function Home() {
  const result = await fetchPosts(1, 30);
  const user = await currentUser();
  const communityDetails = await fetchCommunityDetails(user?.id || "");
  
  
  //Afichage du menu principal avec tout les threads
  return (
    <> 
      <h1 className="head-text text-left">Menu Principal</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">Aucun Thread trouvé</p>
        ) : (
          <> 
            {result.posts.map((post) => (
              <ThreadCard 
                key={post._id}
                id={JSON.parse(JSON.stringify(post._id))}
                currentUserId={user?.id || ""}
                currentUser={{ id: user?.id || "", name: user?.username || "" }}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                imgUrl={post.image}
                createdAt={post.createdAt}
                comments={post.children}
                likes={post.likes.toObject()}
                isConnected={user !== null}
                threadType={post.threadType}
              />
            ))}
          
          </>
        )}
      </section>
    </>
  );
}
 