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
  <Button className="user-card_btn" onClick={() => router.push(`/modifyProfile`) }>
           <img src="image.ico" alt="aallo" />     <h1>   Modify Profile   </h1> 
            </Button>
    )
};
export default ModifyCard