import express from "express";
import Redis from "ioredis";

const app=express();

app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const BANNER_KEY="app:banners";

app.post("/banner",async (req,res) => {
    const message = req.body.message || "Welcome to our site";
    await redis.set(BANNER_KEY,message);    
    res.json({success:true,message:message,banner:BANNER_KEY});
});

app.get("/banner",async (req,res)=>{
    const data = await redis.get(BANNER_KEY);
    return res.json({message: "no banner is currently active"});
});

app.delete("/banner",async(req,res)=>{
    await redis.del(BANNER_KEY);
    res.json({success:true});
})

app.get("/banner/exists",async(req,res)=>{
    const exist=await redis.exists(BANNER_KEY);
    if(exist){
        return res.json({message: "banner is present" ,exist:exist});
    }
    return res.json({message: "no banner is present",exist:exist})``;
});

app.listen(3000,()=>{
    console.log("server is running");
})
