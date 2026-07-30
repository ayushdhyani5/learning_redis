import express from "express";
import Redis from "ioredis";

const app=express();
app.use(express.json());

const redis=new Redis(process.env.REDIS_URL || "redis://localhost:6379");
 

const QUEUE_KEY='queue:email';

app.post("/emails",async(req,res)=>{
    const job={
        to:req.body.to,
        subject:req.body.subject|| 'no subject',
        body:req.body.body|| 'No content',
        createdAt:new Date().toISOString(),
        
    }
    await redis.lpush(QUEUE_KEY,JSON.stringify(job));
    return res.json({message:"job added to queue"});
})

app.get("/emails/process-one",async(req,res)=>{
    const rawJob=await redis.rpop(QUEUE_KEY);
    if(!rawJob){
        return res.status(404).json({message:"no jobs in queue"});
    }
    const job=JSON.parse(rawJob);
    res.json({
        email:"email sent to",
        job:job
    })
})

app.get("/queue/count",async(req,res)=>{
    const count=await redis.llen(QUEUE_KEY);
    return res.json({count:count});
})  


app.listen(3000,()=>{
    console.log("server is running on http://localhost:3000");
})