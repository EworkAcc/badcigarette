import mongoose from 'mongoose';

const cigVote = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    isUpvote: { type: Boolean, required: true },
    user: { type: String, required: true },
    postId: { type: String, required: true },
    commentId: { type: String, required: true } 
}, {
    timestamps: true 
});

const cigVotes = mongoose.models.cigVotes || mongoose.model('cigVotes', cigVote);
export default cigVotes;