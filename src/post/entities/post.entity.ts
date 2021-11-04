import * as mongoose from "mongoose"

export const PostSchema = new mongoose.Schema({
    title: String,
    body: String,
});

export interface Post {
    title: string;
    body: string;
}
