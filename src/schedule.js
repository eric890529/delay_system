import { exec, queryRow } from "./db/mysql"; 
import {notifier} from "./notifier"

let allScheduler = new Map();

export function scheduler(schedule){
    if(allScheduler.has(schedule.channel)){
      if(allScheduler.get(schedule.channel)?.has(schedule.id)) {
        clearTimeout(allScheduler.get(schedule.channel)?.get(schedule.id))//將原本的timeout清空
      }
    } else {
      allScheduler.set(schedule.channel, new Map())
    }
    const delay = (schedule.delay > 0 ? schedule.delay: 0 )
    allScheduler.get(schedule.channel)?.set(schedule.id, setTimeout((schedule)=> {
      notifier(schedule.url, schedule).then(()=>{
        deleteMysql(schedule)
        //delete allScheduler
        console.log("allScheduler",allScheduler)
        allScheduler.clear()
        console.log("allScheduler clear")
        console.log(allScheduler)
      }).catch((err)=>{
          console.log(err,"沒有回應")
          schedule.delay = 5
          scheduler(schedule)
      })
    }, delay * 1000, schedule))
  } 

function deleteMysql(schedule) {
    console.log("delete data")
    return queryRow(`DELETE FROM scheduler_chenyunda218 WHERE channel = ? AND id = ?`,
    [schedule.channel,schedule.id])
}

export let cancel = (schedule) => {
  clearTimeout(allScheduler.get(schedule.channel)?.get(schedule.id))
  //delete allScheduler
  allScheduler.clear()
  return deleteMysql(schedule)
}