"use server"

import { connect } from "http2"
import { connectToDB } from "../mongoose"
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";
import Community from "../models/community.model";
import { clerkClient } from "@clerk/nextjs";



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
export async function removeThreadFromUser(userId: string, threadId: string): Promise<void> {
    try {
        connectToDB();
        await User.updateOne({ id: userId }, { $pull: { threads: threadId } });
    } catch (error: any) {
        throw new Error(`Failed to remove thread from user: ${error.message}`);
    }
    
}

export const updateBio = async (userId: string, newBio: string): Promise<void> => {
  connectToDB();

  try {
      // Mettre à jour le document utilisateur dans la base de données MongoDB
      await User.findOneAndUpdate(
          { id: userId },
          { bio: newBio },
          { upsert: true }
      );

      console.log('La bio a été mise à jour avec succès superrrr letsghoo.');
  } catch (error) {
      console.error('Erreur lors de la mise à jour de la bio :', error);
      
      
  }
};
export const updateName = async (userId: string, newName: string): Promise<void> => {
  connectToDB();

  try {
      // Mettre à jour le document utilisateur dans la base de données MongoDB
      await User.findOneAndUpdate(
          { id: userId },
          { name: newName },
          { upsert: true }
      );

      console.log('Le nom a été mise à jour avec succès superrrr letsghoo.');
  } catch (error) {
      console.error('Erreur lors de la mise à jour du nom :', error);
      
      
  }
};
export const updateImage= async (userId: string, newImage: string): Promise<void> => {
  connectToDB();

  try {
      // Mettre à jour le document utilisateur dans la base de données MongoDB
      await User.findOneAndUpdate(
          { id: userId },
          { image: newImage },
          { upsert: true }
      );

      console.log('Le nom a été mise à jour avec succès superrrr letsghoo.');
  } catch (error) {
      console.error('Erreur lors de la mise à jour du nom :', error);
      
      
  }
};

export async function addFriend(userId: string, friendId: string) {
    try {
        connectToDB();
        const user = await User.findOne({ id: userId });
        if (!user) {
            throw new Error("User not found");
        }

        const friend = await User.findOne({ id: friendId });
        if (!friend) {
            throw new Error(`Friend User ${friendId} not found`);
        }

        user.friends.push(friend);
        friend.friends.push(user);

        user.save();
        friend.save();
    }catch (error: any) {
        throw new Error(`Failed to add friend: ${error.message}`);
    }
}

export async function removeFriend(userId: string, friendId: string) { 
    try {
        connectToDB();
        const user = await User.findOne({ id: userId });
        if (!user) {
            throw new Error("User not found");
        }

        const friend = await User.findOne({ id: friendId });
        if (!friend) {
            throw new Error("Friend User not found");
        }
        
        user.friends = user.friends.filter((id) => id !== friendId);
        friend.friends = friend.friends.filter((id) => id !== userId);

        user.save();
        friend.save();

    } catch (error:any) {
        throw new Error(`Failed to remove friend: ${error.message}`);
    }
}

export async function verifyFriendship(currentUserId: string, userId: string): Promise<boolean>{
    try {
        connectToDB();
        const currentUser = await User.findOne({ id: currentUserId }).exec();
        if (!currentUser) {
            throw new Error("Current User not found");
        }
        const user = await User.findOne({ id: userId }).exec();
        if (!user) {
            throw new Error("Profiled User not found");
        }
        
        return currentUser.friends.includes(user._id);
    } catch (error: any) {
        throw new Error(`Failed to verify friendship: ${error.message}`);
    }
}

export async function removeDeletedUsers() {
    try {
        // Fetch all users
        const usersClerk = await clerkClient.users.getUserList();
        // console.log('usersClerk', usersClerk); // Debug line

        const usersMap = usersClerk.map(user => user.id.toString());
        // console.log('usersMap', usersMap); // Debug line

        const usersMongo = await User.find();
        const usersMongoMap = usersMongo.map(user => user.id.toString()); // Use _id instead of id
        // console.log('usersMongoMap', usersMongoMap); // Debug line

        for (let user of usersMongoMap) {
        if (!usersMap.includes(user)) {
            await User.deleteOne({ _id: user });
        }
        }

        // Rest of the code...
    } catch (error: any) {
        throw new Error(`Failed to remove deleted users from Mongo database: ${error.message}`);
    }
}
