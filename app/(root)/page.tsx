import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts, removeAllDeletedThreadsFromUsers } from "@/lib/actions/thread.action";
import { removeDeletedUsers } from "@/lib/actions/user.actions";
import { fetchCommunityDetails} from "@/lib/actions/community.actions";
import { currentUser } from "@clerk/nextjs";
import { useUser, useOrganization } from '@clerk/nextjs';
import { Organization } from "@clerk/nextjs/server";
export default async function Home() {
  const result = await fetchPosts(1, 30);
  const user = await currentUser();
  const communityDetails = await fetchCommunityDetails(user?.id || "");
  
  //console.log(result);
  // removeDeletedUsers();
  // removeAllDeletedThreadsFromUsers();  

  return (
    <> 
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <ThreadCard 
                key={post._id}
                id={post._id}
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
                threadType={post.threadType}
              />
            ))}
          
          </>
        )}
      </section>
    </>
  );
}
 