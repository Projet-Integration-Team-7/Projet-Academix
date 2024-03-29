 "use server"
import { connect } from "http2";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";
import path from "path";
import { threadId } from "worker_threads";
import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";




interface Params {
  text: string;
  author: string;
  communityId: string | null; // Fix the typo here
  image: string | null;
  path: string;
}
//on a bseoind e quoi pr thread
//65e8b0a1d1c5a76fc26547e7
//methode quon appele back end
export async function createThread({text,author,communityId,path,image}:Params) {
    try {
        
    connectToDB();
    console.log("id",communityId)
    
    const communityIdObject=await Community.findOne(
     
        { id : communityId }, 
        {_id:1}
    );
    console.log("marche",1)
    const createdThread=await Thread.create({
        text,
        author,
        image,
        community:communityIdObject,
    });
    //mise a jour user model
    await User.findByIdAndUpdate(author,{
        $push:{threads:createdThread._id}
    })
    if (communityIdObject) {
        // Update Community model
        await Community.findByIdAndUpdate(communityIdObject, {
          $push: { threads: createdThread._id },
        });
      }
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
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children", // Populate the children field
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id name parentId image", // Select only _id and username fields of the author
      },
    });
        
       

        const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined]} })

        const posts = await postsQuery.exec();

        const isNext = totalPostsCount > skipAmount + posts.length;

        return { posts, isNext}
}

export async function fetchThreadById(threadId: string) {
    connectToDB();
  
    try {
      const thread = await Thread.findById(threadId)
        .populate({
          path: "author",
          model: User,
          select: "_id id name image",
        }) // Populate the author field with _id and username
        .populate({
          path: "community",
          model: Community,
          select: "_id id name image",
        }) // Populate the community field with _id and name
        .populate({
          path: "children", // Populate the children field
          populate: [
            {
              path: "author", // Populate the author field within children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
            {
              path: "children", // Populate the children field within children
              model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
              populate: {
                path: "author", // Populate the author field within nested children
                model: User,
                select: "_id id name parentId image", // Select only _id and username fields of the author
              },
            },
          ],
        })
        .exec();
  
      return thread;
    } catch (err) {
      console.error("Error while fetching thread:", err);
      throw new Error("Unable to fetch thread");
    }
  }
async function fetchAllChildThreads(threadId: string): Promise<any[]> {
    const childThreads = await Thread.find({ parentId: threadId });
  
    const descendantThreads = [];
    for (const childThread of childThreads) {
      const descendants = await fetchAllChildThreads(childThread._id);
      descendantThreads.push(childThread, ...descendants);
    }
  
    return descendantThreads;
  }

  export async function addCommentToThread(
    threadId: string,
    commentText: string,
    userId: string,
    path: string
  ) {
    connectToDB();
  
    try {
      // Find the original thread by its ID
      const originalThread = await Thread.findById(threadId);
  
      if (!originalThread) {
        throw new Error("Thread not found");
      }
  
      // Create the new comment thread
      const commentThread = new Thread({
        text: commentText,
        author: userId,
        parentId: threadId, // Set the parentId to the original thread's ID
      });
  
      // Save the comment thread to the database
      const savedCommentThread = await commentThread.save();
  
      // Add the comment thread's ID to the original thread's children array
      originalThread.children.push(savedCommentThread._id);
  
      // Save the updated original thread to the database
      await originalThread.save();
  
      revalidatePath(path);
    } catch (err) {
      console.error("Error while adding comment:", err);
      throw new Error("Unable to add comment");
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

export async function deleteThread(id: string, path: string): Promise<void> {
    try {
      connectToDB();
  
      // Find the thread to be deleted (the main thread)
      const mainThread = await Thread.findById(id).populate("author community");
  
      if (!mainThread) {
        throw new Error("Thread not found");
      }
  
      // Fetch all child threads and their descendants recursively
      const descendantThreads = await fetchAllChildThreads(id);
  
      // Get all descendant thread IDs including the main thread ID and child thread IDs
      const descendantThreadIds = [
        id,
        ...descendantThreads.map((thread) => thread._id),
      ];
  
      // Extract the authorIds and communityIds to update User and Community models respectively
      const uniqueAuthorIds = new Set(
        [
          ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
          mainThread.author?._id?.toString(),
        ].filter((id) => id !== undefined)
      );
  
      const uniqueCommunityIds = new Set(
        [
          ...descendantThreads.map((thread) => thread.community?._id?.toString()), // Use optional chaining to handle possible undefined values
          mainThread.community?._id?.toString(),
        ].filter((id) => id !== undefined)
      );
  
      // Recursively delete child threads and their descendants
      await Thread.deleteMany({ _id: { $in: descendantThreadIds } });
  
      // Update User model
      await User.updateMany(
        { _id: { $in: Array.from(uniqueAuthorIds) } },
        { $pull: { threads: { $in: descendantThreadIds } } }
      );
  
      // Update Community model
      await Community.updateMany(
        { _id: { $in: Array.from(uniqueCommunityIds) } },
        { $pull: { threads: { $in: descendantThreadIds } } }
      );
  
      revalidatePath(path);
    } catch (error: any) {
      throw new Error(`Failed to delete thread: ${error.message}`);
    }
  }

export async function removeAllDeletedThreadsFromUsers() {
    // Fetch all thread IDs from Thread collection
    const allThreads = await Thread.find({});
    const allThreadIds = allThreads.map(thread => thread._id.toString());
  
    // Fetch all users
    const users = await User.find({});
  
    // For each user
    for (let user of users) {
      // Filter user's threads array to only include IDs present in allThreadIds
      const validThreads = user.threads.filter((threadId: string) => allThreadIds.includes(threadId.toString()));
  
      // If there are any invalid threads, update the user's threads array
      if (validThreads.length !== user.threads.length) {
        user.threads = validThreads;
        user.save();
      }
    }
}
export async function calculateTimePassed(date: Date) {
  const now = Date.now();
  const diff = now - date.getTime();

  // Calculate the time in different units
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));

  // Return the simplified time string
  if (months > 1) {
      const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
      return formattedDate;
  } else if (days > 0) {
      return `${days}d`;
  } else if (hours > 0) {
      return `${hours}h`;
  } else {
      return `${minutes}m`;
  }
}