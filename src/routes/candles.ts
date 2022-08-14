import CandleController from "../controllers/CandleController";
import { Request, Response, Router } from "express";

export const candleRouter = Router();
const candleCtrl = new CandleController();

candleRouter.get("/:quantity", async (req: Request, res: Response) => {
  const quantity = parseInt(req.params.quantity);
  const lastCandles = await candleCtrl.findLastCandles(quantity);

  return res.json(lastCandles);
});
