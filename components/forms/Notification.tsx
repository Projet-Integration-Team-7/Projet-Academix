"use client";
import { useState } from "react";
import Image from "next/image";
import {
  deleteFriendRequestNotification,
  getUserNotificationMessages,
} from "@/lib/actions/notification.actions";
import { addFriend } from "@/lib/actions/user.actions";

interface NotifProps {
  currentUserId: string;
}

function Notification({ currentUserId }: NotifProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  const fetchNotifications = async () => {
    try {
      const notifs = await getUserNotificationMessages(currentUserId);
      setNotifications(notifs);
    } catch (error: any) {
      throw new Error("Error fetching notifications", error);
    }
  };

  if (isOpen) {
    fetchNotifications();
  }

  const handleGreenButton = async (index: number) => {
    const friendRequest = notifications[index];
    // Delete the friend request notification
    const updatedNotifications = [...notifications];
    updatedNotifications.splice(index, 1);
    const friendRequestSender = friendRequest.split(" ")[0];
    // Delete the friend request notification from the database
    await deleteFriendRequestNotification(currentUserId, friendRequestSender);
    setNotifications(updatedNotifications);

    // Add the sender as a friend
    addFriend(currentUserId, friendRequest.split(" ")[0]);

    // Usage:
    // <button onClick={() => acceptFriendRequest(index)}>Accept</button>
  };
  const handleRedButton = async (index: number) => {
    const friendRequest = notifications[index];
    // Delete the friend request notification
    const updatedNotifications = [...notifications];
    updatedNotifications.splice(index, 1);
    const friendRequestSender = friendRequest.split(" ")[0];
    // Delete the friend request notification from the database
    await deleteFriendRequestNotification(currentUserId, friendRequestSender);
    setNotifications(updatedNotifications);

    // Usage:
    // <button onClick={() => declineFriendRequest(index)}>Decline</button>
  };

  return (
    <div className="relative align-middle text-center bg-center self-center items-center place-items-center">
      <button onClick={() => setIsOpen(!isOpen)} className="bg-transparent">
        <Image
          src="/assets/notif.svg"
          alt="notification icon"
          width={24}
          height={24}
          className="cursor-pointer object-contain align-middle pt-1 rounded-xl scale-110 bg-transparent transition ease-in-out hover:scale-125"
        />
      </button>
      {isOpen && (
        <div className="absolute flex-wrap -translate-x-48 h-64 w-52 scroll-auto p-2 bg-white rounded-md shadow-lg">
          {notifications.map((message, index) => (
            <div key={index} className=" flex bg-[#F5F5F5] rounded-md">
              {message}
              {message.includes("friend request") && (
                <div className="flex self-center gap-1 align-middle">
                  <button
                    className="bg-green-500 rounded-full h-4 w-4"
                    onClick={handleGreenButton(index)}
                  ></button>
                  <button
                    className="bg-red-500 rounded-full h-4 w-4"
                    onClick={handleRedButton(index)}
                  ></button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notification;
