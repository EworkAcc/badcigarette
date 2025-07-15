import mongoose, { Schema, Document } from 'mongoose';

export interface IGoogleUser extends Document {
  googleId: string;
  email: string;
  name: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GoogleUserSchema: Schema = new Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

const GoogleUser = mongoose.models.GoogleUser || mongoose.model<IGoogleUser>('GoogleUser', GoogleUserSchema, 'googleUsers');

export { GoogleUser };
export default GoogleUser;