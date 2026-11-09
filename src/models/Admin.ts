import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdmin extends Document {
  username: string;
  password: string;
}

const AdminSchema: Schema<IAdmin> = new Schema(
  {
    username: {
      type: String,
      required: [true, 'กรุณาระบุชื่อผู้ใช้งาน'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'กรุณาระบุรหัสผ่าน'],
    },
  },
  { timestamps: true }
);

export const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

