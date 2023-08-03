import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, selecte: false, unique: true }, // selecte: false means that when fetch user email and password will not come unless explicitely request
    password: { type: String, required: true, selecte: false },
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
