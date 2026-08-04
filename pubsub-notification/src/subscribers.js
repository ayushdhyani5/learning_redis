import Redis from "ioredis";

const subscriber = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

subscriber.subscribe("notification",(err)=>{
    if(err){
        throw err;
    }
    console.log("Subscribed to channel: notification");
});


subscriber.on('message',(channel,message)=>{
    console.log("Recived message on channel :"+channel+" with message:"+JSON.parse(message));
    
});