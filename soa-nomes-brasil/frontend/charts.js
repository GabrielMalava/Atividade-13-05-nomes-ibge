let grafico;

function getChartConfig(type) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 24, 
            weight: 'bold',
            family: "'Segoe UI', -apple-system, sans-serif"
          },
          usePointStyle: true,
          padding: 30,
          color: '#000000' 
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        titleColor: '#2962ff',
        bodyColor: '#000000', 
        titleFont: {
          size: 20,
          weight: 'bold',
          family: "'Segoe UI', -apple-system, sans-serif"
        },
        bodyFont: {
          size: 18,
          family: "'Segoe UI', -apple-system, sans-serif"
        },
        padding: 20,
        cornerRadius: 10,
        displayColors: true,
        borderWidth: 2,
        borderColor: 'rgba(41, 98, 255, 0.3)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        callbacks: {
          label: function(context) {
            return ` Frequência: ${context.raw.toLocaleString('pt-BR')} ocorrências`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        border: {
          display: true,
          color: 'rgba(0,0,0,0.2)',
          width: 2
        },
        ticks: {
          font: {
            size: 18, 
            weight: '600',
            family: "'Segoe UI', -apple-system, sans-serif"
          },
          maxRotation: 45,
          minRotation: 45,
          color: '#000000' 
        }
      },
      y: {
        beginAtZero: true,
        border: {
          display: true,
          color: 'rgba(0,0,0,0.2)',
          width: 2
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1
        },
        ticks: {
          font: {
            size: 18, 
            weight: '600',
            family: "'Segoe UI', -apple-system, sans-serif"
          },
          color: '#000000', 
          callback: function(value) {
            return value.toLocaleString('pt-BR');
          },
          padding: 15
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    layout: {
      padding: {
        top: 30,
        right: 35,
        bottom: 30,
        left: 35
      }
    }
  };
}

function getRandomColor() {
  const colors = [
    '#3498db', '#e74c3c', '#2ecc71', '#f1c40f', 
    '#9b59b6', '#1abc9c', '#34495e', '#e67e22'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function renderizarGrafico(dados, nome) {
  console.log('Dados para o gráfico:', dados);
  const canvas = document.getElementById('grafico');
  
  canvas.style.height = '800px'; 
  canvas.style.width = '100%';
  canvas.height = 1600; 
  canvas.width = canvas.offsetWidth * 2;
  
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);
  
  if (grafico) {
    grafico.destroy();
    grafico = null;
  }
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const color = '#2962ff'; 
  
  
  const primeiroAno = dados[0];
  const ultimoAno = dados[dados.length - 1];
  const variacao = ((ultimoAno.frequencia - primeiroAno.frequencia) / primeiroAno.frequencia * 100).toFixed(1);
  const tendencia = variacao >= 0 ? 'aumento' : 'diminuição';
  
  grafico = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dados.map(item => `Ano ${item.periodo}`),
      datasets: [{
        label: `Evolução do nome ${nome}`,
        data: dados.map(item => item.frequencia),
        borderColor: color,
        backgroundColor: 'rgba(41, 98, 255, 0.2)', 
        fill: true,
        tension: 0.2, 
        borderWidth: 8, 
        pointRadius: 12, 
        pointHoverRadius: 16,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: color,
        pointBorderWidth: 4,
        pointStyle: 'circle',
        pointShadowBlur: 15,
        pointShadowColor: 'rgba(0, 0, 0, 0.5)',
        borderJoinStyle: 'round',
        segment: {
          borderColor: ctx => '#2962ff'
        }
      }]
    },
    options: {
      ...getChartConfig('single'),
      plugins: {
        ...getChartConfig('single').plugins,
        subtitle: {
          display: true,
          text: `${tendencia === 'aumento' ? '📈' : '📉'} ${Math.abs(variacao)}% de ${tendencia} entre ${primeiroAno.periodo} e ${ultimoAno.periodo}`,
          font: {
            size: 24, 
            weight: 'bold',
            family: "'Segoe UI', -apple-system, sans-serif"
          },
          padding: {
            top: 20,
            bottom: 40
          }
        }
      }
    }
  });
}

function renderizarGraficoComparativo(dados1, dados2, nome1, nome2) {
  const canvas = document.getElementById('grafico');
  
  canvas.style.height = '400px';
  canvas.style.width = '100%';
  canvas.height = 800; 
  canvas.width = canvas.offsetWidth * 2;
  
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2); 
  
  if (grafico) {
    grafico.destroy();
    grafico = null;
  }
  
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const color1 = getRandomColor();
  let color2;
  do {
    color2 = getRandomColor();
  } while (color2 === color1);

  grafico = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dados1.map(item => `Ano ${item.periodo}`),
      datasets: [
        {
          label: nome1,
          data: dados1.map(item => item.frequencia),
          borderColor: color1,
          backgroundColor: color1 + '15',
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 2
        },
        {
          label: nome2,
          data: dados2.map(item => item.frequencia),
          borderColor: color2,
          backgroundColor: color2 + '15',
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 2
        }
      ]
    },
    options: getChartConfig('comparison')
  });
}
