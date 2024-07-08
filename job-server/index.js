import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config({
    path : './.env'
})

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());    // next : add origin also
app.use(express.json({limit : '16kb'}))
app.use(express.urlencoded({extended:true, limit:'16kb'}))
app.use(express.static("public"))


app.get('/',(req,res)=>{
    res.send('Namaste World')
})
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})