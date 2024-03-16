import path from 'path';
import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js'
import userRoutes from './routes/user.routes.js'
import connectToMongoDB from './db/connectToMongoDB.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app, server } from './socket/socket.js'

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

dotenv.config();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json()); // to parse the requests with JSON payloads (from req.body)
app.use(cookieParser());

// app.get('/', (req, res) => {
//     // root route http://localhost:5000
//     res.send("Hello World!!");
// })

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes); 

app.use(express.static(path.join(__dirname, "/frontend/build")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

server.listen(5000, () => {
    connectToMongoDB();
    console.log(`Server running on PORT ${PORT}`);
})