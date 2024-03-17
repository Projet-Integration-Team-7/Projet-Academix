"use client"
import Image from "next/image";
import { useState } from "react";
import { updatePostToLikes } from "@/lib/actions/user.actions";
import { updateLikeToThread } from "@/lib/actions/thread.action";

interface LikeBtnProps {
    threadId: string;
    likes: number;
}

const LikeBtn = ({ threadId, likes }: LikeBtnProps) => {
    const [isLiked, setIsLiked] = useState(false);
    

    const handleClick = () => {
        setIsLiked(!isLiked);
        if (isLiked){
            likes+1;
        }else {
            likes -1
        }

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
            <span className="text-gray-200 m-0">{likes||0}</span>
        </div>
    );
};

export default LikeBtn;