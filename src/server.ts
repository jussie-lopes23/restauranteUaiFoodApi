import express from 'express';
import cors from 'cors';
import routes from './routes';

//SWAGGER
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger'; 

const app = express();
app.use(express.json());
app.use(cors());

// ROTA DE DOCUMENTAÇÃO DO SWAGGER
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas da aplicação
app.use('/api', routes);

// Rota de teste
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'API do Restaurante está no ar! ',
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});