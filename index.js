import e from "express";
import { configDotenv } from "dotenv";
import connectDb from "./src/config/db.js";
import userRouter from "./src/routes/userRote.js";

configDotenv();

const app = e();

app.get('/',(req,res)=>{
    res.send("hello world")
})

const PORT = process.env.PORT || 5001;


connectDb();

app.use(e.json());
app.use('/api/users',userRouter)

app.listen(PORT,()=>{
    console.log(`server is running on post ${PORT}`)
})