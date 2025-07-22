import mongoose from 'mongoose';

export const cigVoteSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    isUpvote: { type: Boolean, required: true },
    user: { type: String, required: true }
}, {
    timestamps: true 
});

const cigVotes = mongoose.models.cigVotes || mongoose.model('cigVotes', cigVoteSchema);
export default cigVotes;