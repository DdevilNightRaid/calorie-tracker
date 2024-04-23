import mongoose  from 'mongoose';
const consumptionSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    userId: {
        type: String,
    },
    water: {
        type: Number,
    },
    consumedcalories : {
        type: Number,
    },
    burnedcalories : {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    trackedDate: {
        type: String,
    }
})

const Consumption = mongoose.models.Consumption || mongoose.model('Consumption', consumptionSchema);

export default Consumption;