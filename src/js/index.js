import {
  CloseMoonlight,
  GetInfo,
  StartMoonlight,
} from "../../src-tauri/tauri.ts";

import { overrideGlobalXHR } from "tauri-xhr";
overrideGlobalXHR();

//import FormData from "form-data";

import axios from "axios";

document.addEventListener("DOMContentLoaded", async () => {
  document
    .getElementById("botn-logar")
    .addEventListener("click", async () => await tryLogar());

  async function tryLogar() {
    var login = document.querySelector(".form-do-login1").value;
    var senha = document.querySelector(".form-do-login2").value;

    axios
      .get("https://grupobright.com/minha-conta/")
      .then((response) => {
        var parser = new DOMParser();
        var doc = parser.parseFromString(response.data, "text/html");
        var woocommerceLoginNonceElement = doc.querySelector(
          "#woocommerce-login-nonce"
        );

        if (woocommerceLoginNonceElement) {
          var nonceValue = woocommerceLoginNonceElement.value;
          console.log(nonceValue);
          var formData = new FormData();
          formData.append("username", login);
          formData.append("password", senha);
          formData.append("woocommerce-login-nonce", nonceValue);
          formData.append("_wp_http_referer", "/minha-conta/");
          formData.append("login", "Acessar");

          axios
            .post("https://grupobright.com/minha-conta/", formData)
            .then((response) => {
              console.log("Login bem-sucedido!");
              afterLogin(response);
            });
        } else {
          console.log("Elemento não encontrado.");
        }
      })
      .catch((error) => {
        console.error("Falha ao fazer a solicitação GET.", error);
      });
  }

  async function afterLogin(response) {
    console.log(document.cookie);
    console.log(response);
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
