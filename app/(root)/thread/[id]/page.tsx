import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React, { useState, useEffect } from 'react';

const Page = async ({ params}: {params: { id: string}}) => {
    const [thread, setThread] = useState(null);
    const [user, setUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    useEffect(() => {
        const init = async () => {
            if (!params.id) return;
    
            const userResponse = await currentUser();
            if (!userResponse) return;
            setUser(userResponse);
    
            const userInfoResponse = await fetchUser(userResponse.id);
            if (!userInfoResponse?.onboarded) {
                redirect('/onboarding');
                return;
            }
            setUserInfo(userInfoResponse);
    
            const threadResponse = await fetchThreadById(params.id);
            setThread(threadResponse);
        };
        init();
    
        const interval = setInterval(init, 5000);  // Refresh every 5 seconds
        return () => clearInterval(interval);  // Clean up interval on component unmount
    }, []);  // Empty dependency array

    if (!thread || !user || !userInfo) return null;
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
                imgUrl={thread.image||""}
                createdAt={thread.createdAt.toString()}
                comments={thread.children}
                likes={thread.likes.toObject()}
                threadType={thread.threadType}
                />
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
                        threadType={thread.threadType}
                    />
                ))}
            </div>
        </section>
    )

}


export default Page;