import { useState, useEffect } from "react"



function onCLickSend(data:any){
  console.log('Hello wolrd')
  chrome.runtime.sendMessage({action:"Hello wolrd",data:data},(response)=>{
    console.log(response)
  }) 
}
function IndexPopup() {
  const [data, setData] = useState("")
  useEffect(()=>{
    console.log(data)
  },[data])

  

  return (
    <div>
    <input  value={data}  onChange={(e)=>{setData(e.target.value)}} placeholder="Hello wolrd Please input a name of a book here "></input>
    <button onClick={()=>{onCLickSend(data)}}>Click ME To Send Data !!! </button>
    </div>
  )
}

export default IndexPopup
