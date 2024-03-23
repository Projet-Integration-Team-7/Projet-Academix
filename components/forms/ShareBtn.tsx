"use client";
import Image from "next/image";



const ShareBtn = () => {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          url: window.location.href,
        });
        console.log("Shared successfully");
      } else {
        throw new Error("Web Share API is not supported in this browser");
      }
    } catch (error: any) {
      throw new Error("Error sharing:", error.message);
    }
  };

  return (
    <div
      role="button"
      onClick={handleShare}
      tabIndex={0}
      aria-label="Share"
      className=" align-middle self-center"
    >
      <Image
        src="/assets/share.svg"
        alt="share"
        width={24}
        height={24}
        className="cursor-pointer object-contain transition ease-in-out hover:scale-110"
      />
    </div>
  );
};

export default ShareBtn;
