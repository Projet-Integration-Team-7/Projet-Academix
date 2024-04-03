"use client"
import {useState} from 'react';
import { addFriendRequest, removeFriendRequest, verifyFriendship } from '@/lib/actions/user.actions';
import { checkIfFriendRequestExists } from '@/lib/actions/notification.actions';


interface FriendRequestProps {
    currentUserId: string;
    userId: string;
}

const FriendRequest = ({currentUserId,userId}: FriendRequestProps) => {
    const alreadyFriend = verifyFriendship(currentUserId, userId);
    const alreadyRequested = checkIfFriendRequestExists(currentUserId, userId);
   
    const [isFriend, setIsFriend] = useState(alreadyFriend);
    const [isRequested, setIsRequested] = useState(alreadyRequested);
 

    return (
        { !isFriend && !isRequested ? (}
        
        
    )
}

export default FriendRequest;
