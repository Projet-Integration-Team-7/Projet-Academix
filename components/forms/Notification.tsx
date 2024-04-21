"use client";
import { useState } from "react";
import Image from "next/image";
import {
  deleteFriendRequestNotification,
  getUserNotificationMessages,
} from "@/lib/actions/notification.actions";
import { addFriend } from "@/lib/actions/user.actions";
import { fetchUserNotifications } from "@/lib/actions/notification.actions";
import { Popover } from "@headlessui/react";

interface NotifProps {
  currentUserId: string;
}

function Notification({ currentUserId }: NotifProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>(
    []
  );

  const fetchNotifs = async () => {
    try {
      const notifs = await fetchUserNotifications(currentUserId);
      setNotifications(notifs);
      console.log(notifs);
    } catch (error: any) {
      throw new Error("Error fetching notifications", error);
    }
  };

  if (isOpen ) {
    fetchNotifs();
  }

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
    <Popover>
      <Popover.Button v-slot="{ open }">
          <div v-if="open">
            <script>fetchNotifs</script>
            <Image
              src="/assets/notif.svg"
              alt="notification icon"
              width={24}
              height={24}
              className="cursor-pointer object-contain align-middle pt-1 rounded-xl scale-110 bg-transparent transition ease-in-out hover:scale-125"
            />
          </div>
      </Popover.Button>
      
      <Popover.Panel> 
          <div className="absolute flex-wrap -translate-x-48 h-64 w-52 scroll-auto p-2 bg-white rounded-md shadow-lg text-black">
            {notifications.map((notification, index) => (
              <div key={index} className=" flex bg-[#ed4444] rounded-md text-black">
                {notification.message}
                {notification.notifType === "friendRequest" && (
                  <div className="flex self-center gap-1 align-middle text-black">
                    <button
                      className="bg-green-500 rounded-full h-4 w-4"
                      onClick={() => handleGreenButton(index,notification.senderId)}
                    ></button>
                    <button
                      className="bg-red-500 rounded-full h-4 w-4"
                      onClick={() => handleRedButton(index,notification.senderId)}
                    ></button>
                  </div>
                )}
              </div>
            ))}
          </div>
      </Popover.Panel>
    </Popover>
  );
}

export default Notification;
