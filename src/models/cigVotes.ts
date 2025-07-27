import mongoose from 'mongoose';
import generateUniqueId from '@/lib/uniqueID';

export const cigVoteSchema = new mongoose.Schema({
    id: { type: String, required: true, default: () => generateUniqueId() },
    noOfUpvotes: { type: Number, required: true, default: 0 },
    noOfDownvotes: { type: Number, required: true, default: 0 },
    userUp: { type: [String], required: true, default: [] },
    userDown: { type: [String], required: true, default: [] }
}, {
    timestamps: true 
});

const cigVotes = mongoose.models.cigVotes || mongoose.model('cigVotes', cigVoteSchema);
export default cigVotes;