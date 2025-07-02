import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
}, {
    timestamps: true
});

// Prevent re-compilation in development
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
