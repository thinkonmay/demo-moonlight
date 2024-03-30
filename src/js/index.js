import {StartMoonlight } from "../../src-tauri/tauri.ts"


document.addEventListener('DOMContentLoaded', () => {
  const moonlightBtn = document.getElementById("Moonlight-btn");

  moonlightBtn.onclick = async () => {
    const ip = document.getElementById("ipAddress").value;
    const bitrate = document.getElementById("bitrate").value;
    const height = document.getElementById("height").value;
    const width = document.getElementById("width").value;
    StartMoonlight({
        address: ip,
      }
      , {
      bitrate: bitrate * 1000,
      width: width,  
      height: height
      }, 
      (data, log) => {
        const logDiv = document.getElementById("moonlightLog");
        logDiv.innerHTML = logDiv.innerHTML + data + "|" +  log + "<br>"  + "<hr class='solid'></hr>";
    })
  }
});

