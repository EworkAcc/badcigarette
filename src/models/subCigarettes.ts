import mongoose from 'mongoose';
import cigPosts from './cigPosts';

const subCigarette = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    id: { type: String, required: true, unique: true },
    posts: { type: [String], required: true },
    description: { type: String, required: true }, 
}, {
    timestamps: true
});

const subCigarettes = mongoose.models.subCigarettes || mongoose.model('subCigarettes', subCigarette);
export default subCigarettes;