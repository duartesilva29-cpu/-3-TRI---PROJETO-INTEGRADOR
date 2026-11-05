/* ============================================================
   PROJETO SOL & ÁGUA — LÓGICA INTERATIVA
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. MENU MOBILE ---------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('menu-principal');
  menuToggle?.addEventListener('click', () => {
    const expandido = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !expandido);
    menu.classList.toggle('ativo');
  });

  /* ---------- 2. ACESSIBILIDADE ---------- */
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

  /* ---------- 3. SIMULADOR FOTOELÉTRICO ---------- */
  const comprimentoOnda = document.getElementById('comprimentoOnda');
  const valorOnda = document.getElementById('valorOnda');
  const resultadoFotoeletrico = document.getElementById('resultadoFotoeletrico');
  const foton = document.getElementById('foton');
  const eletron = document.getElementById('eletron');

  // Função de trabalho típica (sódio): ~2.3 eV
  const FUNCAO_TRABALHO = 2.3; // eV
  const h = 4.1357e-15; // constante de Planck em eV·s
  const c = 3e8; // velocidade da luz em m/s

  function atualizarFotoeletrico() {
    const lambda = parseFloat(comprimentoOnda.value); // nm
    valorOnda.textContent = lambda;

    // Energia do fóton: E = hc/λ
    const energiaFoton = (h * c) / (lambda * 1e-9); // eV
    const energiaCinetica = energiaFoton - FUNCAO_TRABALHO;

    // Cor do fóton baseada no comprimento de onda
    const cor = comprimentoParaCor(lambda);
    foton.style.background = `radial-gradient(circle, ${cor}, #fff)`;
    foton.style.boxShadow = `0 0 20px ${cor}`;

    if (energiaFoton >= FUNCAO_TRABALHO) {
      resultadoFotoeletrico.innerHTML = `
        ✅ <strong>Efeito fotoelétrico OCORRE!</strong><br>
        Energia do fóton: ${energiaFoton.toFixed(2)} eV<br>
        Função de trabalho: ${FUNCAO_TRABALHO} eV<br>
        Energia cinética do elétron: ${energiaCinetica.toFixed(2)} eV
      `;
      eletron.style.animationPlayState = 'running';
    } else {
      resultadoFotoeletrico.innerHTML = `
        ❌ <strong>Efeito fotoelétrico NÃO ocorre.</strong><br>
        Energia do fóton (${energiaFoton.toFixed(2)} eV) é menor que a função de trabalho (${FUNCAO_TRABALHO} eV).<br>
        Aumente a frequência (diminua o comprimento de onda).
      `;
      eletron.style.animationPlayState = 'paused';
      eletron.style.opacity = '0';
    }
  }

  function comprimentoParaCor(lambda) {
    let r = 0, g = 0, b = 0;
    if (lambda >= 380 && lambda < 440) { r = -(lambda - 440) / 60; b = 1; }
    else if (lambda < 490) { g = (lambda - 440) / 50; b = 1; }
    else if (lambda < 510) { g = 1; b = -(lambda - 510) / 20; }
    else if (lambda < 580) { r = (lambda - 510) / 70; g = 1; }
    else if (lambda < 645) { r = 1; g = -(lambda - 645) / 65; }
    else if (lambda <= 780) { r = 1; }
    else { r = 0.5; g = 0; b = 0.5; } // UV
    return `rgb(${Math.round(r*255)},${Math.round(g*255)},${Math.round(b*255)})`;
  }

  comprimentoOnda?.addEventListener('input', atualizarFotoeletrico);
  atualizarFotoeletrico();

  /* ---------- 4. SIMULADOR DA PISCINA ---------- */
  const horaDia = document.getElementById('horaDia');
  const intensidade = document.getElementById('intensidade');
  const capaTermica = document.getElementById('capaTermica');
  const coletor = document.getElementById('coletor');
  const valorHora = document.getElementById('valorHora');
  const valorIntensidade = document.getElementById('valorIntensidade');
  const tempPiscina = document.getElementById('tempPiscina');
  const aguaPiscina = document.getElementById('aguaPiscina');
  const solVisual = document.getElementById('solVisual');
  const ganhoSolar = document.getElementById('ganhoSolar');
  const perdaNoturna = document.getElementById('perdaNoturna');
  const saldoTermico = document.getElementById('saldoTermico');

  function atualizarPiscina() {
    const hora = parseFloat(horaDia.value);
    const intSolar = parseFloat(intensidade.value) / 100;
    const comCapa = capaTermica.checked;
    const comColetor = coletor.checked;

    // Formato da hora
    const h = Math.floor(hora);
    const m = (hora % 1) * 60;
    valorHora.textContent = `${String(h).padStart(2,'0')}:${String(Math.round(m)).padStart(2,'0')}`;
    valorIntensidade.textContent = Math.round(intSolar * 100);

    // Radiação solar (curva senoidal entre 6h e 18h)
    let radiacao = 0;
    if (hora >= 6 && hora <= 18) {
      radiacao = Math.sin(((hora - 6) / 12) * Math.PI) * intSolar;
    }

    // Ganho térmico (°C/h)
    let ganho = radiacao * 0.8;
    if (comColetor) ganho *= 1.8; // coletor aumenta absorção

    // Perda térmica (radiação infravermelha noturna + convecção)
    let perda = 0.3; // base
    if (hora < 6 || hora > 18) perda = 0.8; // maior à noite
    if (comCapa) perda *= 0.3; // capa reduz perda em 70%

    const saldo = ganho - perda;

    // Temperatura estimada (base 25°C)
    const temp = 25 + saldo * 5;
    tempPiscina.textContent = `${temp.toFixed(1)}°C`;

    // Cor da água baseada na temperatura
    const intensidadeCor = Math.min(1, Math.max(0, (temp - 20) / 15));
    aguaPiscina.style.background = `linear-gradient(180deg,
      rgba(0,${119 + intensidadeCor*80},${182 - intensidadeCor*80},0.7),
      rgba(${intensidadeCor*100},${62 + intensidadeCor*50},${138 - intensidadeCor*50},0.9))`;

    // Posição do sol
    if (hora >= 6 && hora <= 18) {
      const angulo = ((hora - 6) / 12) * 180;
      const x = 10 + (hora - 6) / 12 * 80;
      const y = 40 - Math.sin((angulo * Math.PI) / 180) * 30;
      solVisual.style.left = `${x}%`;
      solVisual.style.top = `${y}%`;
      solVisual.style.opacity = '1';
    } else {
      solVisual.style.opacity = '0.2';
      solVisual.style.top = '60%';
    }

    ganhoSolar.textContent = ganho.toFixed(2);
    perdaNoturna.textContent = perda.toFixed(2);
    saldoTermico.textContent = saldo.toFixed(2);
  }

  [horaDia, intensidade, capaTermica, coletor].forEach(el => {
    el?.addEventListener('input', atualizarPiscina);
    el?.addEventListener('change', atualizarPiscina);
  });
  atualizarPiscina();

  /* ---------- 5. GRÁFICO CORPO NEGRO (Canvas) ---------- */
  const canvas = document.getElementById('graficoCorpoNegro');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    // Lei de Planck simplificada (unidades arbitrárias)
    function planck(lambda, T) {
      const c1 = 3.74e-13;
      const c2 = 1.44e-2;
      return c1 / (Math.pow(lambda, 5) * (Math.exp(c2 / (lambda * T)) - 1));
    }

    function desenharGrafico() {
      ctx.clearRect(0, 0, W, H);

      // Eixos
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, H - 30);
      ctx.lineTo(W - 20, H - 30);
      ctx.moveTo(50, H - 30);
      ctx.lineTo(50, 20);
      ctx.stroke();

      // Labels
      ctx.fillStyle = '#333';
      ctx.font = '12px Poppins';
      ctx.fillText('λ (nm)', W - 50, H - 10);
      ctx.fillText('Intensidade', 10, 15);

      const temperaturas = [
        { T: 5800, cor: '#ffb703', label: 'Sol (5800K)' },
        { T: 3000, cor: '#fb8500', label: 'Objeto morno (3000K)' },
        { T: 300,  cor: '#d62828', label: 'Piscina (300K)' }
      ];

      let maxVal = 0;
      temperaturas.forEach(t => {
        for (let lambda = 200; lambda < 3000; lambda += 50) {
          const v = planck(lambda * 1e-9, t.T);
          if (v > maxVal) maxVal = v;
        }
      });

      temperaturas.forEach(t => {
        ctx.strokeStyle = t.cor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        let primeiro = true;
        for (let lambda = 200; lambda < 3000; lambda += 20) {
          const v = planck(lambda * 1e-9, t.T);
          const x = 50 + ((lambda - 200) / 2800) * (W - 80);
          const y = (H - 30) - (v / maxVal) * (H - 60);
          if (primeiro) { ctx.moveTo(x, y); primeiro = false; }
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Legenda
        ctx.fillStyle = t.cor;
        ctx.fillText(t.label, W - 180, 30 + temperaturas.indexOf(t) * 20);
      });
    }
    desenharGrafico();
  }

  /* ---------- 6. CONTADORES ANIMADOS ---------- */
  const numeros = document.querySelectorAll('.numero');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const alvo = parseInt(el.dataset.target);
        let atual = 0;
        const passo = alvo / 50;
        const timer = setInterval(() => {
          atual += passo;
          if (atual >= alvo) { atual = alvo; clearInterval(timer); }
          el.textContent = Math.round(atual);
        }, 30);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  numeros.forEach(n => observer.observe(n));

  /* ---------- 7. NAVEGAÇÃO POR TECLADO ---------- */
  document.addEventListener('keydown', (e) => {
    // ESC fecha menu mobile
    if (e.key === 'Escape' && menu.classList.contains('ativo')) {
      menu.classList.remove('ativo');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.focus();
    }
  });

});
