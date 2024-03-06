 "use server"
import { connect } from "http2";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";

interface Params{
    text:string,
    author:string,
    communityId:string|null,
    path:string,
}
//on a bseoind e quoi pr thread
//65e8b0a1d1c5a76fc26547e7
//methode quon appele back end
export async function createThread({text,author,communityId,path}:Params) {
    try {
        
    connectToDB();

    const createdThread=await Thread.create({
        text,
        author,
        community:null,
    });
    //mise a jour user model
    await User.findByIdAndUpdate(author,{
        $push:{threads:createdThread._id}
    })
    //sassurer path est mise ajour
    revalidatePath(path);
    } catch (error:any) {
        throw new Error(`Error creating thread:${error.message}`);
        
    }
    
}