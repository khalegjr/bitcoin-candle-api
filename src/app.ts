import * as express from "express";
import * as logger from "morgan";
import * as cors from "cors";

export const app = express();
app.use(cors()); // para liberar o acesso geral
app.use(express.json()); // para receber e devolver as requisições em json
app.use(logger("dev")); // um log com um pouco mais de detalhes
