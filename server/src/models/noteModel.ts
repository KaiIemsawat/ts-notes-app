import { InferSchemaType, Schema, model } from "mongoose";

const noteSchema = new Schema(
    {
        title: { type: String, required: true, minLength: 2 },
        text: { type: String, required: true, minLength: 2 },
    },
    { timestamps: true }
);

type Note = InferSchemaType<typeof noteSchema>;

export default model<Note>("Note", noteSchema);
