import mongoose from 'mongoose';
export declare const Trip: mongoose.Model<{
    name: string;
    description?: string | null;
    startDate: NativeDate;
    endDate: NativeDate;
    coverImage?: string | null;
    stops: mongoose.Types.DocumentArray<{
        cityName?: string | null;
        country?: string | null;
        startDate?: NativeDate | null;
        endDate?: NativeDate | null;
        activities: string[];
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        cityName?: string | null;
        country?: string | null;
        startDate?: NativeDate | null;
        endDate?: NativeDate | null;
        activities: string[];
    }, {}, {}> & {
        cityName?: string | null;
        country?: string | null;
        startDate?: NativeDate | null;
        endDate?: NativeDate | null;
        activities: string[];
    }>;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    description?: string | null;
    startDate: NativeDate;
    endDate: NativeDate;
    coverImage?: string | null;
    stops: mongoose.Types.DocumentArray<{
        cityName?: string | null;
        country?: string | null;
        startDate?: NativeDate | null;
        endDate?: NativeDate | null;
        activities: string[];
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        cityName?: string | null;
        country?: string | null;
        startDate?: NativeDate | null;
        endDate?: NativeDate | null;
        activities: string[];
    }, {}, {}> & {
        cityName?: string | null;
        country?: string | null;
        startDate?: NativeDate | null;
        endDate?: NativeDate | null;
        activities: string[];
    }>;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    name: string;
    description?: string | null;
    startDate: NativeDate;
    endDate: NativeDate;
    coverImage?: string | null;
    stops: mongoose.Types.DocumentArray<{
        cityName?: string | null;
        country?: string | null;
        startDate?: NativeDate | null;
        endDate?: NativeDate | null;
        activities: string[];
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        cityName?: string | null;
        country?: string | null;
        startDate?: NativeDate | null;
        endDate?: NativeDate | null;
        activities: string[];
    }, {}, {}> & {
        cityName?: string | null;
        country?: string | null;
        startDate?: NativeDate | null;
        endDate?: NativeDate | null;
        activities: string[];
    }>;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    description?: string | null;
    startDate: NativeDate;
    endDate: NativeDate;
    coverImage?: string | null;
    stops: mongoose.Types.DocumentArray<{
        cityName?: string | null;
        country?: string | null;
        startDate?: NativeDate | null;
        endDate?: NativeDate | null;
        activities: string[];
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        cityName?: string | null;
        country?: string | null;
        startDate?: NativeDate | null;
        endDate?: NativeDate | null;
        activities: string[];
    }, {}, {}> & {
        cityName?: string | null;
        country?: string | null;
        startDate?: NativeDate | null;
        endDate?: NativeDate | null;
        activities: string[];
    }>;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    description?: string | null;
    startDate: NativeDate;
    endDate: NativeDate;
    coverImage?: string | null;
    stops: mongoose.Types.DocumentArray<{
        cityName?: string | null;
        country?: string | null;
        startDate?: NativeDate | null;
        endDate?: NativeDate | null;
        activities: string[];
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        cityName?: string | null;
        country?: string | null;
        startDate?: NativeDate | null;
        endDate?: NativeDate | null;
        activities: string[];
    }, {}, {}> & {
        cityName?: string | null;
        country?: string | null;
        startDate?: NativeDate | null;
        endDate?: NativeDate | null;
        activities: string[];
    }>;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    name: string;
    description?: string | null;
    startDate: NativeDate;
    endDate: NativeDate;
    coverImage?: string | null;
    stops: mongoose.Types.DocumentArray<{
        cityName?: string | null;
        country?: string | null;
        startDate?: NativeDate | null;
        endDate?: NativeDate | null;
        activities: string[];
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        cityName?: string | null;
        country?: string | null;
        startDate?: NativeDate | null;
        endDate?: NativeDate | null;
        activities: string[];
    }, {}, {}> & {
        cityName?: string | null;
        country?: string | null;
        startDate?: NativeDate | null;
        endDate?: NativeDate | null;
        activities: string[];
    }>;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    name: string;
    description?: string | null;
    startDate: NativeDate;
    endDate: NativeDate;
    coverImage?: string | null;
    stops: mongoose.Types.DocumentArray<{
        cityName?: string | null;
        country?: string | null;
        startDate?: NativeDate | null;
        endDate?: NativeDate | null;
        activities: string[];
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        cityName?: string | null;
        country?: string | null;
        startDate?: NativeDate | null;
        endDate?: NativeDate | null;
        activities: string[];
    }, {}, {}> & {
        cityName?: string | null;
        country?: string | null;
        startDate?: NativeDate | null;
        endDate?: NativeDate | null;
        activities: string[];
    }>;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    name: string;
    description?: string | null;
    startDate: NativeDate;
    endDate: NativeDate;
    coverImage?: string | null;
    stops: mongoose.Types.DocumentArray<{
        cityName?: string | null;
        country?: string | null;
        startDate?: NativeDate | null;
        endDate?: NativeDate | null;
        activities: string[];
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        cityName?: string | null;
        country?: string | null;
        startDate?: NativeDate | null;
        endDate?: NativeDate | null;
        activities: string[];
    }, {}, {}> & {
        cityName?: string | null;
        country?: string | null;
        startDate?: NativeDate | null;
        endDate?: NativeDate | null;
        activities: string[];
    }>;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Trip.d.ts.map