"use client"
//import { z } from "zod"
import * as z  from 'zod'
import React, { useReducer } from 'react';

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
import { Textarea } from "@/components/ui/textarea"
import { isBase64Image } from '@/lib/utils';
import {useUploadThing} from'@/lib/uploadthing'
import {zodResolver} from '@hookform/resolvers/zod';
import {createThread} from '@/lib/actions/thread.action'
import {useOrganization} from'@clerk/nextjs';
//zod est un verifieur de typescript

import { Arapey } from 'next/font/google';



import { usePathname,useRouter } from 'next/navigation';
//import { updateUser } from '@/lib/actions/user.actions';
import { ThreadValidation }  from '@/lib/validations/thread';
import { useState, ChangeEvent } from 'react';
import { Input } from '../ui/input';

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

/**
 * Composant de formulaire pour poster un thread.
 * 
 * @param userId - L'ID de l'utilisateur qui poste le thread.
 * @returns Le composant de formulaire pour poster un thread.
 */
function PostThread({userId}:{userId:string}){
    const[files,setFiles]=useState<File []>([])
    const{ startUpload}=useUploadThing("media");
    const router=useRouter();
    const pathname=usePathname();
    const {organization}=useOrganization();
    
        const form=useForm({
            resolver:zodResolver(ThreadValidation),
             defaultValues:{
                thread:'',
                accountId:userId,
                image_thread:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB4AAAAQ4AQMAAADSHVMAAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAGUExURQAAAAAAAKVnuc8AAAABdFJOU/4a4wd9AAAED0lEQVR42u3PQQ0AAAgEIDf7V1ZfpjhoQG2WKWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYeHccIj+8AGdU9s1O0HsQgAAAABJRU5ErkJggg==",
                threadType:'exercise',
              }
        })
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










        //pour envoyer  le formulaire on utilise la fonction handleSubmit
        const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
         
         
          const blob = values.image_thread ?? '';
                  
          const hasImageChanged = isBase64Image(blob);
                  
          if (hasImageChanged) {
            const imgRes = await startUpload(files);
                  
            if (imgRes && imgRes.length > 0 && imgRes[0].fileUrl) {
              values.image_thread = imgRes[0].fileUrl;
            }
          }
                
          console.log('ORG ID:',organization)
          await createThread({
            text: values.thread,
            author: userId,
            communityId: organization? organization.id:null,
            path: pathname,
            image: values.image_thread,
            threadType: values.threadType,
          });
        
          if (pathname === '/thread/edit') {
            router.back();
          } else {
            router.push('/');
          }
          location.reload();
        };

    return (
     <Form {...form}>
        <form 
        onSubmit={form.handleSubmit(onSubmit as SubmitHandler<{ thread: string; accountId: string; threadType: "exercise" | "course_note" | "evaluation"; image_thread?: string | undefined; }>)}
         className="mt-10 flex flex-col justify-start gap-10">


          <FormField  
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full">
                <FormLabel className="atext-base-semibold text-light-2">
                Contenu

                </FormLabel>
                <FormControl className="no-focus input-focus-effect">
                  <Textarea 
                  rows={15}
                  {...field}
                  />
                </FormControl>
                
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image_thread"
            render={({ field }) => (
              <FormItem className="flex items-center gap-4">
                <FormLabel 
                className="acount-form_image-label">
                    
                    {field.value ?(
                     <img 
                     src={field.value} 
                     alt="image_thread" 
                     width={96} 
                     height={96} 
                     priority="true"
                     className="rounded-full object-contain" />

                    
                   ):(
                    <img
                     src="" 
                    alt="image_thread" 
                    width={100} 
                    height={100} 
                    className="object-contain" />


                   )}
                </FormLabel>
                <FormControl className="flex-1 text-base-semibold text-gray-200">
                <div className="file-input-container">
                 <label className="file-input-button">
                 Télécharger une photo(1mo max)
                  <Input 
                  type="file"
                  accept="image/*"
                  placeholder="Upload a photo"
                  className="account-form_image-input"
                  onChange={(e)=> handleImage(e,field.onChange)}
                  />
    
               </label>
                  </div>
                </FormControl>
                
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
         control={form.control}
          name="threadType"
              render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full">
            <FormLabel className="text-base-semibold text-light-2">
        Type du Thread
           </FormLabel>
            <FormControl className="no-focus">
            <select {...field} className="select-custom">
         <option value="exercise">Exercices</option>
         <option value="course_note">Notes de cours</option>
         <option value="evaluation">Évaluation</option>
         // Add more options as needed
       </select>
           </FormControl>
               <FormMessage />
                </FormItem>
                )}
/>
          <Button type="submit"
          className="button-hover-effect">
            Postez un Thread
          </Button>
         </form>
       </Form>

    );
}

export default PostThread;