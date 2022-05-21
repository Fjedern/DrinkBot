// Dependencies
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 80;
const url = "https://api.telegram.org/bot";
const apiToken = process.env.TELEGRAM_BOT_TOKEN;

// Configurations
app.use(bodyParser.json());

// Endpoints
app.post("/", (req, res) => {
  console.log(req.body);

	if(req.body.message === "undefined"){
		return;
	}
  const chatId = req.body.message.chat.id;
  const sentMessage = req.body.message.text;

  console.log("Chatid: " + chatId + "\n sentMessage: " + sentMessage);

  //Regex for hello
  if (parseInt(chatId) > 1 && req.body.message !== "undefined") {
    if (sentMessage.match(/hello/gi)) {
      axios
        .post(`${url}${apiToken}/sendMessage`, {
          chat_id: chatId,
          text: "hello back 👋",
        })
        .then((response) => {
          res.status(200).send(response);
        })
        .catch((error) => {
          res.send(error);
        });
    } else {
      // if no hello present, just respond with 200
      res.status(200).send({});
    }
  }

  if (sentMessage.match(/fis/gi)) {
    sendMessage(chatId, "ananas");
  }
});

async function sendMessage(chatId, message) {
  axios.post(`${url}${apiToken}/sendMessage`, {
    chat_id: chatId,
    text: message,
  });
}

// Listening
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
