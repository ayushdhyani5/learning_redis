import express from "express";
import Redis from "ioredis";

const app = express();


app.use(express.json());

const publisher = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.post("/notification" ,async (req,res)=>{
    const payload={
        title:req.body.title,
        description:req.body.description,
        createdAt:new Date().toISOString()
    }
    if (!payload.title || !payload.description){
        return res.status(400).json({ error: "Message is required" });
    }

    const receiver=await publisher.publish("notification",JSON.stringify(payload));
    res.status(200).json({message:"Notification sent successfully"});
});


app.listen('3000',()=>{
    console.log("Server is running on port 3000");
    
});