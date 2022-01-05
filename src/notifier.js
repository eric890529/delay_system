import axios from 'axios';

export const notifier = (url, data) => {
  return new Promise((resolve, reject) => {
    axios
    .post(url, data)
    .then((res)=>{
      console.log("res.data")
      console.log(res.data)
      resolve()
    })
    .catch((err)=>{
      console.log("no respond")
      reject(data.url)
     })
  })
}