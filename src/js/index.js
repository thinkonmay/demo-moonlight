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

import axios from "axios";

async function iniciarApp(computer, streamConfig) {
  if (child == null) {
    child = await StartMoonlight(computer, streamConfig, (data, log) =>
      console.log(`${data} : ${log}`)
    );
  } else {
    await CloseMoonlight(child);
    child = null;
  }
}

window.iniciarApp = iniciarApp;

let cookie_name;
let cookie_val;

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
        document.getElementById("modal-title").innerText =
          "Credenciais Inválidas";
        document.getElementById("modal-message").innerText =
          "O usuário ou senha inseridos estão incorretos. Por favor, tente novamente.";
        document.getElementById("modal-info").innerText =
          "Se o erro persistir, crie um ticket no suporte!";
        document.getElementById("messageModal").classList.remove("d-none");
        document.getElementById("messageModal").classList.add("d-show");
        document.querySelector("#botn-logar").disabled = false;
        document.querySelector("#botn-logar").innerHTML = "Login";
        new Promise((res) => setTimeout(res, 5000)).then(() => {
          return;
        });
      });
  }

  async function afterLogin(response) {
    if (response.data.status == "error") {
      document.getElementById("modal-title").innerText =
        "Credenciais Inválidas";
      document.getElementById("modal-message").innerText =
        "O usuário ou senha inseridos estão incorretos. Por favor, tente novamente.";
      document.getElementById("messageModal").classList.remove("d-none");
      document.getElementById("messageModal").classList.add("d-show");
      document.querySelector("#botn-logar").disabled = false;
      document.querySelector("#botn-logar").innerHTML = "Login";
      new Promise((res) => setTimeout(res, 5000)).then(() => {
        return;
      });
    } else {
      localStorage.setItem("cookie_name", response.data.cookie_name);
      localStorage.setItem("cookie_value", response.data.cookie);
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
        window.authToken = response2.data;
      });
    }
  }
});

const moonlightBtn = document.getElementById("connectBtn");
const submitBtn = document.getElementById("submitBtn");
const inputIP = document.getElementById("formdoip");

let info = {};
let ip = "";
let child = null;
// setInterval(async () => {
//   const new_ip = inputIP.value;
//   if (new_ip == ip) return;

//   try {
//     info = { ...(await GetInfo(new_ip)), address: new_ip };
//     ip = new_ip;
//   } catch (e) {}
// }, 1000);

function checarAssinatura() {
  const config = {
    method: "GET",
    url: "https://grupobright.com/checkpriority.php",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: `${localStorage.getItem("cookie_name")}=${localStorage.getItem(
        "cookie_value"
      )};`,
    },
  };
  axios.request(config).then((response) => {
    socket.emit("checarAssinatura", response.data);
  });
  return;
}

window.checarAssinatura = checarAssinatura;
