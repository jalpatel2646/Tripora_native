import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  tripId: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  currency: string;
  category: string;
  date: Date;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
}

const ExpenseSchema: Schema = new Schema({
  tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, required: true, default: 'USD' },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  notes: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

ExpenseSchema.index({ tripId: 1, date: -1 });

export const Expense = mongoose.model<IExpense>('Expense', ExpenseSchema);
