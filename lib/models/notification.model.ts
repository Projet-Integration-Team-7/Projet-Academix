




import mongoose   from "mongoose";

const notificationSchema=new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    senderId: {
        type: String,
    },
    message: {
         type: String,
        required: true,
     },
     createdAt: {
        type: Date,
        default: Date.now,
     },
     notifType: {
        type: String,
        required: true,
     },
    read: {
        type: Boolean,
        default: false,
    },
});

const Notification = mongoose.models.Notification ||mongoose.model('Notification',notificationSchema);
export default Notification;
