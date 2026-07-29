import express from "express";
import Redis from "ioredis";

const app=express();
app.use(express.json());

const redis=new Redis(process.env.REDIS_URL || "redis://localhost:6379");

function otpkey(phone){
    return `otp:${phone}`;
}   

app.post("/otp",async (req,res) => {
    const {phone}=req.body;
    const otp = Math.floor(1000+Math.random()*9000).toString();
    await redis.set(otpkey(phone),otp,'EX',30);
    return res.json({success:true,otp:otp});
    
});

app.get("/otp/verify",async(req,res)=>{
    const {phone,otp} = req.body;
    const storedOtp = await redis.get(otpkey(phone));
    if(!storedOtp){
        return res.status(400).json({
            message:"otp expired or not found"
        })
    }
    if(storedOtp!==otp){
        return res.status(400).json({
            message:"invalid otp"
        });
    }
    // validate user from db at this line
    await redis.del(otpkey(phone));
    return res.json({success:true,message:"user validated"});
});

app.get("/otp/:phone/ttl",async(req,res)=>{
    const {phone}=req.params;
    const ttl= await redis.ttl(otpkey(phone));
    
    return res.json({ttl:ttl});
})


app.listen(3000,()=>{
    console.log("server started");
})
