import express from "express";
import Redis from "ioredis";

const app=express();
app.use(express.json());

const redis=new Redis(process.env.REDIS_URL || "redis://localhost:6379")



app.post("/user/:id/json",async (req,res) => {
    const {id}=req.params;
    const body = req.body;
    await redis.set(`user:${id}:json`,JSON.stringify(body));
    res.json({savedAs:"json"});
})

app.get("/user/:id/json",async(req,res)=>{
    const {id}=req.params;
    const data = await redis.get(`user:${id}:json`);
    return res.json({user: data?JSON.parse(data):{message:"user not found"}});
})

app.post("/user:id/hash",async(req,res)=>{
    const {id}=req.params;
    const body=req.body;
    await redis.hset(`user:${id}:hash`,body);
    res.json({savedAs:"hash"});
})

app.get("/user/:id/hash",async(req,res)=>{
    const {id}=req.params;
    const data = await redis.hgetall(`user:${id}:hash`);
    return res.json({user: data? data :{message:"user not found"}});
})

app.listen(3000,()=>{
    console.log("server is running on http://localhost:3000");
})