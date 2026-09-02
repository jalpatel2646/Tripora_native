import mongoose, { Document } from 'mongoose';
export interface ITrip extends Document {
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    coverPhoto?: string;
    budget?: number;
    owner: mongoose.Types.ObjectId;
    companions: {
        userId: mongoose.Types.ObjectId;
        role: 'OWNER' | 'COMPANION' | 'VIEWER';
    }[];
    stops: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const Trip: mongoose.Model<ITrip, {}, {}, {}, Document<unknown, {}, ITrip, {}, mongoose.DefaultSchemaOptions> & ITrip & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ITrip>;
//# sourceMappingURL=Trip.d.ts.map