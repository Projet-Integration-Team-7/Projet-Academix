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
import { ChangeEvent } from 'react';

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

const AccountProfile=({user,btnTitle}:Props)=>{


    const form=useForm({
        resolver:zodResolver(UserValidation),
         defaultValues:{
            profile_photo:'',
            name:'',
            username:'',
            bio:''
         }
    })

    const handleImage=(e: ChangeEvent,fieldChange:(value:string)=> void)=>{
        e.preventDefault();
    }
    // 2. Define a submit handler.
  function onSubmit(values:z.infer<typeof UserValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
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
                <FormLabel className="acount-form_image-label">
                    
                    {field.value ?(
                     <img 
                     src={field.value} 
                     alt="profile photo" 
                     width={96} 
                     height={96} 
                     priority
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
                  onChange={(e)=> handlImage(e,field.onChange)}
                  />
                </FormControl>
                
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 w-full">
                <FormLabel className="atext-base-semibold text-ligth-2">
                Nom Utilisateur

                </FormLabel>
                <FormControl className="flex-1 text-base-semibold text-gray-200">
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
              <FormItem className="flex items-center gap-3 w-full">
                <FormLabel className="atext-base-semibold text-ligth-2">
                    Bio
               </FormLabel>
                <FormControl className="flex-1 text-base-semibold text-gray-200">
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


          
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    )


}


export default  AccountProfile; 