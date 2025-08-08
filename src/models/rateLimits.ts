import mongoose from 'mongoose';

export interface IRateLimit extends mongoose.Document {
  userId: string;
  userEmail: string;
  type: 'post' | 'comment';
  subCigaretteId?: string; 
  lastAction: Date;
  actionCount: number;
  firstCommentCigarettes: string[]; 
  createdAt: Date;
  updatedAt: Date;
}

const rateLimitSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  type: { type: String, required: true, enum: ['post', 'comment'] },
  subCigaretteId: { type: String },
  lastAction: { type: Date, required: true },
  actionCount: { type: Number, default: 1 },
  firstCommentCigarettes: [{ type: String }], 
}, {
  timestamps: true
});

rateLimitSchema.index({ userId: 1, type: 1, subCigaretteId: 1 });
rateLimitSchema.index({ userId: 1, type: 1 });
rateLimitSchema.index({ lastAction: 1 });

const RateLimit = mongoose.models.RateLimit || mongoose.model<IRateLimit>('RateLimit', rateLimitSchema);

export { RateLimit };
export default RateLimit;