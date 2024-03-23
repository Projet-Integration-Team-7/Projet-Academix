"use client"
import {useState} from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';

function Notification() {
    const [isOpen, setIsOpen] = useState(false);
    const notifications = ['Notification 1', 'Notification 2', 'Notification 3']; // Replace this with actual data

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