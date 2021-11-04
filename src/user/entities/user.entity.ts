import * as mongoose from "mongoose"

export const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
});

export interface User {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
}
