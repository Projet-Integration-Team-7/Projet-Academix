 "use server"
import { connect } from "http2";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import path from "path";
import { threadId } from "worker_threads";

interface Params {
    text: string;
    author: string;
    communityId: string | null;
    image: string | null; // Modifier le type pour accepter null
    path: string;
}
//on a bseoind e quoi pr thread
//65e8b0a1d1c5a76fc26547e7
//methode quon appele back end
export async function createThread({text,author,communityId,image,path}:Params) {
    try {
        
    connectToDB();

    const createdThread=await Thread.create({
        text,
        author,
        image,
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

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    connectToDB();

    // Calculer le nombre de publications à passer
    const skipAmount = (pageNumber - 1) * pageSize;

    // On veut chercher les publications qui n'ont pas de parents (= qui ne sont pas des commentaires)
    const postsQuery = Thread.find({ parentId: { $in: [null, undefined]}})
        .sort({ createdAt: 'desc'})
        .skip(skipAmount)
        .limit(pageSize)
        .populate({ path: 'author', model: User})
        .populate({
            path: 'children',
            populate: {
                path: 'author',
                model: User,
                select: "_id name parentId image"
            }
        })
        
       

        const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined]} })

        const posts = await postsQuery.exec();

        const isNext = totalPostsCount > skipAmount + posts.length;

        return { posts, isNext}
}

export async function fetchThreadById(id: string) {
    connectToDB();

    try {

        // TODO POPULATE COMMUNITY
        const thread = await Thread.findById(id)
        .populate({
            path: 'author',
            model: User,
            select: "_id id name image"
        })
        .populate({
            path: 'children',
            populate: [
                {
                    path: 'author',
                    model: User,
                    select: "_id id name parentId image"
                },
                {
                    path: 'children',
                    model: Thread,
                    populate: {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    }
                }
            ]
        }).exec();

        return thread;
    } catch (error: any) {
        throw new Error(`Error fetching threadL ${error.message}`)
    }
}

export async function addCommentToThread(
    threadId: string,
    commentText: string,
    userId: string,
    image:string,
    path: string,
) {
    connectToDB();

    try {
        // Trouver la publication originale par son ID
        const originalThread = await Thread.findById(threadId);

        if  (!originalThread) {
            throw new Error("Thread not found")
        }

        // Creer une nouvelle publication avec le texte du commentaire
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            image:image,
            parentId: threadId,
        })


        // Sauvegarder la nouvelle publication
        const savedCommentThread = await commentThread.save();

        // Mettre a jour la publication originale pour inclure le commentaire
        originalThread.children.push(savedCommentThread._id)

        // Sauvegarder la publication originale
        await originalThread.save();
        
        revalidatePath(path);
    } catch (error: any) {
         // Ignore the specific error and continue execution
         if (error.message.includes("Cannot read properties of undefined (reading 'length')")) {
            console.error("Ignoring error:", error.message);
        } else {
            // Rethrow other errors
            throw new Error(`Error adding comment to thread: ${error.message}`);
        }
    }
}

export async function updateLikeToThread(
    threadId: string,
    userId: string,
    isLiked: boolean,
){
    connectToDB();

    try {
        // Trouver la publication originale par son ID
        const currentThread = await Thread.findById(threadId);

        if  (!currentThread) {
            throw new Error("Thread not found")
        }

        if (isLiked){
            currentThread.likes.set(userId,new Date());
        } else {
            currentThread.likes.delete(userId);
        }

        console.log(currentThread)
        
        await currentThread.save();
        
    } catch (error: any) {
        throw new Error(`Error updating the like on the thread: ${error.message}`)
    }
}

export async function getThreadLikesCount( 
    threadId: string
    ): Promise<number> {
    try {
        // Find the thread by threadId
        const thread = await Thread.findById(threadId);
        if (!thread) {
            throw new Error("Thread not found");
        }

        // Get the number of keys in the likes Map
        const likesCount = thread.likes.size;
        
        return likesCount;
    } catch (error: any) {
        throw new Error(`Failed to get thread likes count: ${error.message}`);
    }
}

export async function getThreadLikes(threadId: string): Promise<Map<string, Date>> {
    connectToDB();

    try {
        // Find the thread by its ID
        const thread = await Thread.findById(threadId);

        if (!thread) {
            throw new Error("Thread not found");
        }

        // Return the likes map
        return thread.likes;
    } catch (error: any) {
        throw new Error(`Error getting thread likes: ${error.message}`);
    }
}