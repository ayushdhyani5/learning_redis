import {Queue} from "bullmq";

const redisConn = {
    host:"localhost",
    port:6379,
};
const emailQueue=new Queue('email',{redisConn});

module.exports={
    emailQueue,
    redisConn
};