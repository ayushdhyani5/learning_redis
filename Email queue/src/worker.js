import { Worker } from "bullmq";
import {redisConn} from "./queue"


const worker = new Worker("email", async (job) =>{
    console.log(`Job: ${job.id} : ${job.name}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("job completed");
    return {status:"completed"};
}, { 
    redisConn
});

worker.on("completed",(job)=>{
    console.log(`job ${job.id} completed`);
});
worker.on("failed",(job,error)=>{
    console.log(`job ${job.id} failed ${error}`);
});
worker.on("error",(error)=>{
    console.log(`job error ${error}`);
});

