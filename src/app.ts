import express from 'express';
import userRoutes from './routes/user.routes';
import loginRoutes from './routes/auth.routes';

const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/auth', loginRoutes);

export default app;
