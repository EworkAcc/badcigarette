import mongoose from 'mongoose';

const defaultPNG = '../../public/defaultPFP.png';

const userSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  country: { type: String, required: true },
  image: { type: String, default: defaultPNG, required: true },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  emailVerificationExpires: { type: Date },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  ipVisits: { type: Map, of: Number, default: new Map() },
  reviewsBySubCigarette: { type: Map, of: Number, default: new Map() },
  commentsBySubCigarette: { type: Map,of: Number, default: new Map() },
  termsOfServiceAccepted: { type: Boolean, required: true, default: false },
  privacyPolicyAccepted: { type: Boolean, required: true, default: false },
  dataSellingConsent: { type: Boolean, required: true, default: false },
  consentDate: { type: Date, required: true, default: Date.now }
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;