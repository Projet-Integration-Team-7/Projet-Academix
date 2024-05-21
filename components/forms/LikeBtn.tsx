"use client"
import Image from "next/image";
import { useState } from "react";
import { updatePostToLikes } from "@/lib/actions/user.actions";
import { getThreadLikesCount, updateLikeToThread } from "@/lib/actions/thread.action";

interface LikeBtnProps {
    threadId: string;
    currentUserId: string;
    mapLikes: Map<string,Date>;
    likesCount: number;
    isConnected: boolean;
}

/**
 * Composant bouton "J'aime" qui permet aux utilisateurs de liker une publication.
 * 
 * @param threadId - L'identifiant de la publication.
 * @param currentUserId - L'identifiant de l'utilisateur actuel.
 * @param mapLikes - Map contenant les likes associés à chaque utilisateur.
 * @param likesCount - Le nombre total de likes de la publication.
 * @param isConnected - Indique si l'utilisateur est connecté ou non.
 * @returns Le composant bouton "J'aime".
 */
const LikeBtn = ({ threadId, currentUserId, mapLikes, likesCount, isConnected}: LikeBtnProps) => {
    const alreadyLiked = mapLikes.has(currentUserId);
 
    const [isLiked, setIsLiked] = useState(alreadyLiked);
    const [nbLikes, setNbLikes] = useState(likesCount);

    /**
     * Gère le clic sur le bouton "J'aime".
     * Met à jour l'état du like, envoie les mises à jour au serveur et met à jour le nombre de likes.
     */
    const handleClick = async () => {
        const liked = !isLiked; 

        setIsLiked(liked);

        await updateLikeToThread(threadId,currentUserId,liked)
        await updatePostToLikes(threadId,currentUserId,liked)

        const comptage = await getThreadLikesCount(threadId);
        setNbLikes(comptage); 
    };

    return (
        <div className= " flex gap-2 align-middle text-center items-center">
            <Image
                src={isLiked ? "/assets/heart-filled.svg" : "/assets/heart-gray.svg"}
                alt={isLiked ? "filled heart" : "heart"}
                width={24}
                height={24}
                className="cursor-pointer object-contain transition ease-in-out hover:scale-110 hover:-translate-y-1"
                onClick={() => {
                    if (isConnected) {
                        handleClick();
                    } else {
                        window.alert("Connectez-vous pour aimer cette publication !");
                    }
                }}
            />
            <span className="text-dark-200 m-0">{nbLikes}</span>
        </div>
    );
};

export default LikeBtn;