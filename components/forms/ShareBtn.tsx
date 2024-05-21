"use client";
import Image from "next/image";
import { Popover } from "@headlessui/react";
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  EmailIcon,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

const getBrowserName = () => {
  let browserInfo = "";
  if (typeof navigator !== "undefined") {
    browserInfo = navigator.userAgent;
  }
  let browser;
  if (browserInfo.includes("Opera") || browserInfo.includes("Opr")) {
    browser = "Opera";
  } else if (browserInfo.includes("Edg")) {
    browser = "Edge";
  } else if (browserInfo.includes("Chrome")) {
    browser = "Chrome";
  } else if (browserInfo.includes("Safari")) {
    browser = "Safari";
  } else if (browserInfo.includes("Firefox")) {
    browser = "Firefox";
  } else {
    browser = "unknown";
  }
  return browser;
};

interface ShareBtnProps {
  threadId: string;
}

/**
 * Composant bouton de partage.
 * 
 * @param threadId - L'identifiant du thread.
 * @returns Le composant bouton de partage.
 */
const ShareBtn = ({ threadId }: ShareBtnProps) => {
  let threadURL = '';
  if (typeof window !== 'undefined') {
    threadURL = `${window.location.href}/thread/${threadId}`;
  }
  
  /**
   * Copie l'URL du thread dans le presse-papiers.
   */
  const handleCopy = () => {
    navigator.clipboard.writeText(threadURL);
  };

  /**
   * Partage l'URL du thread via le navigateur ou les applications de partage.
   */
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          url: threadURL,
          title: "Academix",
          text: "Jette un coup d'oeil à ce thread intéressant sur Academix !",
        });
      } else {
        throw new Error("Web Share API is not supported in this browser");
      }
    } catch (error: any) {
      throw new Error("Error sharing:", error.message);
    }
  };

  return (
    <div>
      {getBrowserName() === "Chrome" ? (
        <Popover className={"bg-transparent shadow-none"}>
          <Popover.Button className={"bg-transparent shadow-none"}>
            <Image
              src="/assets/share.svg"
              alt="share"
              width={24}
              height={24}
              className="cursor-pointer object-contain transition ease-in-out hover:scale-110"
            />
          </Popover.Button>
          <Popover.Panel>
            <div className="inline-flex absolute bg-white rounded-xl px-2 justify-around ring-2">
              <EmailShareButton url={threadURL}>
                <EmailIcon
                  className="rounded-md self-center align-middle m-1"
                  size={24}
                  round={true}
                  borderRadius={4}
                />
              </EmailShareButton>
              <FacebookShareButton url={threadURL}>
                <FacebookIcon
                  className="rounded-md self-center align-middle m-1"
                  size={24}
                  round={true}
                  borderRadius={4}
                />
              </FacebookShareButton>
              <TwitterShareButton url={threadURL}>
                <TwitterIcon
                  className="rounded-md self-center align-middle m-1"
                  size={24}
                  round={true}
                  borderRadius={4}
                />
              </TwitterShareButton>
              <WhatsappShareButton url={threadURL}>
                <WhatsappIcon
                  className="rounded-md self-center align-middle m-1"
                  size={24}
                  round={true}
                  borderRadius={4}
                />
              </WhatsappShareButton>
              <Image
                src="/assets/link.svg"
                alt="copy"
                width={18}
                height={18}
                className="cursor-pointer object-contain self-center align-middle m-1"
                onClick={handleCopy}
              />
            </div>
          </Popover.Panel>
        </Popover>
      ) : (
        <div>
          <button
            type="button"
            onClick={handleShare}
            className="align-middle self-center bg-transparent shadow-none"
            title="Share"
          >
            <Image
              src="/assets/share.svg"
              alt="share"
              width={24}
              height={24}
              className="cursor-pointer object-contain transition ease-in-out hover:scale-110"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareBtn;
