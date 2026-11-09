import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILotteryResult extends Document {
  year: string;
  prize1: string[];
  prize2: string[];
  prize3: string[];
  prize4: string[];
  prize5: string[];
  prize6_suffix3: string;
  prize7_adjacent: string[];
  createdAt: Date;
}

const LotteryResultSchema: Schema<ILotteryResult> = new Schema({
  year: {
    type: String,
    required: true,
    default: '2570',
  },
  prize1: {
    type: [String],
    required: true,
    validate: [(val: string[]) => val.length === 2, 'รางวัลที่ 1 ต้องมี 2 รางวัล'],
  },
  prize2: {
    type: [String],
    required: true,
    validate: [(val: string[]) => val.length === 3, 'รางวัลที่ 2 ต้องมี 3 รางวัล'],
  },
  prize3: {
    type: [String],
    required: true,
    validate: [(val: string[]) => val.length === 3, 'รางวัลที่ 3 ต้องมี 3 รางวัล'],
  },
  prize4: {
    type: [String],
    required: true,
    validate: [(val: string[]) => val.length === 5, 'รางวัลที่ 4 ต้องมี 5 รางวัล'],
  },
  prize5: {
    type: [String],
    required: true,
    validate: [(val: string[]) => val.length === 10, 'รางวัลที่ 5 ต้องมี 10 รางวัล'],
  },
  prize6_suffix3: {
    type: String,
    required: true,
    match: [/^\d{3}$/, 'รางวัลเลขท้าย 3 ตัว ต้องเป็นตัวเลข 3 หลัก'],
  },
  prize7_adjacent: {
    type: [String],
    required: true,
    validate: [(val: string[]) => val.length === 4, 'รางวัลข้างเคียงรางวัลที่ 1 ต้องมี 4 รางวัล'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const LotteryResult: Model<ILotteryResult> =
  mongoose.models.LotteryResult ||
  mongoose.model<ILotteryResult>('LotteryResult', LotteryResultSchema);

