import mongoose from 'mongoose';
import { cigCommentSchema } from './cigComments';
import { cigVoteSchema } from './cigVotes';
import generateUniqueId from '@/lib/uniqueID';

export const cigPostSchema = new mongoose.Schema({
    id: { type: String, required: true, default: () => generateUniqueId() },
    title: { type: String, required: true },
    body: { type: String, required: true },
    subCigaretteId: { type: String, required: true },
    comments: { type: [cigCommentSchema], required: true },
    user: { type: String, required: true },
    userEmail: { type: String, required: true },
    userImage: { type: String, required: true }, 
    votes: { type: cigVoteSchema, required: true },
    rating: { type: Number, required: true, default: 0 },
}, {
    timestamps: true 
});

const cigPosts = mongoose.models.cigPosts || mongoose.model('cigPosts', cigPostSchema);
export default cigPosts;