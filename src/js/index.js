import {CloseMoonlight, GetInfo, StartMoonlight } from "../../src-tauri/tauri.ts"


document.addEventListener('DOMContentLoaded', () => {
  const moonlightBtn = document.getElementById("connectBtn");
  const inputIP = document.getElementById("inputIP");

  let info = {}
  let ip = ''
  let child = null
  setInterval(async () => {
    const new_ip = inputIP.value
    if (new_ip == ip) 
      return
    
    try {
      info = { ...await GetInfo(new_ip), address: new_ip }
      ip = new_ip
    } catch (e) {}
  },1000)





  moonlightBtn.onclick = async () => {
    console.log(info,child,moonlightBtn.value)
    if (moonlightBtn.value == "connect") {
      // const bitrate = document.getElementById("bitrate").value;
      // const height = document.getElementById("height").value;
      // const width = document.getElementById("width").value;
      const bitrate = 6;
      const height = 1080;
      const width = 1920;
      child = await StartMoonlight(info , {
        bitrate: bitrate * 1000,
        width: width,  
        height: height
        }, 
        (data, log) => {
          console.log(log)
      })
      moonlightBtn.value = "close"
    } else if (child != null) {
      await CloseMoonlight(child)
      moonlightBtn.value = "connect"
      child = null
    }
  }
});

