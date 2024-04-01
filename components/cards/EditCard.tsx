"use client"
import Image from "next/image";
import React,	 { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { updateBio } from '@/lib/actions/user.actions';
interface Props {
    id : string ;
    name: string;
    username : string ; 
    imgUrl: string; 
    personType : string ;
}

 

const EditCard =({id, name,username , imgUrl,personType} : Props) => {
  
    const router=useRouter();
    const [textareaValue, setTextareaValue] = useState('');

    const handleTextareaChange = (event : any) => {
      setTextareaValue(event.target.value);
    };
  
    const handleSubmit = async() => {
      console.log('Contenu du textarea :', textareaValue);
      try {
        
        await updateBio(id, textareaValue); 
    } catch (error) {
        console.error('erreur la transmission ne marche pas :', error);
    }
    };

    return(
    <div>
        <div className="flex items-center ">
            <div>
        <article className="user-card">
            <div className="user-card_avatar">
                <Image
                src={imgUrl}
                alt="logo"
              width={48}
              height={48}
              className="rounded-full"
                />
             <div className="flex-1 text-ellipsis">
              <h4 className="text-base-semibold text-light-1">
                {name}
              </h4>
              <p className="text-small-medium text-gray-1">@{username}</p>
            </div>
            </div>
            </article>
            </div>
            <div className="mx-80"></div>
            <div>
            <Button className=" user-card_btn" >
              <h1>   Modify photo   </h1> 
            </Button>
            </div>
           </div>
            <div>
           <h4 className="head-text mb-5 text-base my-20">Biography 
             </h4>
             <div className="my-14">
             <div className="w-96">
  <div className="relative w-full min-w-[200px]">
    <textarea id="nouvelle bio"
          value={textareaValue}
          onChange={handleTextareaChange}
      className="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-white outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
      placeholder="rentrez votre bio"></textarea>
    <label
      className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
      Modify Bio
    </label>
  </div>



  <Button className=" user-card_btn my-14"
  onClick={handleSubmit} >
              <h1>    Submit  </h1> 
            </Button>



</div>

                
             </div>
             </div>
      
           </div>
        
    )
};
export default EditCard;