"use server"

import { connect } from "http2"
import { connectToDB } from "../mongoose"
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

interface Params{
    userId:string;
    username:string;
    name:string;
    bio:string;
    image:string;
    path:string;
}
export async function updateUser({
    userId,
    bio,
    name,
    path,
    username,
    image,
}:Params):Promise<void>{
    connectToDB();

    try {
        await User.findOneAndUpdate(
            {id:userId},
            {
            username:username.toLowerCase(),
            name,
            bio,
            image,
            onboarded:true,
            },
            {upsert: true}
        )
        if(path==='/profile/edit'){
            revalidatePath(path);
        }
    } catch (error:any) {
        throw new Error(`Impossible de creer /update user:${error.message}`)
        
        
    }
        
        }

     export async function fetchUser(userId:string){
        try {
            connectToDB();
            return await User
            .findOne({id:userId})
            //    .populate({
              //      path:'communities'
                //    model:Community
                //})
        } catch (error:any) {
            throw new Error(`Failed to fetch user:${error.message}`)
        }
     }   
    export async function fetchUserPosts(userId: string ) {
    try{
        connectToDB
        // trouver les posts du user selon son id

        // TODO : populate community
        const threads=await User.findOne({id : userId})
        .populate({
            path: 'threads', 
            model : Thread,
            populate : {
                path  : 'children',
                model : Thread,
                populate : {
                    path:'author',
                    model: User,
                    select : 'name image id'
            }
        }   

        })
        return threads 
    } catch(error : any){
       throw new Error('Failed to fetch user posts : ${error.message}')  
    }
}

export async function fetchUsers({
    userId,
    searchString="",
    pageNumber=1,
    pageSize=20,
     sortBy="desc"



}  :  {
    userId:string ;
    searchString?:string;
    pageNumber : number;
    pageSize?:number;
    sortBy ?: SortOrder
})

  {
    try{
connectToDB();
const skipAmount =(pageNumber - 1)* pageSize;

const regex=new RegExp(searchString , "i")

const query: FilterQuery<typeof User> = {
    id: {$ne: userId}
}
    if(searchString.trim( )!== ""){
        query.$or =[
{username : {$regex : regex}},
{name : {$regex : regex }}

        ]
    }

    const sortOptions={createdAt : sortBy};
    const usersQuery= User.find(query)
    .sort(sortOptions).skip(skipAmount).limit(pageSize);
    const totalUsersCount=await User.countDocuments(query);
    const users= await usersQuery.exec();
    const isNext= totalUsersCount> skipAmount + users.length;
    return {users, isNext};
    } catch (error : any){
throw new Error (`Failed to fetch users : ${error.message}` )
    }
}
// systeme de <<notifications >>
export async function getActivity (userId : string ){
    try{
        connectToDB();

        // trouver tous les postes du user
        const userThreads = await Thread.find ({author: userId})
        // collecte tous les messages envoye et les place dans ensemble dans un tableau
        const childThreadIds=userThreads.reduce( (acc,userThread)=> {
        return acc.concat(userThread.children)
        },[])
        const replies =await Thread.find({
            _id:{$in: childThreadIds},
            author: {$ne: userId}
        }) .populate(
            {
                path: 'author',
                model : User,
                select: 'name image _id'
            })
            return replies;
    } catch (error : any){
        throw new Error (`Failed to fetch activity : ${error.message }`)
    }
}

export async function updatePostToLikes(
    threadId: string,
    userId: string,
    isLiked: boolean
    ) {
    try {
        // Find the user by userId
        const user = await User.findOne({ id: userId });
        if (!user) {
            throw new Error("User not found");
        }

        
        // Update the likes Map to add the threadId as a key
        if (isLiked){
            user.likes.set(threadId, new Date());
        } else {
            // If like is true, add threadId to likes Map
            user.likes.delete(threadId);
        }

        console.log(user);
        
        // Save the updated user
        await user.save();
    } catch (error: any) {
        throw new Error(`Failed to update post in the likes of the user: ${error.message}`);
    }
}

