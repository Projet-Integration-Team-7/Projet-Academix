"use client"
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
interface Props {
    id : string ; 
    name: string;
    username : string ; 
    imgUrl: string; 
    personType : string ;
    usage: string;
}
const UserCard =({id, name,username, imgUrl,personType,usage} : Props) => {
    const router=useRouter();
    return (
        <article className="user-card">
            <div className={`user-card_avatar ${usage === "amis" && "hover:cursor-pointer"}`} onClick={() => (usage === "amis") && router.push(`/profile/${id}`) }>
                <Image
                src={imgUrl}
                alt="logo"
              width={48}
              height={48}
              className="rounded-full"
                />
             <div className="flex-1 text-ellipsis">
              <h4 className="text-base-semibold text-light-1 text-wrap">
                {name}
              </h4>
              <p className="text-small-medium text-gray-1 text-wrap">@{username}</p>
            </div>
            </div>
            {usage === "search" && (
              <Button className="user-card_btn" onClick={() => router.push(`/profile/${id}`) }>
                View
              </Button>
            )}
        </article>
    )
}
export default UserCard