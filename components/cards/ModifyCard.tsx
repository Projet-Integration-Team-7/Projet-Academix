"use client"
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
interface Props{
}
const ModifyCard=({} :Props) =>{
    const router=useRouter();

    return(
      <div className="flex items-center">
      <Image
      className="rounded-full"
      width={45}
      height={50}
       src="/assets/image.png"
        alt="aallo" /> 
<Button className="user-card_btn w-48 h-12 mx-2" onClick={() => router.push(`/modifyProfile`)}>
    
              <h1>      Modify Profile   </h1> 
            </Button>
            </div>
    )
};
export default ModifyCard