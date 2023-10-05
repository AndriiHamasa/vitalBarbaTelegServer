import express from "express"
import fetch from "node-fetch"
import "dotenv/config"
import logger from "morgan";
import cors from "cors";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

// Обработка POST-запросов
app.post('/send-message', async (req, res) => {
  try {
    console.log('req.body ==>> ', req.body )
    // const { name, number } = req.body;
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    // if (!name || !number) {
    //   return res.status(400).json({ error: 'Name and number are required fields' });
    // }

    const textArr = []

    for (const key in req.body) {
      if (Object.hasOwnProperty.call(req.body, key)) {
        const element = req.body[key];

        textArr.push(`${key}: ${element}, `)
        
      }
    }

    // Отправляем сообщение в Telegram
    const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: telegramChatId, text: `${textArr.join("\n")}` }),
    });

    const data = await response.json();
    if (data.ok) {
      return res.json({ message: 'Message sent successfully' });
    } else {
      return res.status(500).json({ error: 'Failed to send message to Telegram' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


