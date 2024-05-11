import {
  CloseMoonlight,
  GetInfo,
  StartMoonlight,
} from "../../src-tauri/tauri.ts";

function fireEvent(eventName, eventData) {
  const event = new CustomEvent(eventName, {
    detail: eventData,
  });
  document.dispatchEvent(event);
}

import { overrideGlobalXHR } from "tauri-xhr";
overrideGlobalXHR();

//import FormData from "form-data";

import axios from "axios";
import FormData from "form-data";

document.addEventListener("DOMContentLoaded", async () => {
  document
    .getElementById("botn-logar")
    .addEventListener("click", async () => await tryLogar());

  async function tryLogar() {
    var login = document.querySelector(".form-do-login1").value;
    var senha = document.querySelector(".form-do-login2").value;

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(login)) {
      var params = `?email=${login}&password=${senha}`;
    } else {
      var params = `?username=${login}&password=${senha}`;
    }

    axios
      .get(`https://grupobright.com/api/user/generate_auth_cookie/${params}`)
      .then((response) => {
        afterLogin(response);
      })
      .catch((error) => {
        alert("Ocorreu um erro no login");
        document.querySelector("#botn-logar").disabled = false;
        document.querySelector("#botn-logar").innerHTML = "Login";
      });
  }

  async function afterLogin(response) {
    if (response.data.status == "error") {
      alert("Usuário ou senha inválidos");
      document.querySelector("#botn-logar").disabled = false;
      document.querySelector("#botn-logar").innerHTML = "Login";
    } else {
      window.userName = `${response.data.user.displayname}`;
      const config = {
        method: "GET",
        url: "https://grupobright.com/check.php",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: `${response.data.cookie_name}=${response.data.cookie};`,
        },
      };
      axios.request(config).then((response2) => {
        console.log(`${response.data.cookie_name}=${response.data.cookie};`);
        console.log(response2);
        alert("Logado com sucesso");
        window.authToken = response2.data;
      });
    }
  }

  const moonlightBtn = document.getElementById("connectBtn");
  const submitBtn = document.getElementById("submitBtn");
  const inputIP = document.getElementById("IP");

  let info = {};
  let ip = "";
  let child = null;
  let config = {
    bitrate: 6000,
    width: 1920,
    height: 1080,
  };
  // setInterval(async () => {
  //   const new_ip = inputIP.value;
  //   if (new_ip == ip) return;

  //   try {
  //     info = { ...(await GetInfo(new_ip)), address: new_ip };
  //     ip = new_ip;
  //   } catch (e) {}
  // }, 1000);

  submitBtn.onclick = async () => {
    const bitrate = document.getElementById("bitrate").value;
    const height = document.getElementById("height").value;
    const width = document.getElementById("width").value;

    if (bitrate != undefined && bitrate > 1 && bitrate < 100)
      config.bitrate = bitrate * 1000;
    if (height != undefined && height > 100 && height < 5000)
      config.height = height;
    if (width != undefined && width > 100 && width < 5000) config.width = width;

    console.log(config);
  };

  moonlightBtn.onclick = async () => {
    if (child == null) {
      child = await StartMoonlight(info, config, (data, log) =>
        console.log(`${data} : ${log}`)
      );
    } else {
      await CloseMoonlight(child);
      child = null;
    }
  };
});
