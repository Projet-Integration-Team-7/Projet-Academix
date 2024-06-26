"use client"
import {useEffect, useState} from 'react';
import { verifyFriendship, removeFriend, addFriend } from '@/lib/actions/user.actions';
import { checkIfFriendRequestExists, createFriendRequest, deleteFriendRequestNotification } from '@/lib/actions/notification.actions';

interface FriendRequestProps {
    currentUserId: string;
    userId: string;
}

/**
 * Composant FriendRequest
 * 
 * @param currentUserId - L'ID de l'utilisateur actuel
 * @param userId - L'ID de l'utilisateur cible
 * @returns Le composant FriendRequest
 */
const FriendRequest = ({currentUserId, userId}: FriendRequestProps) => {
   
    const [isFriend, setIsFriend] = useState(false);
    const [isRequested, setIsRequested] = useState(false);

    /**
     * Vérifie le statut de l'amitié et de la demande d'ami
     */
    useEffect(() => {
        const checkFriendshipStatus = async () => {
            const friendStatus = await verifyFriendship( JSON.parse(JSON.stringify(currentUserId)), JSON.parse(JSON.stringify(userId)) );
            setIsFriend(friendStatus);

            const requestStatus = await checkIfFriendRequestExists( JSON.parse(JSON.stringify(currentUserId)), JSON.parse(JSON.stringify(userId)) );
            console.log(requestStatus);
            setIsRequested(requestStatus);
        };

        checkFriendshipStatus();
    }, [currentUserId, userId]);

    /**
     * Gère le clic sur le bouton
     */
    const handleClick = async () => {
        if (isFriend) {
            await removeFriend(JSON.parse(JSON.stringify(currentUserId)), JSON.parse(JSON.stringify(userId)));
        }
        else if(!isRequested){
            const userAlreadySentFR = await checkIfFriendRequestExists( JSON.parse(JSON.stringify(userId)), JSON.parse(JSON.stringify(currentUserId)) )
            if(userAlreadySentFR) {
                await deleteFriendRequestNotification(JSON.parse(JSON.stringify(userId)), JSON.parse(JSON.stringify(currentUserId)));
                addFriend(JSON.parse(JSON.stringify(currentUserId)), JSON.parse(JSON.stringify(userId)));
            }
            else {
                await createFriendRequest(JSON.parse(JSON.stringify(userId)), JSON.parse(JSON.stringify(currentUserId)));
            }
        }
        else {
            await deleteFriendRequestNotification(JSON.parse(JSON.stringify(userId)), JSON.parse(JSON.stringify(currentUserId)));
        } 
        window.location.reload();
    }

    return (
        <button className={`flex h-10 w-48 align-middle content-center place-content-center items-center place-items-center bg-light-2 justify-around p-2 mb-[50px] text-black self-center rounded-md  ${isFriend ? 'hover:ring-[#E61D1D]' : isRequested ? 'hover:ring-[#9C9F9B]' : 'hover:ring-[#25DE00]'} ring-4 transition ease-in focus:opacity-75`}
        onClick={handleClick}>
            <svg fill={isFriend ? '#E61D1D' : isRequested ? '#9C9F9B' : '#25DE00'} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 45.902 45.902" >  
                <g>	<g>		<path d="M43.162,26.681c-1.564-1.578-3.631-2.539-5.825-2.742c1.894-1.704,3.089-4.164,3.089-6.912			c0-5.141-4.166-9.307-9.308-9.307c-4.911,0-8.932,3.804-9.281,8.625c4.369,1.89,7.435,6.244,7.435,11.299			c0,1.846-0.42,3.65-1.201,5.287c1.125,0.588,2.162,1.348,3.066,2.26c2.318,2.334,3.635,5.561,3.61,8.851l-0.002,0.067			l-0.002,0.057l-0.082,1.557h11.149l0.092-12.33C45.921,30.878,44.936,28.466,43.162,26.681z"/>		<path d="M23.184,34.558c1.893-1.703,3.092-4.164,3.092-6.912c0-5.142-4.168-9.309-9.309-9.309c-5.142,0-9.309,4.167-9.309,9.309			c0,2.743,1.194,5.202,3.084,6.906c-4.84,0.375-8.663,4.383-8.698,9.318l-0.092,1.853h14.153h15.553l0.092-1.714			c0.018-2.514-0.968-4.926-2.741-6.711C27.443,35.719,25.377,34.761,23.184,34.558z"/>		<path d="M6.004,11.374v3.458c0,1.432,1.164,2.595,2.597,2.595c1.435,0,2.597-1.163,2.597-2.595v-3.458h3.454			c1.433,0,2.596-1.164,2.596-2.597c0-1.432-1.163-2.596-2.596-2.596h-3.454V2.774c0-1.433-1.162-2.595-2.597-2.595			c-1.433,0-2.597,1.162-2.597,2.595V6.18H2.596C1.161,6.18,0,7.344,0,8.776c0,1.433,1.161,2.597,2.596,2.597H6.004z"/>	</g></g>
            </svg>
            {isFriend ? 'Retirer comme ami' : isRequested ? 'Annuler la demande' : 'Demander en ami'}
        </button>
        
    )
}

export default FriendRequest;
