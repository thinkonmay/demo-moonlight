import {CloseMoonlight, GetInfo, StartMoonlight } from "../../src-tauri/tauri.ts"


document.addEventListener('DOMContentLoaded', () => {
  const moonlightBtn = document.getElementById("connectBtn");
  const submitBtn = document.getElementById("submitBtn");
  const inputIP = document.getElementById("IP");

  let info = {}
  let ip = ''
  let child = null
  let config = {
    bitrate: 6000,
    width: 1920,  
    height: 1080 
  }
  setInterval(async () => {
    const new_ip = inputIP.value
    if (new_ip == ip) 
      return
    
    try {
      info = { ...await GetInfo(new_ip), address: new_ip }
      ip = new_ip
    } catch (e) {}
  },1000)



  submitBtn.onclick = async () => {
    const bitrate = document.getElementById("bitrate").value;
    const height = document.getElementById("height").value;
    const width = document.getElementById("width").value;

    if (bitrate != undefined && bitrate > 1 && bitrate < 100)
      config.bitrate = bitrate * 1000
    if (height != undefined && height > 100 && height < 5000)
      config.height = height
    if (width != undefined && width > 100 && width < 5000)
      config.width = width

    console.log(config)
  };



  moonlightBtn.onclick = async () => {
    if (child == null) {
      child = await StartMoonlight(info , config, (data, log) => console.log(`${data} : ${log}`))
    } else if (child != null) {
      child = null
      await CloseMoonlight(child)
    }
  }
});

