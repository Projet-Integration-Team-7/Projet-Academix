"use server"
import { connect } from "http2";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";
import path from "path";
import { threadId } from "worker_threads";
import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";
export const fetchStatistics = async () => {
    // Logique pour récupérer les statistiques
  };
  export async function fetchTopAuthors() {
    connectToDB();
    console.log( "Connected to mongo DB 1")
    try {
        // Utiliser l'agrégation pour grouper par 'author' et compter les occurrences
        const topAuthors = await Thread.aggregate([
            {
                $group: {
                    _id: "$author",  // Group by the 'author' field
                    count: { $sum: 1 }  // Count occurrences
                }
            },
            {
                $sort: { count: -1 }  // Sort by count in descending order
            },
            {
                $limit: 3  // Limit to the top 3
            },
            {
                $lookup: {  // Optional: Lookup to fetch author details from the User collection
                    from: "users",  // Assuming your user collection is named 'users'
                    localField: "_id",
                    foreignField: "_id",
                    as: "authorDetails"
                }
            },
            {
                $unwind: "$authorDetails"  // Flatten the authorDetails array
            },
            {
                $project: {  // Select only the fields you want to display
                    authorId: "$_id",
                    name: "$authorDetails.name",
                    count: 1
                }
            }
        ]);

        return topAuthors;
    } catch (error) {
        console.error("Error while fetching top authors:", error);
        throw new Error(`Failed to fetch top authors: ${error.message}`);
    }
}
export async function fetchNumberOfUsers() {
    connectToDB();
    try{
const numberOfUsers=await User.countDocuments();



return numberOfUsers;
    } catch (error: any) {
        throw new Error(`Error creating event: ${error.message}`);
      }
}
export async function fetchNumberOfCommunities() {
    connectToDB();
    try{
const numberOfPosts=await Community.countDocuments();
return numberOfPosts;
    } catch (error: any) {
        throw new Error(`Error creating event: ${error.message}`);
      }
}

export async function fetchThreadsLikes() {
    connectToDB();
    console.log("Connected to mongo")
    try {
        // Utiliser l'agrégation pour grouper par 'author' et compter les occurrences
        const topThreadsLikes = await Thread.aggregate([
          {
            $project: {
                _id: 1,
                author: 1,
                likesCount: { $size: { $objectToArray: "$likes" } }
            }
        },
        {
            $sort: { likesCount: -1 }
        },
        {
            $limit: 3
        },
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "authorInfo"
            }
        },
        {
            $unwind: "$authorInfo"
        },
        {
            $project: {
                _id: 1,
                "authorInfo.name": 1,
                likesCount: 1
            }
        }
    ]);
        console.log("Top threads likes:", topThreadsLikes); // Affichez les résultats de l'agrégation

        return topThreadsLikes;
    } catch (error) {
        console.error("Error while fetching top authors:", error);
        throw new Error(`Failed to fetch top authors: ${error.message}`);
    }
}