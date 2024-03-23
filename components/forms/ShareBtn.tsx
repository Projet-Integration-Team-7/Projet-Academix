"use client"
import { Popover } from '@headlessui/react'
import Image from 'next/image';
import {EmailShareButton, FacebookShareButton,TwitterShareButton,WhatsappShareButton} from "react-share";
import {EmailIcon, FacebookIcon,TwitterIcon,WhatsappIcon} from "react-share";

interface ShareBtnProps {
    threadId: string;
}

const ShareBtn = ({threadId}: ShareBtnProps) => {
    const threadURL = `${window.location.href}thread/${threadId}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(threadURL);
    };

    return(
        <Popover>
            <Popover.Button>
                <Image 
                src="/assets/share.svg" 
                alt="share" 
                width={24} height={24} 
                className="cursor-pointer object-contain transition ease-in-out hover:scale-110"
                />
            </Popover.Button>

            <Popover.Panel >
                <div className=' inline-flex absolute bg-white rounded-xl px-2 justify-around ring-2 ring-gray-400'>
                    <EmailShareButton url={threadURL}>
                        <EmailIcon className=' rounded-md self-center align-middle m-1' size={24} round={true} borderRadius={4} />
                    </EmailShareButton>
                    <FacebookShareButton url={threadURL}>
                        <FacebookIcon className=' rounded-md self-center align-middle m-1' size={24} round={true} borderRadius={4} />
                    </FacebookShareButton>
                    <TwitterShareButton url={threadURL}>
                        <TwitterIcon className=' rounded-md self-center align-middle m-1' size={24} round={true} borderRadius={4} />
                    </TwitterShareButton>
                    <WhatsappShareButton url={threadURL}>
                        <WhatsappIcon className=' rounded-md self-center align-middle m-1' size={24} round={true} borderRadius={4}  />
                    </WhatsappShareButton>  
                    <Image src="/assets/link.svg" alt="copy link icon" width={18} height={18} className='cursor-pointer object-contain self-center align-middle m-1' onClick={handleCopy} />
                </div>
            </Popover.Panel>

        </Popover>
    )

}

export default ShareBtn;