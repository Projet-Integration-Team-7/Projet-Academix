"use client"
import {useForm} from 'react-hook-form';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {zodResolver} from '@hookform/resolvers/zod';
import { UserValidation }  from '@/lib/validations/user';
//zod est un verifieur de typescript
import Image from 'next/image'
import { z } from "zod"
import { ChangeEvent, useState } from 'react';
import { Arapey } from 'next/font/google';
import { isBase64Image } from '@/lib/utils';
import {useUploadThing} from'@/lib/uploadthing'
import { updateUser } from '@/lib/actions/user.actions';

import { usePathname,useRouter } from 'next/navigation';

interface Props{
    user:{
        id:string,
        objectId: string,
        username: string, 
        name:string;
        bio:string;
        image:string;
    };
    btnTitle:string;



}
//cest les liasons les ancorages ici quon prend des ifchier ts
const AccountProfile=({user,btnTitle}:Props)=>{
const[files,setFiles]=useState<File []>([])
const{ startUpload}=useUploadThing("media");
const router=useRouter();
const pathname=usePathname();

    const form=useForm({
        resolver:zodResolver(UserValidation),
         defaultValues:{
            profile_photo:user?.image||"",
            name:user?.name||"",
            username:user?.username||"",
            bio:user?.bio||""
         }
    })
    //charger l'image donner,et de sorte quelle apparati quand tu upload
      const handleImage = (
        e: ChangeEvent<HTMLInputElement>,
        fieldChange: (value: string) => void
      ) => {
        e.preventDefault();
    
        const fileReader = new FileReader();
    
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          setFiles(Array.from(e.target.files));
    
          if (!file.type.includes("image")) return;
    
          fileReader.onload = async (event) => {
            const imageDataUrl = event.target?.result?.toString() || "";
            fieldChange(imageDataUrl);
          };
    
          fileReader.readAsDataURL(file);
        }
      };
    
    // 2. Define a submit handler.
  const onSubmit=async (values:z.infer<typeof UserValidation>)=> {
   //envoyer les donnes recus
   const blob=values.profile_photo;

   const hasImageChanged=isBase64Image(blob);

   if(hasImageChanged){
    const imgRes=await startUpload(files)

    if(imgRes && imgRes[0].fileUrl){
      values.profile_photo=imgRes[0].fileUrl;
    }
   }
   await updateUser({
    name:values.name,
    path:pathname,
    username:values.username,
    userId:user.id,
    bio:values.bio,
    image:values.profile_photo,
    
  });

  if(pathname==='/profile/edit'){
    router.back();
  }else{
    router.push('/');
  }
  }

    return(
        <Form {...form}>
        <form    
        onSubmit={form.handleSubmit(onSubmit)}
         className="flex flex-col justify-start gap-10">
          <FormField
            control={form.control}
            name="profile_photo"
            render={({ field }) => (
              <FormItem className="flex items-center gap-4">
                <FormLabel 
                className="acount-form_image-label">
                    
                    {field.value ?(
                     <img 
                     src={field.value} 
                     alt="profile photo" 
                     width={96} 
                     height={96} 
                     priority="true"
                     className="rounded-full object-contain" />

                    
                   ):(
                    <img
                     src="/assets/profile.svg" 
                    alt="profile photo" 
                    width={24} 
                    height={24} 
                    className="object-contain" />


                   )}
                </FormLabel>
                <FormControl className="flex-1 text-base-semibold text-gray-200">
                  <Input 
                  type="file"
                  accept="image/*"
                  placeholder="Upload a photo"
                  className="account-form_image-input"
                  onChange={(e)=> handleImage(e,field.onChange)}
                  />
                </FormControl>
                
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full">
                <FormLabel className="atext-base-semibold text-light-2">
                Nom 

                </FormLabel>
                <FormControl >
                  <Input 
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                  />
                </FormControl>
                
                <FormMessage />
              </FormItem>
            )}
          />




<FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full">
                <FormLabel className="atext-base-semibold text-light-2">
                Bio 

                </FormLabel>
                <FormControl >
                  <Textarea 
                  rows={10}
                  className="account-form_input no-focus"
                  {...field}
                  />
                </FormControl>
                
                <FormMessage />
              </FormItem>
            )}
          />


          
          <Button type="submit" className="bg-primary-500">Submit</Button>
        </form>
      </Form>
    )


}


export default  AccountProfile; 