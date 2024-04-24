"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { deleteFriendRequestNotification, markAllNotificationsAsRead } from "@/lib/actions/notification.actions";
import { addFriend } from "@/lib/actions/user.actions";
import { fetchUserNotifications } from "@/lib/actions/notification.actions";
import { Popover } from "@headlessui/react";

interface NotifProps {
  currentUserId: string;
}

function Notification({ currentUserId }: NotifProps) {
  const [notifications, setNotifications] = useState<any[]>(
    []
  );

  useEffect(() => {
    const fetchNotifications = async () => {
      const userNotifications = await fetchUserNotifications(currentUserId);
      setNotifications(userNotifications);
    };

    fetchNotifications();
  }, [currentUserId]);

  const handleGreenButton = async (index: number,senderId: string) => {
    // Delete the friend request notification
    const updatedNotifications = [...notifications];
    updatedNotifications.splice(index, 1);
    // Delete the friend request notification from the database
    await deleteFriendRequestNotification(currentUserId, senderId);
    setNotifications(updatedNotifications);

    // Add the sender as a friend
    addFriend(currentUserId, senderId);

    // Usage:
    // <button onClick={() => acceptFriendRequest(index)}>Accept</button>
  };
  const handleRedButton = async (index: number,senderId: string) => {
    // Delete the friend request notification
    const updatedNotifications = [...notifications];
    updatedNotifications.splice(index, 1);
    // Delete the friend request notification from the database
    await deleteFriendRequestNotification(currentUserId, senderId);
    setNotifications(updatedNotifications);

    // Usage:
    // <button onClick={() => declineFriendRequest(index)}>Decline</button>
  };

    return (
        <div className='relative align-middle text-center bg-center self-center items-center place-items-center'>
            <button onClick={() => setIsOpen(!isOpen)} className='bg-transparent'>
                <Image 
                    src="/assets/notif.svg"
                    alt='notification icon'
                    width={24} height={24}
                    className='cursor-pointer object-contain align-middle pt-1 rounded-xl scale-110 bg-transparent transition ease-in-out hover:scale-125'
                />
            </button>
            {isOpen && (
                <div className='absolute -translate-x-32 h-52 w-36 scroll-auto p-4 bg-white rounded-md shadow-lg'>
                    {notifications.map((notification, index) => (
                        <p key={index} className=' flex-wrap'>{notification}</p>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Notification;
