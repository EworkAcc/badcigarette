import mongoose from 'mongoose';
import { cigVoteSchema } from './cigVotes';
import generateUniqueId from '@/lib/uniqueID';

export const cigCommentSchema = new mongoose.Schema({
    id: { type: String, required: true, default: () => generateUniqueId() },
    body: { type: String, required: true },
    user: { type: String, required: true },
    postId: { type: String, required: true },
    votes: { type: cigVoteSchema, required: true },
    rating: { type: Number, required: true, default: 0 }
}, {
    timestamps: true 
});

const cigComments = mongoose.models.cigComments || mongoose.model('cigComments', cigCommentSchema);
export default cigComments;