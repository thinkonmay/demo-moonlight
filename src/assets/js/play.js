window.game = "";
window.server = "";
window.launcher = "";

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
  if (document.cookie.indexOf("token=") == -1) {
    document.getElementById("user-logo").style.display = "none";
    window.loggedin = false;
  } else {
    window.loggedin = true;
    document.getElementById("botao-entrar").classList.remove("d-md-flex");
    document.getElementById("botao-entrar").style.display = "none";
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
  }
  window.location.href = "/";
});

socket.on("fisica2", function (msg) {
  document.getElementById(
    "status_text"
  ).innerHTML = `Carregando sua VM Física...`;
  socket.emit("vmCommand", { event: "CreateVM" });
});

socket.on("fila", async function (msg) {
  document.getElementById(
    "status_text"
  ).innerHTML = `Posição na fila: ${msg.position}`;
  await new Promise((res) => setTimeout(res, 5000));
  socket.emit("vmCommand", { event: "List" });
});

socket.on("fisica2-error", async function (msg) {
  alert(msg);
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

socket.on("changePage", async function (msg) {});

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

function checarAssinatura() {
  socket.emit("checarAssinatura", "");

  parteCriar();
  document.getElementById("status_text").innerHTML = `Checando assinatura...`;
  /*document.getElementsByTagName('body')[0].style.background = ""
    document.getElementsByTagName('body')[0].style.backgroundImage = "url('https://play.brightcloudgames.com.br/images/vip_loading21.jpg')";
    document.getElementsByTagName('body')[0].style.backgroundSize = "cover"
    document.getElementsByTagName('body')[0].style.backgroundRepeat = "no-repeat"*/
}

function fisicaLaunch() {
  //document.getElementsByClassName("btn btn-hover")[1].classList.remove("btn-hover--hidden")
  //document.querySelector(".loader").classList.remove("loader--hidden")

  socket.emit("choose", "fisica");
  socket.emit("vmCommand", { event: "List" });

  document.getElementById(
    "status_text"
  ).innerHTML = `Carregando sua VM Física...`;

  // document.querySelector(".iframe").classList.remove("iframe--hidden")
}

function tryLaunch(game, vmType) {
  if (vmType == "google") {
    socket.emit("choose", "google");

    socket.on("vms", async function (msg) {
      console.log(msg[0]);
      socket.emit("vmCommand", { event: "CreateVM", game: game });
    });

    socket.on("status", async function (msg) {
      document.getElementById("status_text").innerHTML = msg;
    });

    socket.on("error", async function (msg) {
      console.log("ERROR");

      window.location.href = "/";
    });

    socket.emit("vmCommand", { event: "List" });
  } else if (vmType == "azure") {
    socket.emit("choose", "azure");

    socket.on("vms", async function (msg) {
      console.log(msg[0]);
      socket.emit("vmCommand", { event: "CreateVM", game: game });
    });

    socket.on("status", async function (msg) {
      document.getElementById("status_text").innerHTML = msg;
    });

    socket.on("error", async function (msg) {
      console.log("ERROR");

      window.location.href = "/";
    });

    socket.emit("vmCommand", { event: "List" });
  }
}
