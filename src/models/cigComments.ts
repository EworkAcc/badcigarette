import mongoose from 'mongoose';
import cigVotes from './cigVotes';

const cigComment = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    body: { type: String, required: true },
    user: { type: String, required: true },
    postId: { type: String, required: true },
    votes: { type: String, required: true }
}, {
    timestamps: true 
});

const cigComments = mongoose.models.cigComments || mongoose.model('cigComments', cigComment);
export default cigComments;