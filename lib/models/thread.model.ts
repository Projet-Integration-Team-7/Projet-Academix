import mongoose   from "mongoose";

const threadSchema=new mongoose.Schema({
    text: {
        type: String,
        required: true,
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      //user qui ecrit
      community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
      },
      image:   {
        type:String,
        default: "",
      },
  
      //groupes 
      createdAt: {
        type: Date,
        default: Date.now,
      },
      parentId: {
        type: String,
      },
      children: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Thread",
        },
        //un thread peut avoir plusieur thread
      ],
      likes: {
        type: Map,
        of: {
            type: Date,
            default: Date.now,
        },
        default: new Map(),
    }
});

const Thread=mongoose.models.Thread ||mongoose.model('Thread',threadSchema);
export default Thread;


//Thread Original
//->thread comment 1
//->thread  comment 2
//    ->threa comment 3
//heritage