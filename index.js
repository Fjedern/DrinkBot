// Dependencies
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";

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

  let chatId;
  let sentMessage;
  if (req.body.message !== undefined) {
    chatId = req.body.message.chat.id;
    sentMessage = req.body.message.text;
  }

  console.log("Chatid: " + chatId + "\n sentMessage: " + sentMessage);

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

  if (/\/randomdrink/.test(sentMessage)) {
    getRandomDrink().then(function (result) {
      const drink = result.drinks[0];
      const drinkName = drink.strDrink;
      const drinkImage = drink.strDrinkThumb;

      var ingredients = [];
      var measurements = [];

      for (var i = 1; i <= 15; i++) {
        let currentIngredient = eval(`drink.strIngredient${i}`);
        let currentMeasurement = eval(`drink.strMeasure${i}`);
        if (currentIngredient !== null) {
          ingredients.push(currentIngredient);
        }
        if (currentMeasurement !== null) {
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
        .replaceAll(")", "\\)");
      const captionText =
        `*${drinkName}*\n\n` + measurmentsAndIngredients + instructions;
      sendImage(chatId, drinkImage, captionText, ingredients, measurements);
    });
  }

  if (/\/drink/.test(sentMessage)) {
    var myRegexp = new RegExp(/\/drink (.+)/);
    var match = myRegexp.exec(sentMessage);

    sendMessage(chatId, "you searched for: " + match[1]);
  }
});

function makeDrinkString(drink){
  
}

async function sendMessage(chatId, message) {
  axios.post(`${url}${apiToken}/sendMessage`, {
    chat_id: chatId,
    text: message,
  });
}

async function sendImage(
  chatId,
  message,
  captionText,
  ingredients,
  measurements
) {
  axios.post(`${url}${apiToken}/sendphoto`, {
    chat_id: chatId,
    photo: message,
    caption: captionText,
    parse_mode: "MarkdownV2",
  });
}

// Listening
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

async function getRandomDrink() {
  const response = await fetch(
    "https://www.thecocktaildb.com/api/json/v1/1/random.php"
  );
  const data = await response.json();
  return data;
}
