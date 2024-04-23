"use server";
import Notification from "../models/notification.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
  userId: string;
  message: string;
  notifType: string | null; // Fix the typo here
}

export async function createNotification({
  userId,
  message,
  notifType,
}: Params) {
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

export async function createFriendRequest(userId: string, senderId: string) {
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
    // user.notifications.push(createdNotification._id);
      await User.findByIdAndUpdate(user,{
        $push:{notifications:createdNotification._id}
    })
  } catch (error: any) {
    throw new Error(`Error creating notification: ${error.message}`);
  }
}

export async function fetchUserNotifications(userId: string) {
  try {
    connectToDB();
    const notifications = await Notification.find({ userId })
    .sort({ createdAt: "asc" });
    console.log(notifications);
    return notifications
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

export async function deleteFriendRequestNotification(
  userId: string,
  senderId: string
) {
  try {
    connectToDB();
    
    // Check if userId sent a friend request to senderId
    const userSentRequest = await Notification.findOne({
      userId,
      notifType: "friendRequest",
      senderId,
    });

    if (userSentRequest) {
      // Delete the friend request notification from userId to senderId
      await Notification.deleteOne({
        userId,
        notifType: "friendRequest",
        senderId,
      });
    }

    // Check if senderId sent a friend request to userId
    const senderSentRequest = await Notification.findOne({
      userId: senderId,
      notifType: "friendRequest",
      senderId: userId,
    });

    if (senderSentRequest) {
      // Delete the friend request notification from senderId to userId
      await Notification.deleteOne({
        userId: senderId,
        notifType: "friendRequest",
        senderId: userId,
      });
    }

    console.log("Friend request notification deleted successfully");
  } catch (error: any) {
    throw new Error(
      `Error deleting friend request notification: ${error.message}`
    );
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    connectToDB();
    await Notification.findByIdAndUpdate(notificationId, { read: true });
  } catch (error: any) {
    throw new Error(`Error marking notification as read: ${error.message}`);
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  try {
    connectToDB();
    await Notification.updateMany({ userId }, { read: true });
  } catch (error: any) {
    throw new Error(
      `Error marking all notifications as read: ${error.message}`
    );
  }
}

export const getUserNotificationMessages = async (
  userId: string
): Promise<string[]> => {
  try {
    // Find notifications for the specified user
    const notifications = await Notification.find({ userId });

    // Extract messages from notifications
    const messages = notifications.map((notification) => notification.message);

    return messages;
  } catch (error: any) {
    console.error("Error fetching user notifications messages:", error);
    throw new Error("Failed to fetch user notifications messages as an array");
  }
};

export async function checkIfFriendRequestExists(
  currentUserId: string,
  userId: string
): Promise<boolean> {
  try {
    connectToDB();
    const user = await User.findOne({ id: userId }); // Await the User.findOne() method call
    if (!user) {
      throw new Error("Current User not found");
    }

    const friendRequestList = await Notification.find({
      userId,
      notifType: "friendRequest",
    });

    console.log("friend request list:", friendRequestList);

    const friendRequest = friendRequestList.some(
      (notif) => notif.senderId === currentUserId
    );

    console.log("friend request; exists or no", friendRequest);

    return friendRequest;
  } catch (error: any) {
    throw new Error(
      `Error checking if a friend request exists: ${error.message}`
    );
  }
}
