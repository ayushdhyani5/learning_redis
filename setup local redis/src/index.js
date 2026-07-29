import express from "express";
import mongoose from "mongoose";
import Redis from "ioredis";

const app=express();
export const redis=new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.get("/redis",async (req,res)=>{
    const reply =await redis.ping();
    res.json({redis:reply});
})
app.get("/mongodb",async (req,res)=>{
    const url = process.env.MONGO_URI || 'mongodb://localhost:27017/learning_redis';
    if(mongoose.connection.readyState == 0){
        await mongoose.connect(url);
    }
    res.json({mongodb: "connected", database: mongoose.connection.name});
})


app.listen(process.env.PORT || 3000,()=>{
    console.log("server started ");
})

