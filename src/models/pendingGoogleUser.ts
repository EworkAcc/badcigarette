import mongoose, { Schema, Document } from 'mongoose';

export interface IPendingGoogleUser extends Document {
  email: string;
  userData: {
    googleId: string;
    email: string;
    name: string;
    image?: string;
  };
  expiresAt: Date;
  createdAt: Date;
}

const PendingGoogleUserSchema: Schema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  userData: {
    googleId: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String }
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

PendingGoogleUserSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PendingGoogleUser = mongoose.models.PendingGoogleUser || mongoose.model<IPendingGoogleUser>('PendingGoogleUser', PendingGoogleUserSchema);

export default PendingGoogleUser;