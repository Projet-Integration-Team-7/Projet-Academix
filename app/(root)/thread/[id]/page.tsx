import { useRouter } from 'next/router';
import { useEffect,useState } from 'react';
import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = ({ params }: { params: { id: string } }) => {
    const router = useRouter();

    useEffect(() => {
        const loadUserAndThread = async () => {
            if (!params.id) {
                router.push('/404'); // Redirect to a Not Found page or handle appropriately
                return;
            }

            const user = await currentUser();
            if (!user) {
                router.push('/login'); // Redirect to login
                return;
            }

            const userInfo = await fetchUser(user.id);
            if (!userInfo?.onboarded) {
                router.push('/onboarding');
                return;
            }

            const thread = await fetchThreadById(params.id);
            setThreadState(thread);
        };

        loadUserAndThread();
    }, [params.id]);
    const [threadState, setThreadState] = useState(null);

    if (!threadState) return null;
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