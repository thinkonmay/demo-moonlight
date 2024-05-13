window.game = "";
window.server = "";
window.launcher = "";

// Função para verificar se a variável foi definida
function verificarAuthToken() {
  if (window.authToken !== undefined) {
    socket.emit("authenticate", window.authToken);
    clearInterval(verificarIntervalo);
  }
}

const verificarIntervalo = setInterval(verificarAuthToken, 1000);

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
window.parteCriar = function () {
  document
    .getElementsByClassName("flq-preloader")[0]
    .classList.remove("flq-preloader-hide");
  setTimeout(function () {
    document.getElementsByClassName("content-wrap")[0].innerHTML = "";
    document.getElementsByClassName("flq-swiper-wrapper")[0].innerHTML = "";
    document.querySelector(".loader").classList.remove("loader-hide");
    document.querySelector(".status_text").classList.remove("status_text-hide");
    document
      .querySelector(".interromper-btn")
      .classList.remove("interromper-btn-hide");
    document.querySelector(".deletar-btn").classList.remove("deletar-btn-hide");
    document
      .getElementsByClassName("flq-preloader")[0]
      .classList.add("flq-preloader-hide");
  }, 1500);
};

document.addEventListener("DOMContentLoaded", function () {
  var cookies = parseCookies(document.cookie);
  console.log(cookies);

  if (
    cookies.token === undefined ||
    cookies.token === null ||
    cookies.token === ""
  ) {
    document.getElementById("user-logo").style.display = "none";
    window.loggedin = false;
  } else {
    window.loggedin = true;

    const username = document.getElementById("username");
    username.classList.remove("d-none");
    username.innerHTML = cookies.username;
    document.getElementById("user-icon").innerHTML =
      cookies.username[0].toUpperCase();

    document.getElementById("botao-entrar").classList.remove("d-md-flex");
    document.getElementById("botao-entrar").classList.add("d-none");
    document.getElementById("icon-logar").classList.add("d-none");

    socket.emit("authenticate", cookies.token);
  }

  if (document.cookie.indexOf("key=") != -1) {
    //
    socket.emit("discord", "info");
    socket.on("discord", function (msg) {
      document.getElementById("oauthurl-a").removeAttribute("href");
      document.getElementById("oauthurl-a").removeAttribute("style");
      document.getElementById("oauthurl-span").innerHTML = msg;
    });
  }

  socket.emit("getVms", "");
});

$("#botn-logar").ready(function () {
  $("#botn-logar")[0].onclick = function () {
    // logar();
    $("#botn-logar")[0].disabled = true;
    $("#botn-logar")[0].innerHTML = '<div class="btnloader"></div>';
  };
});

// FUNÇÃO DE LOGIN

window.checkAll = function () {
  if (!loggedin) {
    $("#entrar-login").trigger("click");
  }
};

const socket = io.connect("https://play.grupobright.com:8080");
socket.on("connect", function (msg) {
  console.log("Conectado ao Servidor");
});
socket.on("avaliable", function (msg) {
  $("#google-disponivies")[0].innerHTML = " " + msg.google;
  $("#azure-disponivies")[0].innerHTML = " " + msg.azure;
  $("#priority-disponivies")[0].innerHTML = " " + msg.priority;
});

socket.on("error", async function (msg) {
  var title;
  var message;
  if (msg["code"].includes("Erro inesperado")) {
    title = "Erro inesperado:";
    message = msg["code"];
  } else if (msg["code"] === "Sem assinatura ativada!") {
    title = "Sem assinatura:";
    message =
      "Esse usuário não possui assinatura ativa, crie um ticket ou adquira sua assinatura no site!";
    new Promise((res) => setTimeout(res, 5000)).then(() => {
      window.location.reload();
    });
  }
  document.getElementById("modal-title").innerText = title;
  document.getElementById("modal-message").innerText = message;
  document.getElementById("messageModal").classList.remove("d-none");
  document.getElementById("messageModal").classList.add("d-show");
});

function dimissMessageModal() {
  document.getElementById("messageModal").classList.remove("d-show");
  document.getElementById("messageModal").classList.add("d-none");
}

socket.on("autenticado", function (msg) {
  setCookies();
});

function setCookies() {
  window.loggedin = true;
  let loginUI = false;
  if (!document.cookie.includes("token")) {
    loginUI = true;
  }

  if (loginUI) {
    document.cookie = `token=${window.authToken}`;
    document.cookie = `max-age=${60 * 60 * 24}`;
    document.cookie = `expires=${new Date(
      new Date().getTime() + 24 * 60 * 60 * 1000
    )}`;
    document.cookie = `username=${window.userName}`;

    window.location.reload();
  }
}

function logout() {
  document.cookie = "token=;";
  document.cookie = "max-age=;";
  document.cookie = "expires=;";
  document.cookie = "username=;";
  localStorage.clear();
  window.location.reload();
}

function parseCookies(cookies) {
  var cookies = {};
  document.cookie.split(";").forEach(function (cookie) {
    var parts = cookie.split("=");
    var key = parts[0].trim();
    var value = decodeURIComponent(parts[1]);
    cookies[key] = value;
  });
  return cookies;
}

window.copyFrom = function (idname) {
  var copyText = $(`#${idname}`)[0];
  copyText.select();
  navigator.clipboard.writeText(copyText.value);
};

window.authPin = function (pin) {
  socket.emit("auth", pin);
};

window.transferData = function () {
  $("#formdoip-back")[0].value = $("#formdoip")[0].value;
  $("#entrar-vm-back").trigger("click");
};

socket.on("del", function (msg) {
  if (msg != true) {
    document.cookie = "token=; max-age=0;";
    window.location.href = "/";
  }
});

socket.on("reconnect", function (msg) {
  $(".status_text").ready(function () {
    if (msg != "NADA") {
      parteCriar();
      document.getElementById("status_text").innerHTML = msg;
    }
  });
});

socket.on("status", async function (msg) {
  document.getElementById("status_text").innerHTML = msg;
});

socket.on("private", function (msg) {
  location.reload();
  console.log(socket);
});

socket.on("cookie", function (msg) {
  console.log("Cookie> ", msg);
  document.cookie = `info=${msg};`;
});

socket.on("error", function (msg) {
  if (msg.code == 2828) {
    alert("Inicie outro jogo/tente mais tarde.");
    window.location.href = "/";
  }
});

socket.on("fisica2", function (msg) {
  document.getElementById(
    "status_text"
  ).innerHTML = `Carregando sua VM Física...`;
  socket.emit("vmCommand", { evento: "CreateVM" });
});

socket.on("fila", async function (msg) {
  document.getElementById(
    "status_text"
  ).innerHTML = `Posição na fila: ${msg.position}`;
  await new Promise((res) => setTimeout(res, 5000));
  socket.emit("vmCommand", { evento: "List" });
});

socket.on("fisica2-error", async function (msg) {
  alert(msg);
  window.location.href = "/";
});

socket.on("interrompido", async function (msg) {
  window.location.href = "/";
});

socket.on("RecCreated", async function (msg) {
  $("#entrar-vm-fisica").ready(function () {
    $("#formdasenha-fisica")[0].value = msg.password;
    $("#formdoip-fisica")[0].value = msg.ip;
    $("#entrar-vm-fisica").trigger("click");
    document.querySelector(".loader").classList.add("loader-hide");
    document.querySelector(".status_text").classList.add("status_text-hide");
  });
});

socket.on("criado", function (msg) {
  console.log("CRIANDOO");
  if (msg.fisica) {
    $("#entrar-vm-fisica").ready(function () {
      $("#formdasenha-fisica")[0].value = msg.password;
      $("#formdoip-fisica")[0].value = msg.ip;
      $("#formdouser-fisica")[0].value = "BCG";
      $("#entrar-vm-fisica").trigger("click");
      document.querySelector(".loader").classList.add("loader-hide");
      document.querySelector(".status_text").classList.add("status_text-hide");
    });
  } else {
    $("#entrar-vm").ready(function () {
      $("#formdoip")[0].value = msg.ip;
      $("#formdasenha")[0].value = msg.password;
      $("#beta-btn").on("click", function () {
        window.open(msg.url, "_blank");
      });

      document.querySelector(".loader").classList.add("loader-hide");
      document.querySelector(".status_text").classList.add("status_text-hide");
      $("#entrar-vm").trigger("click");
      //$("#entrar-vm-back").trigger("click")
    });
  }
});

socket.on("created", async function (msg) {
  if (msg.fisica) {
    $("#formdasenha-fisica")[0].value = msg.password;
    $("#formdoip-fisica")[0].value = msg.ip;
    $("#entrar-vm-fisica").trigger("click");
    document.querySelector(".loader").classList.add("loader-hide");
    document.querySelector(".status_text").classList.add("status_text-hide");
  } else {
    $("#formdoip")[0].value = msg.ip;
    $("#formdasenha")[0].value = msg.password;
    document.querySelector(".loader").classList.add("loader-hide");
    document.querySelector(".status_text").classList.add("status_text-hide");
    $("#beta-btn").on("click", function () {
      window.open(msg.url, "_blank");
    });
    $("#entrar-vm").trigger("click");
    //$("#entrar-vm-back").trigger("click")
  }
});

socket.on("changePage", async function (msg) {
  console.log("Change Page");
  changePage();
});

let vm = "";

function changePage() {
  let t = game;

  if (game == "gtav") {
    t = `gtav-${launcher}`;
  }

  if (game == "reddead") {
    if (launcher == "steam") {
      t = "reddead";
    }

    if (launcher == "epic") {
      t = `reddead-epic`;
    }
  }

  if (game == "rleague") {
    t = `rleague-${launcher}`;
  }

  parteCriar();

  tryLaunch(t, window.server);
}

socket.on("assinatura", async function (msg) {
  if (msg == true) {
    fisicaLaunch();
  } else {
    window.location.href = "/";
  }
});

async function checarAssinatura1() {
  parteCriar();

  document.getElementById("status_text").innerHTML = `Checando assinatura...`;
  window.checarAssinatura();

  /*document.getElementsByTagName('body')[0].style.background = ""
    document.getElementsByTagName('body')[0].style.backgroundImage = "url('https://play.brightcloudgames.com.br/images/vip_loading21.jpg')";
    document.getElementsByTagName('body')[0].style.backgroundSize = "cover"
    document.getElementsByTagName('body')[0].style.backgroundRepeat = "no-repeat"*/
}

async function iniciarAppPainel() {
  console.log("Antes Função");
  const computer = {
    address: document.getElementById("formdoip").value,
  };
  window.iniciarApp(computer, streamConfig);
  document.getElementById("modal-title").innerText = "Iniciando app:";
  document.getElementById("modal-message").innerText =
    "Aguarde até o app iniciar...";
  document.getElementById("modal-info").innerText =
    "Se a stream não iniciar, tente reiniciar sua VM.";
  document.getElementById("messageModal").classList.remove("d-none");
  document.getElementById("messageModal").classList.add("d-show");
}

function openConfigModal() {
  document.getElementById("modalConfigStream").classList.remove("d-none");
  document.getElementById("modalConfigStream").classList.add("d-show");
}

function dimissConfigModal() {
  document.getElementById("modalConfigStream").classList.remove("d-show");
  document.getElementById("modalConfigStream").classList.add("d-none");
}

var streamConfig = {
  bitrate: 6000,
  width: 1920,
  height: 1080,
};

function salvarConfigStream() {
  streamConfig.bitrate = document.getElementById("bitrate").value || 6000;
  streamConfig.width = document.getElementById("width").value || 1920;
  streamConfig.height = document.getElementById("height").value || 1080;
  document.getElementById("modalConfigStream").classList.remove("d-show");
  document.getElementById("modalConfigStream").classList.add("d-none");
}

window.iniciarAppPainel = iniciarAppPainel;

function fisicaLaunch() {
  //document.getElementsByClassName("btn btn-hover")[1].classList.remove("btn-hover--hidden")
  //document.querySelector(".loader").classList.remove("loader--hidden")

  socket.emit("choose", "fisica");
  socket.emit("vmCommand", { evento: "List" });

  document.getElementById(
    "status_text"
  ).innerHTML = `Carregando sua VM Física...`;

  // document.querySelector(".iframe").classList.remove("iframe--hidden")
}

function mudarZona(zona) {
  socket.emit("region", `${zona}`);
  socket.emit("choose", "google");
  socket.emit("vmCommand", { evento: "List" });
  document.getElementById("changeRegion").classList.remove("d-flex");
  document.getElementById("changeRegion").classList.add("d-none");
}

function dimissChangeRegionModal() {
  document.getElementById("changeRegion").style.display = "none";
  socket.emit("sair", "sairFila");
}

function tryLaunch(game, vmType) {
  // if (vmType == "google") {
  socket.emit("choose", "google");

  socket.on("vms", async function (msg) {
    console.log(msg[0]);
    socket.emit("vmCommand", { evento: "CreateVM", game: game });
  });

  socket.on("changeRegion", async function (msg) {
    document.getElementById("changeRegion").classList.remove("d-none");
    document.getElementById("changeRegion").classList.add("d-flex");
  });

  socket.emit("vmCommand", { evento: "List" });
  // } else if (vmType == "azure") {
  //   socket.emit("choose", "azure");

  //   socket.on("vms", async function (msg) {
  //     console.log(msg[0]);
  //     socket.emit("vmCommand", { evento: "CreateVM", game: game });
  //   });

  //   socket.on("status", async function (msg) {
  //     document.getElementById("status_text").innerHTML = msg;
  //   });

  //   socket.on("error", async function (msg) {
  //     console.log("ERROR");

  //     window.location.href = "/";
  //   });

  //   socket.emit("vmCommand", { evento: "List" });
  // }
}
