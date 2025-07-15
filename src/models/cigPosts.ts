import mongoose from 'mongoose';
import cigComments from './cigComments';
import cigVotes from './cigVotes';

const cigPost = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    subCigaretteId: { type: String, required: true },
    comments: { type: [String]},
    user: { type: String, required: true },
    votes: { type: String, required: true }
}, {
    timestamps: true 
});

const cigPosts = mongoose.models.cigPosts || mongoose.model('cigPosts', cigPost);
export default cigPosts;