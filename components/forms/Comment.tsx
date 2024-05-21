"use client"

import * as z  from 'zod'
import {useForm} from 'react-hook-form';
import { Button } from "@/components/ui/button"
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {zodResolver} from '@hookform/resolvers/zod';
// import {createThread} from '@/lib/actions/thread.action'
import { usePathname,useRouter } from 'next/navigation';
//import { updateUser } from '@/lib/actions/user.actions';
import { CommentValidation }  from '@/lib/validations/thread';
import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import { addCommentToThread } from '@/lib/actions/thread.action';

interface Props {
    threadId: string;
    currentUserImg: string;
    currentUserId: string;
}

// Le composant Comment prend trois propriétés : threadId, currentUserImg et currentUserId
const Comment = ({ threadId, currentUserImg, currentUserId}: Props) => {
    const router=useRouter();
    const pathname=usePathname();
    
    // Utilisation de react-hook-form pour gérer le formulaire
    const form=useForm({
        resolver:zodResolver(CommentValidation),
        defaultValues:{
            thread:'',
        }
    })

    // Fonction appelée lors de la soumission du formulaire
    const onSubmit= async (values:z.infer<typeof CommentValidation>)=>{
        // Appel de la fonction addCommentToThread pour ajouter un commentaire au thread
        await addCommentToThread(threadId, values.thread, JSON.parse(currentUserId), pathname)
        
        // Réinitialisation du formulaire après la soumission
        form.reset();
    }

    return (
        // Utilisation du composant Form pour encapsuler le formulaire
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="comment-form">

                <FormField  
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className="flex gap-3 items-center w-full">
                            <FormLabel>
                                <Image
                                    src={currentUserImg}
                                    alt="Profile image"
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover"
                                />
                            </FormLabel>
                            <FormControl className="border-none bg-transparent">
                                <Input 
                                    type="text" 
                                    placeholder="Comment..."
                                    className="no-focus text-light-1 outline-none"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit"className="comment-form_btn">
                    Répondre
                </Button>
            </form>
        </Form>
    )
}

export default Comment;