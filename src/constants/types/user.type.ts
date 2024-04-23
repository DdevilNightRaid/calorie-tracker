export type UserData = {
    _id: string;
    id: string;
    __v?: number;
    username: string;
    email: string;
    name: string;
    image: string;
    onboarded: boolean;
    isVerified: boolean;
    consumption: string[];
    weight: string;
    streak: number,
    hasPaid: boolean;
}
export type UserConsumptionData = {
    id: string;
    userId: string;
    water: number;
    consumedcalories: number;
    burnedcalories: number;
    trackedDate: number;
}
