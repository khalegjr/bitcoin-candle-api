import { model, Document, Schema } from "mongoose";

export interface Candle extends Document {
  currency: string;
  finalDateTime: Date;
  open: number;
  close: number;
  high: number;
  low: number;
  color: string;
}

const schema = new Schema<Candle>({
  currency: { type: String, require: true },
  finalDateTime: { type: Date, require: true },
  open: { type: Number, require: true },
  close: { type: Number, require: true },
  high: { type: Number, require: true },
  low: { type: Number, require: true },
  color: { type: String, require: true },
});

export const CandleModel = model<Candle>("Candle", schema);
