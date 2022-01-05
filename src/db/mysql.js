import mysql from 'mysql-await';
import config from '../../config/config.js';
import { scheduler } from '../schedule.js';
let mysqlConfig = config.mysql;
mysqlConfig.supportBigNumbers = true;
mysqlConfig.bigNumberStrings = true;
export const pool = mysql.createPool(config.mysql);

export async function queryRow(query, args) {
  let result = await pool.awaitQuery(query, args);
  if (result.length > 0) {
    return result[0];
  } else {
    return null;
  }
}

export async function queryMany(query, args) {
  let results = await pool.awaitQuery(query, args);
  return results;
}


export async function exec(query, args) {
   await pool.awaitQuery(query, args);
}

export  function init() {
  console.log("start init")
  return new Promise((resolve,reject)=>{
    pool.getConnection((err, conn)=>{
      if(err){
        reject(err)
      }else{
        console.log("connectQuery")
        connQuery(conn,`
        CREATE TABLE IF NOT EXISTS scheduler_chenyunda218
        (
        id BIGINT NOT NULL,
        channel CHAR(32) NOT NULL,
        payload JSON,
        url VARCHAR(512) NOT NULL,
        creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        action_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        token VARCHAR(512) NOT NULL,
        PRIMARY KEY(channel,id)
        )CHARSET=utf8,ENGINE=InnoDB;
        `)
        .then(()=>{
          console.log("connectSearch")
          return connSearch(conn,`SELECT id,payload,url,channel,token, TIMESTAMPDIFF(SECOND,  NOW(), action_time) AS delay 
          FROM scheduler_chenyunda218`)
        })
        .then((results)=>{
          console.log(results)
          results = results.map((i)=> {
            let o  = {
              ...i, payload: JSON.parse(i.payload)
            }
            return o
          })
          results.forEach(function(i){
            scheduler(i)
          })
          console.log("init end")
          resolve(conn)
        })
      }
    })
    
  })
}

function connQuery(conn,sql){
  return new Promise((resolve,reject)=>{
    conn.query(sql,((err)=>{
      if(err) reject(err)
      resolve()
    }))
  })
}

function connSearch(conn,sql){
  return new Promise((resolve,reject)=>{
    conn.query(sql,((err ,result)=>{
      if(err) reject(err)
      resolve(result)
    }))
  })
}

export default mysql