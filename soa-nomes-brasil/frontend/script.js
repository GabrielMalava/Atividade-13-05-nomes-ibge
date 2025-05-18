async function consultarNome() {
  const nome = document.getElementById('nome').value.trim();
  const inicio = document.getElementById('inicio').value.trim();
  const fim = document.getElementById('fim').value.trim();

  if (!nome || !inicio || !fim) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  const anoInicio = parseInt(inicio);
  const anoFim = parseInt(fim);
  const anoAtual = new Date().getFullYear();

  if (isNaN(anoInicio) || isNaN(anoFim)) {
    alert("Por favor, insira anos válidos.");
    return;
  }

  if (anoInicio > anoFim) {
    alert("O ano inicial deve ser menor que o ano final.");
    return;
  }

  if (anoInicio < 1930) {
    alert("O ano inicial não pode ser menor que 1930 (primeiro censo disponível).");
    return;
  }

  if (anoFim > anoAtual) {
    alert(`O ano final não pode ser maior que o ano atual (${anoAtual}).`);
    return;
  }  try {
        const res = await fetch(`http://127.0.0.1:3000/api/nome?nome=${encodeURIComponent(nome)}&inicio=${inicio}&fim=${fim}`);
        const data = await res.json();
        console.log('Resposta da API:', data); // Debug
    
    if (!res.ok || data.erro) {
      alert(data.erro || "Erro ao buscar dados.");
      return;
    }

    if (!Array.isArray(data)) {
      alert("Erro: resposta da API em formato inválido");
      return;
    }

    if (!data || data.length === 0 || !data[0] || !data[0].res || data[0].res.length === 0) {
      alert("Não foram encontrados dados para este nome no período especificado.");
      return;
    }    const dadosFormatados = data[0].res
      .map(item => ({
        periodo: item.periodo.split('[')[1].split(',')[0],
        frequencia: parseInt(item.frequencia)
      }))
      .sort((a, b) => parseInt(a.periodo) - parseInt(b.periodo)); 
    
    window.renderizarGrafico(dadosFormatados, nome.toUpperCase());
  } catch (err) {
    console.error(err);
    alert("Erro ao buscar dados. Verifique se o servidor está rodando.");
  }
}

async function consultarLocalidade() {
  const uf = document.getElementById('uf').value.trim();

  if (!uf) {
    alert("Digite o código da UF.");
    return;
  }

  if (isNaN(uf) || uf.length > 2) {
    alert("Digite um código de UF válido (ex: 35 para SP).");
    return;
  }    try {
        const res = await fetch(`http://127.0.0.1:3000/api/localidade?uf=${encodeURIComponent(uf)}`);
        if (!res.ok) throw new Error('Erro na requisição');
    
    const data = await res.json();
    if (!data || data.length === 0) {
      alert("Não foram encontrados dados para esta UF.");
      return;
    }

    const container = document.getElementById('resultado-localidade');
    container.innerHTML = '<h3>Top 3 nomes mais frequentes por período:</h3>';
    
    data.forEach(item => {
      const nomes = item.res.map((r, index) => 
        `${index + 1}. ${r.nome} (${r.frequencia.toLocaleString()} ocorrências)`
      ).join('<br>');
      
      container.innerHTML += `
        <div class="periodo-container">
          <strong>Período ${item.periodo}:</strong><br>
          ${nomes}
        </div>
      `;
    });
  } catch (err) {
    console.error(err);
    alert("Erro ao buscar dados da localidade. Verifique se o servidor está rodando.");
  }
}

async function compararNomes() {
  const nome1 = document.getElementById('nome1').value.trim();
  const nome2 = document.getElementById('nome2').value.trim();

  if (!nome1 || !nome2) {
    alert("Digite os dois nomes para comparação.");
    return;
  }    try {
        const res = await fetch(`http://127.0.0.1:3000/api/comparar?nome1=${encodeURIComponent(nome1)}&nome2=${encodeURIComponent(nome2)}`);
        if (!res.ok) throw new Error('Erro na requisição');
    
    const data = await res.json();
    if (!data.nome1?.res || !data.nome2?.res) {
      alert("Não foram encontrados dados para um ou ambos os nomes.");
      return;
    }
    
    const dadosNome1 = data.nome1.res.map(item => ({
      periodo: item.periodo.split('[')[1].split(',')[0],
      frequencia: parseInt(item.frequencia)
    })).sort((a, b) => parseInt(a.periodo) - parseInt(b.periodo));

    const dadosNome2 = data.nome2.res.map(item => ({
      periodo: item.periodo.split('[')[1].split(',')[0],
      frequencia: parseInt(item.frequencia)
    })).sort((a, b) => parseInt(a.periodo) - parseInt(b.periodo));
    
    renderizarGraficoComparativo(dadosNome1, dadosNome2, nome1.toUpperCase(), nome2.toUpperCase());
  } catch (err) {
    console.error(err);
    alert("Erro ao comparar nomes. Verifique se o servidor está rodando.");
  }
}

function toggleUFLegend() {
    const legend = document.getElementById('uf-legend');
    if (legend.style.display === 'none') {
        legend.style.display = 'block';
    } else {
        legend.style.display = 'none';
    }
}
