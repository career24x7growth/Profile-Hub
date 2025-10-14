import mongoose, { Document, Schema } from "mongoose";

export interface IConversation extends Document {
  type: "direct" | "group";
  name?: string;
  participants: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  lastMessage?: {
    content: string;
    sender: mongoose.Types.ObjectId;
    timestamp: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      required: true,
    },
    name: {
      type: String,
      required: function (this: IConversation) {
        return this.type === "group";
      },
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastMessage: {
      content: String,
      sender: { type: Schema.Types.ObjectId, ref: "User" },
      timestamp: Date,
    },
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1 });
conversationSchema.index({ type: 1, participants: 1 });

export default mongoose.model<IConversation>("Conversation", conversationSchema);
