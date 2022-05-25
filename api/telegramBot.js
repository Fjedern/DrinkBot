import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const url = "https://api.telegram.org/bot";
const apiToken = process.env.TELEGRAM_BOT_TOKEN;

export async function sendMessage(chatId, message, keyboard) {
  axios
    .post(`${url}${apiToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      reply_markup: keyboard,
    });
}

export async function sendImage(chatId, message, captionText, keyboard) {
  axios.post(`${url}${apiToken}/sendphoto`, {
    chat_id: chatId,
    photo: message,
    caption: captionText,
    parse_mode: "MarkdownV2",
    reply_markup: keyboard,
    one_time_keyboard: "True"
  });
}

export async function editMessageReplyMarkup(chatId, messageId) {
  axios
    .post(`${url}${apiToken}/editMessageReplyMarkup`, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: {}
    });
}


