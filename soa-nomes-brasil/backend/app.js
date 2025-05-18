const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
const PORT = 3000;

const validarAnos = (req, res, next) => {
    const { inicio, fim } = req.query;
    if (inicio && fim) {
        if (isNaN(inicio) || isNaN(fim) || parseInt(inicio) > parseInt(fim)) {
            return res.status(400).json({ erro: 'Anos inválidos' });
        }
    }
    next();
};

const validarUF = (req, res, next) => {
    const { uf } = req.query;
    if (!uf || isNaN(uf) || uf.length > 2) {
        return res.status(400).json({ erro: 'UF inválida' });
    }
    next();
};

app.get('/api/nome', validarAnos, async (req, res) => {
    const { nome, inicio, fim } = req.query;
    
    if (!nome) {
        return res.status(400).json({ erro: 'Nome não fornecido' });
    }    try {
        console.log('Buscando dados para:', nome, inicio, fim);
        const response = await axios.get(`http://servicodados.ibge.gov.br/api/v2/censos/nomes/${encodeURIComponent(nome)}`);
        
        if (!response.data || !response.data[0] || !response.data[0].res) {
            return res.status(404).json({ erro: 'Nome não encontrado' });
        }

        const dadosFiltrados = response.data[0].res.filter(item => {
            const [anoInicio] = item.periodo.split('[')[1].split(',');
            return parseInt(anoInicio) >= parseInt(inicio) && parseInt(anoInicio) <= parseInt(fim);
        });

        console.log('Dados filtrados:', dadosFiltrados);

        if (dadosFiltrados.length === 0) {
            return res.status(404).json({ erro: 'Não foram encontrados dados para este nome no período especificado' });
        }

        res.json([{ res: dadosFiltrados }]);
    } catch (error) {
        console.error('Erro na API do IBGE:', error.message);
        res.status(500).json({ erro: 'Erro ao buscar dados do nome' });
    }
});

app.get('/api/localidade', validarUF, async (req, res) => {
    const { uf } = req.query;
    
    try {
        const response = await axios.get(`https://servicodados.ibge.gov.br/api/v2/censos/nomes/ranking?localidade=${uf}`);
        
        if (!response.data || response.data.length === 0) {
            return res.status(404).json({ erro: 'Dados não encontrados para esta UF' });
        }

        res.json(response.data);
    } catch (error) {
        console.error('Erro na API do IBGE:', error.message);
        res.status(500).json({ erro: 'Erro ao buscar dados da localidade' });
    }
});

app.get('/api/comparar', async (req, res) => {
    const { nome1, nome2 } = req.query;
    
    if (!nome1 || !nome2) {
        return res.status(400).json({ erro: 'Dois nomes são necessários para comparação' });
    }

    try {
        const [res1, res2] = await Promise.all([
            axios.get(`https://servicodados.ibge.gov.br/api/v2/censos/nomes/${encodeURIComponent(nome1)}`),
            axios.get(`https://servicodados.ibge.gov.br/api/v2/censos/nomes/${encodeURIComponent(nome2)}`)
        ]);

        if (!res1.data[0] || !res2.data[0]) {
            return res.status(404).json({ erro: 'Um ou ambos os nomes não foram encontrados' });
        }

        res.json({
            nome1: res1.data[0],
            nome2: res2.data[0]
        });
    } catch (error) {
        console.error('Erro na API do IBGE:', error.message);
        res.status(500).json({ erro: 'Erro ao comparar nomes' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
