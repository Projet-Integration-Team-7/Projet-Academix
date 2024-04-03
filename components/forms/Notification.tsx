"use client"
import {useState} from 'react';
import Image from 'next/image';
import { getUserNotificationMessages } from '@/lib/actions/notification.actions';

interface NotifProps {
    currentUserId: string;
}

function Notification({currentUserId}: NotifProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<string[]>([]);

    const fetchNotifications = async () => {
        try {
            const notifs = await getUserNotificationMessages(currentUserId);
            setNotifications(notifs);
        } catch (error:any) {
            throw new Error('Error fetching notifications', error);
        }
    };

    if (isOpen && notifications.length === 0) {
        fetchNotifications();
    }

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
                <div className='absolute -translate-x-48 h-64 w-52 scroll-auto p-2 bg-white rounded-md shadow-lg'>
                    {notifications.map((message,index) => (
                        <span key={index}>{message}</span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Notification;