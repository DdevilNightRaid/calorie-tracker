import mongoose  from 'mongoose';
const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: String,
    onboarded: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    consumption: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Consumption'
        }
    ],
    weight: {
        type: Number,
        required: true
    },
    streak: {
        type: Number,
    },
    hasPaid: {
        type: Boolean,
        default: false,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;