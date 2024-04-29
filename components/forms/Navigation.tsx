"use client"
import React from "react";
import { CiSettings } from "react-icons/ci";

export default function Navigation({setOpenSetting }: any) {
    return (
        <nav className="pt-5 text-white flex justify-between w-full mx-auto items-center"> 
            <div className="flex items-center gap-4 cursor-pointer"> 
            </div>
            <CiSettings className="text-2xl cursor-pointer" onClick={()=> setOpenSetting((value : number) => !value)}/>
        </nav>
    );
}
