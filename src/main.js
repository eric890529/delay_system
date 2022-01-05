import { app } from './index.js';
import { init } from './db/mysql'

init().then(()=>{
  app.listen(5000,()=>{
    console.log('start listen')
  })
})