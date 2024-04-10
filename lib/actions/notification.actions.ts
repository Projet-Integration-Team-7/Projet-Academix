"use server"
import Notification from "../models/notification.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
    userId: string;
    message: string;
    notifType: string | null; // Fix the typo here
  }

export async function createNotification({ userId, message, notifType }: Params) {
  try {
    connectToDB();

    // Find the user with the provided unique id
    const user = await User.findOne({ id: userId });

    if (!user) {
      throw new Error("User not found"); // Handle the case if the user with the id is not found
    }

    const newNotification = new Notification({
      userId,
      message,
      notifType,
    });

    const createdNotification = await newNotification.save();
    user.notifications.push(createdNotification._id);


  } catch (error: any) {
    throw new Error(`Error creating notification: ${error.message}`);
  }
}

export async function createFriendRequest( userId:string, senderId:string ) {
  try {
    connectToDB();

    // Find the user with the provided unique id
    const user = await User.findOne({ id: userId });

    if (!user) {
      throw new Error("User not found"); // Handle the case if the user with the id is not found
    }

    const sender = await User.findOne({ id: senderId });
    if (!sender) {
      throw new Error("Sender not found"); // Handle the case if the sender with the id is not found
    }


    const newNotification = new Notification({
      userId,
      senderId,
      message: `${sender.name} sent you a friend request`,
      notifType: "friendRequest",
    });

    const createdNotification = await newNotification.save();
    user.notifications.push(createdNotification._id);


  } catch (error: any) {
    throw new Error(`Error creating notification: ${error.message}`);
  }
}

export async function fetchNotifications(userId: string) {  
  try {
    connectToDB();
    return await Notification.find({ userId });
  } catch (error: any) {
    throw new Error(`Error fetching notifications: ${error.message}`);
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    connectToDB();
    await Notification.findByIdAndDelete(notificationId);
    console.log("Notification deleted successfully");
  } catch (error: any) {
    throw new Error(`Error deleting notification: ${error.message}`);
  }
}

export async function deleteFriendRequestNotification(userId: string, senderId: string) {
  try {
    connectToDB();
    await Notification.deleteOne({ userId, notifType: "friendRequest", senderId });
    console.log("Friend request notification deleted successfully");
  } catch (error: any) {
    throw new Error(`Error deleting friend request notification: ${error.message}`);
  }
}

export async function markNotificationAsRead(notificationId: string) {
    try {
        connectToDB();
        await Notification.findByIdAndUpdate(notificationId, { read: true });
    }catch (error: any) {
        throw new Error(`Error marking notification as read: ${error.message}`);
    } 
}

export async function markAllNotificationsAsRead(userId: string) {
    try {
        connectToDB();
        await Notification.updateMany({ userId }, { read: true });
    } catch (error: any) {
        throw new Error(`Error marking all notifications as read: ${error.message}`);
    }
}

export const getUserNotificationMessages = async (userId: string): Promise<string[]> => {
    try {
      // Find notifications for the specified user
      const notifications = await Notification.find({ userId });
  
      // Extract messages from notifications
      const messages = notifications.map(notification => notification.message);
  
      return messages;
    } catch (error :any) {
      console.error('Error fetching user notifications:', error);
      throw new Error('Failed to fetch user notifications messages as an array');
    }
}
export async function checkIfFriendRequestExists(currentUserId: string, userId: string): Promise<boolean> {
  try {
    connectToDB();
    const currentUser = await User.findOne({ id: currentUserId }); // Await the User.findOne() method call
    if (!currentUser) {
      throw new Error("Current User not found");
    }
    const friendRequestList = currentUser.notifications.filter((notif) => notif.notifType === "friendRequest");
    const friendRequest = friendRequestList.find((notif) => notif.senderId === userId);

    return friendRequest > 0;
  } catch (error: any) { 
    throw new Error(`Error checking if a friend request exists: ${error.message}`);
      throw new Error(`Error checking if a friend request exists: ${error.message}`);
  }
}

