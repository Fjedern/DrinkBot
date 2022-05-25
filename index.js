// Dependencies
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

import { getRandomDrink, getDrinkByName } from "./api/drinkApi.js";
import {
  sendMessage,
  sendImage,
  editMessageReplyMarkup,
} from "./api/telegramBot.js";

const app = express();
const port = 80;

const url = "https://api.telegram.org/bot";
const apiToken = process.env.TELEGRAM_BOT_TOKEN;

// Configurations
app.use(bodyParser.json());

var keyboards = {
  help_menu: {
    keyboard: [
      [
        { text: "/randomdrink" },
        { text: "/drink mojito" },
        { text: "Saved ❤️" },
      ],
      [{ text: "/help" }, { text: "WIP" }],
    ],
  },
  like_menu: {
    inline_keyboard: [
      [
        { text: "❤️", callback_data: "save" },
        { text: "👎🏻", callback_data: "dislike" },
      ],
      [{ text: "Info", callback_data: "test" }],
    ],
  },
};

let chatId;
let sentMessage;
let replyData;
let likes = 0;
let messageId;
let replyMarkupHasBeenSent = false;

// Endpoints
app.post("/", (req, res) => {
  console.log(req.body);

  if (req.body.callback_query !== undefined) {
    replyMarkupHasBeenSent = true;
    replyData = req.body.callback_query.data;
    messageId = req.body.callback_query.message.message_id;
  }

  if (replyData === "save" && replyMarkupHasBeenSent) {
    likes++;
    console.log("LIKES: " + likes);
    editMessageReplyMarkup(chatId, messageId);
  }
  if (req.body.message !== undefined && req.body.callback_query === undefined) {
    chatId = req.body.message.chat.id;
    sentMessage = req.body.message.text;
  }

  console.log("DATA:" + replyData);

  //Regex for hello
  if (req.body.message !== "undefined") {
    if (/hello/gi.test(sentMessage)) {
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

  if (/fis/gi.test(sentMessage)) {
    sendMessage(chatId, "ananas");
  }

  if (/\/help/.test(sentMessage)) {
    // const helpString = "Available commands: \n/randomdrink\n/drink mojito";
    sendMessage(chatId, "Available commands:", keyboards.help_menu);
  }

  if (/\/randomdrink/.test(sentMessage)) {
    getRandomDrink().then(function (result) {
      const drink = result.drinks[0];
      const drinkImage = drink.strDrinkThumb;

      const captionText = makeDrinkString(drink);
      sendImage(chatId, drinkImage, captionText, keyboards.like_menu);
    });
  }

  if (/\/drink/.test(sentMessage)) {
    var myRegexp = new RegExp(/\/drink (.+)/);
    var match = myRegexp.exec(sentMessage);

    getDrinkByName(match[1]).then(function (result) {
      if (result.drink !== null) {
        const drink = result.drinks[0];
        const drinkImage = drink.strDrinkThumb;

        const captionText = makeDrinkString(drink);
        sendImage(chatId, drinkImage, captionText);
      } else {
        sendMessage(chatId, "No such drink");
      }
    });

    sendMessage(chatId, "you searched for: " + match[1]);
  }
});

function makeDrinkString(drink) {
  const drinkName = drink.strDrink;

  var ingredients = [];
  var measurements = [];

  for (var i = 1; i <= 15; i++) {
    let currentIngredient = eval(`drink.strIngredient${i}`);
    let currentMeasurement = eval(`drink.strMeasure${i}`);
    if (currentIngredient !== null) {
      currentIngredient = currentIngredient.replaceAll("-", "\\-");
      ingredients.push(currentIngredient);
    }
    if (currentMeasurement !== null) {
      currentMeasurement = currentMeasurement.replaceAll("-", "\\-");
      measurements.push(currentMeasurement);
    }
  }
  let measurmentsAndIngredients = "";
  ingredients.forEach(function (ingredient, index) {
    if (measurements[index] !== undefined) {
      measurmentsAndIngredients +=
        measurements[index] + " " + ingredient + "\n";
    } else {
      measurmentsAndIngredients += ingredient + "\n";
    }
  });
  let instructions = drink.strInstructions;
  instructions = instructions
    .replaceAll(".", "\\.")
    .replaceAll(",", "\\,")
    .replaceAll("-", "\\-")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)")
    .replaceAll("!", "\\!")
    .replaceAll("?", "\\?");
  let drinkString =
    `*${drinkName}*\n\n` + measurmentsAndIngredients + "\n" + instructions;

  return drinkString;
}

// Listening
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
