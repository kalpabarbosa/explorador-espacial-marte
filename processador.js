$(document).ready(function() {
  $("#send-command").click(function() {
    var comandos = $("#input").val().split("\n");
    $("#output").text("");
    $(".sonda").remove();

    mapearPlanalto(comandos[0]);

    explorar(comandos.slice(1));
  })
})

async function explorar(comandos) {
  if (comandos.length < 2) return;

  var posicaoInicial = comandos[0];
  var instrucoes = comandos[1];

  var sonda = posicionarSonda(posicaoInicial);

  for (var i=0; i<instrucoes.length; i++) {
    var comando = instrucoes[i];

    $("#instrucao").text("Processando: " + comando);
    switch(comando) {
      case "M":
        moverSonda(sonda);
        $("#sonda").animate({"left": sonda.posicao.x*50, "bottom": sonda.posicao.y*50}, 500);
        break;
      case "L":
      case "R":
        mudarDirecao(sonda, comando);
        $("#sonda").attr("src", "./img/sonda_"+sonda.direcao+".png");
        
        break;
      default:
        console.error("explorar: Instrução inválida: " + comando);
    }

    console.info("Processando: " + comando);
    await sleep(1000);
  }

  $("#output").append(sonda.posicao.x + " " + sonda.posicao.y + " " + sonda.direcao + "<br>");

  await sleep(1000);
  explorar(comandos.slice(2))
}

function mudarDirecao(sonda, comando) {
  var direcoes = ["N", "E", "S", "W"];
  var indexDirecaoAtual = direcoes.indexOf(sonda.direcao);

  if (comando == "L") {
    sonda.direcao = indexDirecaoAtual-1 < 0 ? "W" : direcoes[indexDirecaoAtual-1];
  } else { // comando == "R"
    sonda.direcao = indexDirecaoAtual+1 > 3 ? "N" : direcoes[indexDirecaoAtual+1];
  }
}

function moverSonda(sonda) {
  switch(sonda.direcao) {
    case "N":
      sonda.posicao.y++;
      break;
    case "E":
      sonda.posicao.x++;
      break;
    case "S":
      sonda.posicao.y--;
      break;
    case "W":
      sonda.posicao.x--;
      break;
  }
}

function posicionarSonda(posicaoInicial) {
  var [x, y, direcao] = posicaoInicial.split(" ");

  $("#sonda").attr("id", "");
  $("#planalto").append('<img id="sonda" class="sonda" src="" alt="sonda" />');

  $("#sonda").attr("src", "./img/sonda_"+direcao+".png");
  $("#sonda").css({"left": x*50, "bottom": y*50});
  $("#sonda").fadeIn();

  return {
    "direcao": direcao,
    "posicao": {
      "x": x,
      "y": y
    }
  };
}

function mapearPlanalto(dimensao) {
  var [largura, altura] = dimensao.split(" ");
  largura = parseInt(largura);
  altura = parseInt(altura);

  if (altura == undefined || largura == undefined
    || isNaN(altura) || isNaN(largura)) {
    console.error("mapearPlanalto: Formato de entrada para dimensões do planalto inválido.")

  } else {
    $("#planalto").animate({width: largura*50, height: altura*50}, 500);
    console.info("Novo planalto mapeado. Dimensões: " + largura + " x " + altura);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
