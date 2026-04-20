require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./src/config');
const errorHandler = require('./src/middleware/errorHandler');
const businessesRouter = require('./src/routes/businesses');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/businesses', businessesRouter);

// Health check para testar se está online
app.get('/health', (req, res) => res.json({ status: 'ok', environment: config.nodeEnv }));

// Tratamento de erros
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`🚀 BizScout API rodando na porta ${config.port}`);
});