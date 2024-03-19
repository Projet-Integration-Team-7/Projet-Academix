"use client"
import Image from "next/image";
import { useState } from "react";
import { updatePostToLikes } from "@/lib/actions/user.actions";
import { getThreadLikes, getThreadLikesCount, updateLikeToThread } from "@/lib/actions/thread.action";

interface LikeBtnProps {
    threadId: string;
    userId: string;
    mapLikes: Map<string,Date>;
    likesCount: number
}

const LikeBtn = ({ threadId, userId, mapLikes, likesCount}: LikeBtnProps) => {
    const alreadyLiked = mapLikes.hasOwnProperty(userId);
 
    const [isLiked, setIsLiked] = useState(alreadyLiked);
    const [nbLikes, setNbLikes] = useState(likesCount);

    const handleClick = async () => {
        const liked = !isLiked; 

        setIsLiked(liked);

        await updateLikeToThread(threadId,userId,liked)
        await updatePostToLikes(threadId,userId,liked)

        const comptage = await getThreadLikesCount(threadId);
        setNbLikes(comptage);
    };

    return (
        <div className="flex gap-2">
            <Image
                src={isLiked ? "/assets/heart-filled.svg" : "/assets/heart-gray.svg"}
                alt={isLiked ? "filled heart" : "heart"}
                width={24}
                height={24}
                className="cursor-pointer object-contain transition ease-in-out hover:scale-110 hover:-translate-y-1"
                onClick={handleClick}
            />
            <span className="text-gray-200 m-0">{nbLikes}</span>
        </div>
    );
};

export default LikeBtn;