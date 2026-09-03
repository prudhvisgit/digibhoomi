import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import stateConfig from './config/state_config.json';
import authRoutes from './routes/auth';
import meRoutes from './routes/me';
import parcelRoutes from './routes/parcels';
import serviceRoutes from './routes/services';
import aiRoutes from './routes/ai';
import integrationRoutes from './routes/integrations';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// System Health Check
app.get('/health', (req: Request, res: Response) => {
  return res.json({
    status: 'ONLINE',
    system: 'DigiBhoomi - Land Stack Digital Public Infrastructure',
    tagline: 'One Parcel. One Identity. Connected Governance.',
    version: '2.0.0-SIH2026',
    timestamp: new Date().toISOString()
  });
});

// State Configuration API
app.get('/api/state-config', (req: Request, res: Response) => {
  return res.json({
    success: true,
    data: stateConfig
  });
});

// Mount Core API Modules
app.use('/api/auth', authRoutes);
app.use('/api/me', meRoutes); // Personalized Citizen Data Isolation Endpoints
app.use('/api/parcels', parcelRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api', adminRoutes);

// Serve static GeoJSON data
const dataGisPath = path.join(__dirname, '../../data/gis');
if (fs.existsSync(dataGisPath)) {
  app.use('/data/gis', express.static(dataGisPath));
}

// Serve Frontend Build (dist) if available
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  app.get('/', (req: Request, res: Response) => {
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>DigiBhoomi API Server</title>
          <style>
            body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 3rem; text-align: center; }
            h1 { color: #10b981; }
            a { color: #38bdf8; text-decoration: none; font-weight: bold; }
            .card { background: #1e293b; padding: 2rem; border-radius: 1rem; max-width: 600px; margin: 2rem auto; border: 1px solid #334155; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>DigiBhoomi — One Parcel. One Identity. Connected Governance.</h1>
            <p>API Server is running on port <b>5000</b>.</p>
            <p>Frontend App: <a href="http://localhost:3000" target="_blank">http://localhost:3000</a></p>
            <p>Health Check: <a href="/health">/health</a> | State Analytics: <a href="/api/analytics/state">/api/analytics/state</a></p>
          </div>
        </body>
      </html>
    `);
  });
}

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Unhandled Server Error:', err);
  return res.status(500).json({
    success: false,
    message: 'Unable to process land governance request. Please try again later.'
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` DIGIBHOOMI LAND STACK DPI BACKEND SERVER LISTENING `);
  console.log(` Port: ${PORT}`);
  console.log(` API Endpoint: http://localhost:${PORT}/api`);
  console.log(` Health Check: http://localhost:${PORT}/health`);
  console.log(`=======================================================`);
});
