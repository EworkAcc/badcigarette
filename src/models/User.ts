import mongoose from 'mongoose';

const defaultPNG = '../../public/defaultPFP.png';
const userSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    image: { type: String, default: defaultPNG, required: true },
}, {
    timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
