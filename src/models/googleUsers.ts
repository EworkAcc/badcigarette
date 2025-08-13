import mongoose, { Schema, Document } from 'mongoose';

export interface IGoogleUser extends Document {
  googleId: string;
  email: string;
  name: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  ipVisits: Map<string, number>;
  reviewsBySubCigarette: Map<string, number>;
  commentsBySubCigarette: Map<string, number>;
  termsOfServiceAccepted: boolean;
  privacyPolicyAccepted: boolean;
  dataSellingConsent: boolean;
  consentDate: Date;
}

const GoogleUserSchema: Schema = new Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, default: null },
  ipVisits: { type: Map, of: Number, default: new Map() },
  reviewsBySubCigarette: { type: Map, of: Number, default: new Map() },
  commentsBySubCigarette: { type: Map, of: Number, default: new Map() },
  termsOfServiceAccepted: { type: Boolean, required: true, default: false },
  privacyPolicyAccepted: { type: Boolean, required: true, default: false },
  dataSellingConsent: { type: Boolean, required: true, default: false },
  consentDate: { type: Date, required: true, default: Date.now }
}, {
  timestamps: true
});

const GoogleUser = mongoose.models.GoogleUser || mongoose.model<IGoogleUser>('GoogleUser', GoogleUserSchema, 'googleUsers');
export { GoogleUser };
export default GoogleUser;