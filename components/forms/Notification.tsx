"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { deleteFriendRequestNotification, markAllNotificationsAsRead, checkIfUnreadNotifs } from "@/lib/actions/notification.actions";
import { addFriend } from "@/lib/actions/user.actions";
import { fetchUserNotifications } from "@/lib/actions/notification.actions";
import { Popover } from "@headlessui/react";

interface NotifProps {
  currentUserId: string;
}

function Notification({ currentUserId }: NotifProps) {
  // prettier-ignore
  const [notifications, setNotifications] = useState<any[]>([]);
  const [hasUnread, setHasUnread] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const location = window.location.href.toString();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const userNotifications = await fetchUserNotifications(currentUserId);
      setNotifications(userNotifications);
    };
    fetchNotifications();

    const checkUnread = async () => {
      const unread = await checkIfUnreadNotifs(currentUserId);
      setHasUnread(unread);
    };
    checkUnread();
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
    <Popover>
      <Popover.Button onClick={() => {markAllNotificationsAsRead(currentUserId); setIsOpen(!isOpen)}} onBlur={() => setIsOpen(false)} className={" bg-transparent shadow-none "}> 
          <div>
            <Image
              src={`${hasUnread ? "/assets/notif-unread.svg" : "/assets/notif.svg"}`} 

              alt="notification icon"
              width={24}
              height={24}
              className="cursor-pointer object-contain align-middle pt-1 rounded-xl scale-110 bg-transparent transition ease-in-out hover:scale-125"
            />
          </div>
      </Popover.Button>
      
      {isOpen && (
        <Popover.Panel> 
          <div className="absolute flex-wrap -translate-x-48 h-64 w-52 scroll-auto p-2 bg-white rounded-md shadow-lg ">
            {notifications.map((notification, index) => (
              <div key={index} className=" flex bg-[#dedede] rounded-md text-black text-sm">
                {notification.message}
                {notification.notifType === "friendRequest" && (
                  <div className=" flex gap-1 align-middle self-center items-center place-items-center">
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
      )}
    </Popover>
  );
};

export default Notification;