import {StartThinkmay} from "../../src-tauri/tauri.ts"


document.addEventListener('DOMContentLoaded', () => {
  const moonlightBtn = document.getElementById("Moonlight-btn");
  moonlightBtn.onclick = async () => {
    console.log('hi')
    StartThinkmay({address:"123.123.123.123"})
  }
});
