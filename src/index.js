import { exec, queryRow } from "./db/mysql";
import request from 'request';
import {scheduler} from './schedule'
const date = require('date-and-time')


const express = require('express');
export const app = express();
app.use(express.json());
const port = 5000;


app.post("/timer",async (req,res) => {
    console.log("post request")
    let { id,channel,token,url,delay,payload } = req.body;
    //console.log(req.body)
    try{
        await exec(`
        INSERT INTO scheduler_chenyunda218 
        (id,channel,token,url,payload,action_time) VALUE 
        (?,?,?,?,?,DATE_ADD(NOW(), INTERVAL ? SECOND))`,
        [id,channel,token,url,JSON.stringify(payload),delay])
    }catch(err){
        if(err.errno == 1062) {
            console.log("duplicated")//原本的資料會被覆蓋掉 可是資料庫還有資料
            res.send(200)
          } else {
            res.status(500)
          }
    }
      res.send()
      scheduler(req.body)
})

app.post("/test",async (req,res) => {
    console.log("收到回傳資料")
    //console.log(req.body)
    //var id = req.body['id']
    //res.setHeader("Content-Type", "application/text");
    //res.json(id)
    res.send(200);
})

app.get('/',  function(req, res) {
    res.send(200);
});
/*
app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`)
});*/