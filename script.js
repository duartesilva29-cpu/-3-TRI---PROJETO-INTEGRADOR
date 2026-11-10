document.addEventListener('DOMContentLoaded', () => {

  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('menu-principal');
  menuToggle?.addEventListener('click', () => {
    const expandido = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !expandido);
    menu.classList.toggle('ativo');
  });

  document.getElementById('btnContraste')?.addEventListener('click', () => {
    document.body.classList.toggle('alto-contraste');
  });
  document.getElementById('btnFonte')?.addEventListener('click', () => {
    document.body.classList.toggle('fonte-grande');
  });
  document.getElementById('btnDislexia')?.addEventListener('click', () => {
    document.body.classList.toggle('dislexia');
  });
  document.getElementById('btnLeitura')?.addEventListener('click', () => {
    document.body.classList.toggle('leitura');
  });

  const horaDia = document.getElementById('horaDia');
  const intensidade = document.getElementById('intensidade');
  const corFundo = document.getElementById('corFundo');
  const capaTermica = document.getElementById('capaTermica');
  const valorHora = document.getElementById('valorHora');
  const valorIntensidade = document.getElementById('valorIntensidade');
  const labelCapa = document.getElementById('labelCapa');
  const tempPiscina = document.getElementById('tempPiscina');
  const aguaPiscina = document.getElementById('aguaPiscina');
  const solVisual = document.getElementById('solVisual');
  const radiacaoAbsorvida = document.getElementById('radiacaoAbsorvida');
  const ganhoTermico = document.getElementById('ganhoTermico');
  const perdaEvaporacao = document.getElementById('perdaEvaporacao');
  const saldoTermico = document.getElementById('saldoTermico');
  const tempEstimada = document.getElementById('tempEstimada');
  const explicacaoDinamica = document.getElementById('explicacaoDinamica');

  function atualizarPiscina() {
    const hora = parseFloat(horaDia.value);
    const intSolar = parseFloat(intensidade.value) / 100;
    const fundo = corFundo.value;
    const comCapa = capaTermica.checked;

    const h = Math.floor(hora);
    const m = (hora % 1) * 60;
    valorHora.textContent = `${String(h).padStart(2,'0')}:${String(Math.round(m)).padStart(2,'0')}`;
    valorIntensidade.textContent = Math.round(intSolar * 100);
    labelCapa.textContent = comCapa ? 'Sim' : 'Não';

    let radiacao = 0;
    if (hora >= 6 && hora <= 18) {
      radiacao = Math.sin(((hora - 6) / 12) * Math.PI) * intSolar;
    }

    let absorcao = 0.5;
    if (fundo === 'escuro') absorcao = 0.7;
    else absorcao = 0.4;

    const radiacaoAbs = radiacao * absorcao * 100;
    const ganho = radiacao * absorcao * 1.2;

    let perda = 0.2;
    if (hora < 6 || hora > 18) perda = 0.5;
    if (comCapa) perda *= 0.3;

    const saldo = ganho - perda;
    const temp = 25 + saldo * 8;

    tempPiscina.textContent = `${temp.toFixed(1)}°C`;

    const intensidadeCor = Math.min(1, Math.max(0, (temp - 20) / 15));
    aguaPiscina.style.background = `linear-gradient(180deg,
      rgba(0,${119 + intensidadeCor*80},${182 - intensidadeCor*80},0.7),
      rgba(${intensidadeCor*100},${62 + intensidadeCor*50},${138 - intensidadeCor*50},0.9))`;

    if (hora >= 6 && hora <= 18) {
      const x = 10 + (hora - 6) / 12 * 80;
      const y = 40 - Math.sin(((hora - 6) / 12 * Math.PI)) * 30;
      solVisual.style.left = `${x}%`;
      solVisual.style.top = `${y}%`;
      solVisual.style.opacity = '1';
    } else {
      solVisual.style.opacity = '0.2';
      solVisual.style.top = '60%';
    }

    radiacaoAbsorvida.textContent = radiacaoAbs.toFixed(1);
    ganhoTermico.textContent = ganho.toFixed(2);
    perdaEvaporacao.textContent = perda.toFixed(2);
    saldoTermico.textContent = saldo.toFixed(2);
    tempEstimada.textContent = temp.toFixed(1);

    let explicacao = '';
    if (hora < 6 || hora > 18) {
      explicacao = '🌙 Durante a noite, não há radiação solar. A piscina perde calor por evaporação e radiação infravermelha.';
    } else if (radiacao < 0.3) {
      explicacao = '🌅 O sol está baixo no horizonte. A radiação incide em ângulo oblíquo, aquecendo menos a piscina.';
    } else if (radiacao > 0.7) {
      explicacao = '☀️ Sol forte! A radiação incide quase perpendicularmente, maximizando a absorção de energia pela água.';
    } else {
      explicacao = '🌤️ Radiação solar moderada. A água está absorvendo energia e aquecendo gradualmente.';
    }

    if (fundo === 'escuro') {
      explicacao += ' O fundo escuro aumenta a absorção de radiação.';
    } else {
      explicacao += ' O fundo claro reflete parte da radiação.';
    }

    if (comCapa) {
      explicacao += ' A capa térmica reduz significativamente a perda de calor por evaporação.';
    }

    explicacaoDinamica.textContent = explicacao;
  }

  [horaDia, intensidade, corFundo, capaTermica].forEach(el => {
    el?.addEventListener('input', atualizarPiscina);
    el?.addEventListener('change', atualizarPiscina);
  });
  atualizarPiscina();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('ativo')) {
      menu.classList.remove('ativo');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.focus();
    }
  });

});
