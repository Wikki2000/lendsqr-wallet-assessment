import express from 'express';
import authRoutes from './routes/auth.routes';
import walletRoutes from './routes/wallet.routes';

const app = express();
app.use(express.json());  // Parse incoming JSON

app.use(express.json());
app.use('/api/account', authRoutes);
app.use('/api/wallet', walletRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'The requested URL was not found on this server.'
  });
});

export default app;
