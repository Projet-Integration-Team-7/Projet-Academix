"use server";
import { currentUser } from "@clerk/nextjs";
import Notification from "../models/notification.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
  userId: string;
  message: string;
  notifType: string | null; // Corrige la faute de frappe ici
}

/**
 * Crée une notification.
 * @param userId - L'ID de l'utilisateur.
 * @param message - Le message de la notification.
 * @param notifType - Le type de notification.
 */
export async function createNotification({
  userId,
  message,
  notifType,
}: Params) {
  try {
    connectToDB();

    // Trouve l'utilisateur avec l'ID fourni
    const user = await User.findOne({ id: userId });

    if (!user) {
      throw new Error("Utilisateur introuvable"); // Gère le cas où l'utilisateur avec l'ID n'est pas trouvé
    }

    const newNotification = new Notification({
      userId,
      message,
      notifType,
    });

    const createdNotification = await newNotification.save();
    user.notifications.push(createdNotification._id);
  } catch (error: any) {
    throw new Error(`Erreur lors de la création de la notification : ${error.message}`);
  }
}

/**
 * Crée une demande d'ami.
 * @param userId - L'ID de l'utilisateur.
 * @param senderId - L'ID de l'expéditeur.
 */
export async function createFriendRequest(userId: string, senderId: string) {
  try {
    connectToDB();

    // Trouve l'utilisateur avec l'ID fourni
    const user = await User.findOne({ id: userId });

    if (!user) {
      throw new Error("Utilisateur introuvable"); // Gère le cas où l'utilisateur avec l'ID n'est pas trouvé
    }

    const sender = await User.findOne({ id: senderId });
    if (!sender) {
      throw new Error("Expéditeur introuvable"); // Gère le cas où l'expéditeur avec l'ID n'est pas trouvé
    }

    const newNotification = new Notification({
      userId,
      senderId,
      message: `${user.name}, ${sender.name} vous a envoyé une demande d'ami`,
      notifType: "friendRequest",
    });

    const createdNotification = await newNotification.save();
    await User.findByIdAndUpdate(user,{
      $push:{notifications:createdNotification._id}
    })
  } catch (error: any) {
    throw new Error(`Erreur lors de la création de la notification : ${error.message}`);
  }
}

/**
 * Récupère les notifications d'un utilisateur.
 * @param userId - L'ID de l'utilisateur.
 * @returns Les notifications de l'utilisateur.
 */
export async function fetchUserNotifications(userId: string) {
  try {
    connectToDB();
    const notifications = await Notification.find({ userId })
    .sort({ createdAt: "asc" });
    console.log(notifications);
    return notifications
  } catch (error: any) {
    throw new Error(`Erreur lors de la récupération des notifications : ${error.message}`);
  }
}

/**
 * Supprime une notification.
 * @param notificationId - L'ID de la notification.
 */
export async function deleteNotification(notificationId: string) {
  try {
    connectToDB();
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new Error("Notification introuvable");
    }

    const user = await User.findOne({ id: notification.userId });
    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    user.notifications.pull(notification);
    user.save();

    await Notification.findByIdAndDelete(notificationId);
    console.log("Notification supprimée avec succès");
  } catch (error: any) {
    throw new Error(`Erreur lors de la suppression de la notification : ${error.message}`);
  }
}

/**
 * Supprime une notification de demande d'ami.
 * @param userId - L'ID de l'utilisateur.
 * @param senderId - L'ID de l'expéditeur.
 */
export async function deleteFriendRequestNotification(
  userId: string,
  senderId: string
) {
  try {
    connectToDB();
    
    // Vérifie si userId a envoyé une demande d'ami à senderId
    const userSentRequest = await Notification.findOne({
      userId,
      notifType: "friendRequest",
      senderId,
    });

    if (userSentRequest) {
      // Supprime la notification de demande d'ami de userId à senderId
      await Notification.deleteOne({
        userId,
        notifType: "friendRequest",
        senderId,
      });
      
    }

    // Vérifie si senderId a envoyé une demande d'ami à userId
    const senderSentRequest = await Notification.findOne({
      userId: senderId,
      notifType: "friendRequest",
      senderId: userId,
    });

    if (senderSentRequest) {
      // Supprime la notification de demande d'ami de senderId à userId
      await Notification.deleteOne({
        userId: senderId,
        notifType: "friendRequest",
        senderId: userId,
      });
    }

    console.log("Notification de demande d'ami supprimée avec succès");
  } catch (error: any) {
    throw new Error(
      `Erreur lors de la suppression de la notification de demande d'ami : ${error.message}`
    );
  }
}

/**
 * Marque une notification comme lue.
 * @param notificationId - L'ID de la notification.
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    connectToDB();
    await Notification.findByIdAndUpdate(notificationId, { read: true });
  } catch (error: any) {
    throw new Error(`Erreur lors du marquage de la notification comme lue : ${error.message}`);
  }
}

/**
 * Marque toutes les notifications comme lues pour un utilisateur donné.
 * @param currentUserId - L'ID de l'utilisateur actuel.
 */
export async function markAllNotificationsAsRead(currentUserId: string) {
  try {
    connectToDB();
    await Notification.updateMany({ currentUserId }, { read: true });
  } catch (error: any) {
    throw new Error(
      `Erreur lors du marquage de toutes les notifications comme lues : ${error.message}`
    );
  }
}

/**
 * Récupère les messages de notification d'un utilisateur.
 * @param userId - L'ID de l'utilisateur.
 * @returns Les messages de notification de l'utilisateur.
 */
export const getUserNotificationMessages = async (
  userId: string
): Promise<string[]> => {
  try {
    // Trouve les notifications pour l'utilisateur spécifié
    const notifications = await Notification.find({ userId });

    // Extrait les messages des notifications
    const messages = notifications.map((notification) => notification.message);

    return messages;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des messages de notification de l'utilisateur :", error);
    throw new Error("Échec de la récupération des messages de notification de l'utilisateur sous forme de tableau");
  }
};

/**
 * Vérifie si une demande d'ami existe.
 * @param currentUserId - L'ID de l'utilisateur actuel.
 * @param userId - L'ID de l'utilisateur.
 * @returns Vrai si une demande d'ami existe, sinon faux.
 */
export async function checkIfFriendRequestExists(
  currentUserId: string,
  userId: string
): Promise<boolean> {
  try {
    connectToDB();
    const user = await User.findOne({ id: userId }); // Attend l'appel de la méthode User.findOne()
    if (!user) {
      throw new Error("Utilisateur actuel introuvable");
    }

    const friendRequestList = await Notification.find({
      userId,
      notifType: "friendRequest",
    });

    console.log("Liste de demande d'ami :", friendRequestList);

    const friendRequest = friendRequestList.some(
      (notif) => notif.senderId === currentUserId
    );

    console.log("Demande d'ami ; existe ou non", friendRequest);

    return friendRequest;
  } catch (error: any) {
    throw new Error(
      `Erreur lors de la vérification de l'existence d'une demande d'ami : ${error.message}`
    );
  }
}

/**
 * Vérifie si des notifications non lues existent.
 * @param currentUserId - L'ID de l'utilisateur actuel.
 * @returns Vrai si des notifications non lues existent, sinon faux.
 */
export async function checkIfUnreadNotifs(
  currentUserId: string,
): Promise<boolean> {
  try {
    connectToDB();
    const currentUser = await User.findOne({ id: currentUserId });
    if (!currentUser) {
      throw new Error("Utilisateur actuel introuvable");
    }

    const unreadNotifications = await Notification.find({
      userId: currentUserId,
      read: false,
    });

    return unreadNotifications.length > 0;
  } catch (error: any) {
    throw new Error(
      `Erreur lors de la vérification de l'existence de notifications non lues : ${error.message}`
    );
  }
}
