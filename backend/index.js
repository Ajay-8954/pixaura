import express , { urlencoded} from "express";
import connectDB from "./utils/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import UserRoute from './routes/user.route.js';;
import postRoute  from './routes/post.route.js';
import messageRoute from './routes/message.route.js';
import { app, server } from "./socket/socket.js";
import path from 'path';

dotenv.config({});


const PORT= process.env.PORT || 3000;

const __dirname= path.resolve();



// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corOptions= {
    origin : 'http://localhost:5173',
    credentials: true
}

app.use(cookieParser());
app.use(cors(corOptions));

//yhn pr apni api
app.use("/api/v1/user", UserRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res)=>{
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
})




server.listen(PORT , ()=>{
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})