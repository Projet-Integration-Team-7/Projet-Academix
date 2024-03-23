"use client"
import { deleteThread } from "@/lib/actions/thread.action";
import { removeThreadFromUser } from "@/lib/actions/user.actions";
import Thread from "@/lib/models/thread.model";
import { Popover } from "@headlessui/react";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface ThreadMenuProps {
    threadId: string;
    currentUserId: string;
    authorId: string;
}

const ThreadMenu = ({threadId, currentUserId, authorId}: ThreadMenuProps) => {
    const pathname=usePathname();

    const handleDelete = async () => {
        try {
            // Assuming you have imported the necessary Mongoose models and established a connection to MongoDB

            // Delete the document using its id
            deleteThread(threadId,pathname);
            removeThreadFromUser(currentUserId, threadId);

            // Handle any additional logic or UI updates after successful deletion

        } catch (error: any) {
            // Handle any errors that occur during the deletion process
            throw new Error("Error deleting document:", error);
        }
    };


    return (
        <Popover>
            <Popover.Button>
                <div className="">
                    <Image
                        src="/assets/three_dots.svg"
                        alt="thread menu icon"
                        height={24}
                        width={24}
                        className="flex cursor-pointer object-cover rounded-full p-0.5 transition ease-in-out bg-gray-300 border-2 border-gray-300 hover:border-gray-500"
                    />
                </div>
            </Popover.Button>

            <Popover.Panel>
                {authorId === currentUserId && (
                    <div className="absolute rounded-md bg-white ">
                        <div
                            className=" p-1 m-1 inline-flex cursor-pointer object-contain rounded-xl bg-gray-300 border-2 border-gray-300 transition ease-in-out hover:text-red-500 hover:border-red-500"
                            onClick={handleDelete}
                        >
                            <Image
                                src="/assets/trash.svg"
                                alt="delete icon"
                                height={16}
                                width={16}
                                className=""
                            />
                            <span className="text-black"> Delete thread </span>
                        </div>
                    </div>
                )}
            </Popover.Panel>
        </Popover>
    );
};

export default ThreadMenu;