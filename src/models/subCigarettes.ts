import mongoose from 'mongoose';
import { cigPostSchema } from './cigPosts';
import generateUniqueId from '@/lib/uniqueID';

export const subCigaretteSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    id: { type: String, required: true, default: () => generateUniqueId() },
    posts: { type: [cigPostSchema], required: true },
    description: { type: String, required: true }, 
    rating: { type: Number, required: true, default: 0 },
    noOfReviews: { type: Number, required: true, default: 0 },
    type: { type: String, required: true, default: "r"} /* r=regular l=light ul=ultralight m=menthol */
}, {
    timestamps: true
});

const subCigarettes = mongoose.models.subCigarettes || mongoose.model('subCigarettes', subCigaretteSchema);
export default subCigarettes;