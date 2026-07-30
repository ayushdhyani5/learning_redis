import express from "express";
import {emailQueue} from "./queue.js";

const app = express();
app.use(express.json());

app.post("/send-email", async (req,res) => {
    const {to,subject,body} = req.body;
    const job = await emailQueue.add("send-welcome-email",
        {
            to:to,
            subject:subject||"no subject",
            body:body||"no body",
        },{
            attempts:3,
            backoff:{
                type:"exponential",
                delay:2000,
            }
        }
    );
    res.json({message:`Job added with id : ${job.id}`});
});
app.listen(3000,()=>{
    console.log("server started on port 3000");
});