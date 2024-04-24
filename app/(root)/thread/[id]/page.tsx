import { useEffect } from 'react';
import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params}: {params: { id: string}}) => {
    if(!params.id) return null;

    const user = await currentUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarded) redirect('/onboarding')

    const thread = await fetchThreadById(params.id)
    useEffect(() => {
        const timeout = setTimeout(() => {
            window.location.reload();
        }, 5000); // Refresh the page every 5 seconds

        return () => clearTimeout(timeout);
    }, []); // Empty dependency array means this effect runs once after the initial render

    if (!thread) return <p>Loading...</p>;


   return (
        <section className="relative">
            <div>
            <ThreadCard 
                   key={thread._id}
                   id={thread._id}
                   currentUserId={user?.id || " "}
                   parentId={thread.parentId}
                   content={thread.text}
                   author={thread.author}
                   community={thread.community}
                   imgUrl={thread.image || ""}
                   createdAt={thread.createdAt.toString()}
                   comments={thread.children}
                   likes={thread.likes.toObject()}
                   threadType={thread.threadType} currentUser={null}                />
            </div>

            <div className="mt-7">
                <Comment
                    threadId={thread.id}
                    currentUserImg ={userInfo.image}
                    currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>

            <div className="mt-10">
                {thread.children.map((childItem: any) => (
                    <ThreadCard 
                        key={childItem._id}
                        id={childItem._id}
                        currentUserId={user?.id || " "}
                        parentId={childItem.parentId}
                        content={childItem.text}
                        author={childItem.author}
                        community={childItem.community}
                        imgUrl={""}
                        createdAt={childItem.createdAt}
                        comments={childItem.children}
                        likes={childItem.likes.toObject()}
                        isComment
                        threadType={thread.threadType} currentUser={null}                    />
                ))}
            </div>
        </section>
    )

}


export default Page;