"use client"
import Image from "next/image";
import React,	 { useState,ChangeEvent } from "react";  
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { updateBio, updateImage, updateName } from '@/lib/actions/user.actions';
interface Props {
    id : string ;
    name: string;
    username : string ; 
    imgUrl: string; 
    personType : string ;
}

 

const EditCard =({id, name,username , imgUrl,personType} : Props) => {
  
    const router=useRouter();
    const [newbio, setTextareaValue] = useState('');
    const [newName,setNewName]=useState('');
    const [imageUrl, setImageUrl] = useState("");
    const [imageUrlKey, setImageUrlKey] = useState(Math.random());



    const handleImage =  (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

  const fileReader = new FileReader();

  if (e.target.files && e.target.files.length > 0) {
    const file = e.target.files[0];

    if (!file.type.includes("image")) return;

    fileReader.onload = async () => {
      const imageDataUrl = fileReader.result as string;
      setImageUrl(imageDataUrl);
      


      try {
        await updateImage(id, imageDataUrl); // Mettre à jour l'image dans la base de données avec l'URL de l'image
        console.log("L'image a été mise à jour dans la base de données.");
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'image dans la base de données :', error);
      }
    
      console.log("URL de l'image:", imageDataUrl); // Afficher l'URL dans la console
      
    };

    fileReader.readAsDataURL(file);
  }
};



    const handleTextareaChange = (event : any) => {
      setTextareaValue(event.target.value);
    };
    const handleBioChange = (event : any) => {
      setNewName(event.target.value);
    };

    const handleSubmit = async() => {
      console.log('Contenu du textarea :', newbio);
      console.log('Contenu du textarea :', newName);
      console.log("contenue du url : " , imageUrl)
      try {
        
        await updateBio(id, newbio); 
    } catch (error) {
        console.error('erreur la transmission ne marche pas :', error);
    }

    try {
        
      await updateName(id, newName); 
  } catch (error) {
      console.error('erreur la transmission ne marche pas :', error);
  }

    };
  


    return(
    <div>
         <h3 className="head-text mb-5 text-base my-20">
          NEW  Profile picture
           </h3>
        <div className="flex items-center ">
            <div>
         
        <article className="user-card">
            <div className="user-card_avatar">
              <div >
                <Image 
                src={imageUrl}
                alt="Uploaded"
                key={imageUrlKey}
              width={48}
              height={48}
              className="rounded-full"
                />

  <label className="block mb-2 text-sm font-medium text-white" for="file_input">Upload new profile picture</label>
<input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-black text-white dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file"
onChange={handleImage} ></input>

</div>
             <div className="flex-1 text-ellipsis">
              <h4 className="text-base-semibold text-light-1">
                {name}
              </h4>
            </div>
            </div>
            </article>
            </div>
            <div className="mx-40"></div>
    

           </div>
           <div>
           <h3 className="head-text mb-5 text-base my-20">
            Name
           </h3>
           
           <div className="w-72">
           <div className="relative w-full min-w-[200px] h-10">
 
 
 
  <input
    className="peer w-full h-full bg-transparent text-white font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
    value={newName}
    onChange={handleBioChange}
/>
  <label
    className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-white leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-white transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900"
  >
    Change name
  </label>
</div>

</div>  




           </div>
            <div>
           <h4 className="head-text mb-5 text-base my-20">Biography 
             </h4>
             <div className="my-14">
             <div className="w-96">
  <div className="relative w-full min-w-[200px]">
    <textarea id="nouvelle bio"
          value={newbio}
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