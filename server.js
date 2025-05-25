require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public")); // để phục vụ HTML tĩnh

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY, // Key dạng sk-or-xxxx
    baseURL: "https://openrouter.ai/api/v1",
});

app.post("/generate-title", async (req, res) => {
    const { topic } = req.body;

    try {
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: `Viết tiêu đề blog hấp dẫn về chủ đề: ${topic}` }],
        });

        const generatedTitle = chatCompletion.choices[0].message.content;
        res.json({ title: generatedTitle.trim() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi tạo tiêu đề" });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server đang chạy tại: http://localhost:${PORT}`);
});
