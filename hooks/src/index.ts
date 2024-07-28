import express from "express";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const app = express();
app.use(express.json());

app.post("/hooks/catch/:userId/:zapId",async(req,res)=>{
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;

    console.log("Reached Here");
    
    // Store a DB in new trigger 

    await client.$transaction(async tx=>{
        console.log("Reached Here 2");
        
       const run =  await client.zapRun.create({
            data: {
                zapId:zapId,
                metadata:body
            }
            
        });
        console.log("Reached Here 3");
        await client.zapRunOutbox.create({
             data:{
                zapRunId : run.id
             }
        })
    })

    res.json({
        message:"Webhooks Received"
    })

    // Push into A queue in  Kafka / Redis 
})

app.listen(3000);