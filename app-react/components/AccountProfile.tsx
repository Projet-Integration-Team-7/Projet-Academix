"use client"
import {useForm} from 'react-hook-form';
import { 
    
    Form 
} from '@/components/ui/form';
import {zodResolver} formimport { UserValidation } from '@/lib/validations/user';
 '@hookform/resolver/zod';
//zoo est un verifieur de typescript
import {userValdiation} from '@lib/validations/user';

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
        resolver:zodResolver(UserValidation)
    })
    return(
        <Form>
            
        </Form>
    )


}


export default  AccountProfile; 