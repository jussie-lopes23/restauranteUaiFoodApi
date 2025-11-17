import express from 'express';
import cors from 'cors';
import routes from './routes';

// --- ADIÇÕES DO SWAGGER ---
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger'; // Importa do novo local

const app = express();
app.use(express.json());
app.use(cors());

// --- ROTA DE DOCUMENTAÇÃO DO SWAGGER ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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