import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";

const url =
  "https://script.google.com/macros/s/AKfycbxDITI30ye__w14324pEGY7SyFXkvcN8uKSmlyJ55ZwWKZR0hxEsNwTn7402PKr73pe/exec";

// replace the value below with the Telegram token you receive from @BotFather
const token = "5302243785:AAGD-zEZXZ_R1V8ESSasTO8JVXUHqPRvKYQ";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/help/, (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Available commands: \n/randomDrink\n/drink mojito");
});

bot.onText(/\/randomDrink/, (msg, match) => {
  const chatId = msg.chat.id;
  getRandomDrink().then(function (result) {
    bot.sendMessage(chatId, result.drinks[0].strDrink);
    sendTelegramPhotoToSameChat(chatId, result.drinks[0].strDrinkThumb);
  });
});

bot.onText(/\/drink (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const drinkName = match[1];

  getDrinkByName(drinkName).then(function (result) {
    if (result.drinks !== null) {
      const firstDrink = result.drinks[0];
      bot.sendMessage(chatId, firstDrink.strDrink);
      sendTelegramPhotoToSameChat(chatId, firstDrink.strDrinkThumb);
      bot.sendMessage(chatId, firstDrink.strInstructions);
      for (var i = 1; i <= 15; i++) {
        if (eval(`firstDrink.strIngredient${i}`) !== null) {
          bot.sendMessage(chatId, eval(`firstDrink.strMeasure${i}`) + eval(`firstDrink.strIngredient${i}`));
        }
        
      }
    } else {
      bot.sendMessage(chatId, "No such drink");
    }
  });
});

function sendTelegramPhoto(image) {
  bot.sendPhoto(697477873, image);
}

function sendTelegramPhotoToSameChat(chatId, image) {
  bot.sendPhoto(chatId, image);
}

async function getRandomDrink() {
  const response = await fetch(
    "https://www.thecocktaildb.com/api/json/v1/1/random.php"
  );
  const data = await response.json();
  return data;
}

async function getDrinkByName(drinkName) {
  const response = await fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinkName}`
  );
  const data = await response.json();
  return data;
}
