import express from 'express';
import cors from 'cors';
import routes from './routes'; // 1. IMPORTE O ROTEADOR PRINCIPAL

const app = express();
app.use(express.json());
app.use(cors());

// 2. REGISTRE AS ROTAS
// Diga ao Express para usar o 'routes'
// para qualquer requisição que comece com '/api'
app.use('/api', routes);

// Rota de teste (pode manter ou remover)
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'API do Restaurante está no ar! 🚀',
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});