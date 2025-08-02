import express from 'express';
import userRoutes from './routes/user.routes';
import loginRoutes from './routes/auth.routes';
import walletRoutes from './routes/wallet.routes';

const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/auth', loginRoutes);
app.use('/api/wallet', walletRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'The requested URL was not found on this server.'
  });
});

export default app;
