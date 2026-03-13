require('dotenv').config(); // Load environment variables first
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const Groq = require('groq-sdk');

// Initialize Express & Groq
const app = express();
app.use(cors());
app.use(express.json()); 
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

io.on('connection', (socket) => {
  console.log(`Frontend connected: ${socket.id}`);
  socket.on('disconnect', () => console.log(`Frontend disconnected: ${socket.id}`));
});

// ==========================================
// API Endpoint for Python Sensor 
// ==========================================
app.post('/api/alerts', async (req, res) => {
  try {
    const threatData = req.body;
    console.log("🚨 ALERT RECEIVED FROM PYTHON SENSOR 🚨", threatData);

    // 1. Ask Groq for a plain-English explanation
    const prompt = `
      You are a real-time cybersecurity assistant. 
      Analyze this network packet anomaly and explain the threat in 2 short, punchy sentences. 
      Make it easy for a human to understand.
      Data: ${JSON.stringify(threatData)}
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant', // Fast, open-source model perfect for real-time
    });

    const aiExplanation = chatCompletion.choices[0]?.message?.content || "Suspicious network activity detected.";
    
    // 2. Attach the AI explanation to the data
    const enrichedThreatData = {
      ...threatData,
      ai_insight: aiExplanation,
      timestamp: new Date()
    };

    console.log("🧠 Groq Insight:", aiExplanation);

    // TODO: Save enrichedThreatData to MongoDB

    // 3. Emit the threat to the React Dashboard
    io.emit('NEW_THREAT', enrichedThreatData); 

    res.status(200).json({ message: "Alert processed by Groq and broadcasted!" });

  } catch (error) {
    console.error("Error processing alert:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Nerve Center running on http://localhost:${PORT}`);
});