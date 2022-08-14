import { Channel, connect } from "amqplib";
import { config } from "dotenv";
import { Server } from "socket.io";
import CandleController from "../controllers/CandleController";
import * as http from "http";
import { Candle } from "../models/CandleModel";

config();

export default class CandleMessageChannel {
  private _channel: Channel;
  private _candleCtrl: CandleController;
  private _io: Server;

  constructor(server: http.Server) {
    this._candleCtrl = new CandleController();
    this._io = new Server(server, {
      cors: {
        origin: process.env.SOCKET_CLIENT_SERVER,
        methods: ["GET"],
      },
    });

    this._io.on("connection", () =>
      console.log("Web socket connection created")
    );

    this._createMessageChannel();
  }

  private async _createMessageChannel() {
    try {
      const connection = await connect(process.env.AMQP_SERVER);

      this._channel = await connection.createChannel();
      this._channel.assertQueue(process.env.QUEUE_NAME);
    } catch (err) {
      console.log("Connection to RabbitMQ failed");
      console.log(err);
    }
  }

  consumeMessages() {
    this._channel.consume(process.env.QUEUE_NAME, async msg => {
      const candleObj = JSON.parse(msg.content.toString());
      console.log("Message received");
      console.log(candleObj);

      // retirando mensagem da fila
      this._channel.ack(msg);

      const candle: Candle = candleObj;
      await this._candleCtrl.save(candle);
      console.log("Candle saved to database");

      // enviando para o frontend via web socket
      this._io.emit(process.env.SOCKET_EVENT_NAME, candle);
      console.log("New candle emited by web socket");
    });
    console.log("Candle consumer started");
  }
}
