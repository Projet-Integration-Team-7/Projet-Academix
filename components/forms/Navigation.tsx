import React from "react";
import { MdOutlineKeyboardCommandKey } from "react-icons/md";
import { CiSettings } from "react-icons/ci";

export default function Navigation() {
    return (
        <nav className="pt-5 text-white flex justify-between w-full mx-auto items-center"> 
            <div className="flex items-center gap-4 cursor-pointer"> 
                <MdOutlineKeyboardCommandKey className="text-xl" />
                <h1 className="text-white mr-4" style={{ whiteSpace: "nowrap" }}>Daily Focus</h1> 
            </div>
            <CiSettings className="text-2xl cursor-pointer" />
        </nav>
    );
}
