/* =============================================
   app.js — Point d'entrée de l'API Portfolio
   Express.js + MongoDB (Mongoose)
   ============================================= */

/* ── Chargement des variables d'environnement ── */
require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const connectDB    = require('./config/connectdb');
const projetRoutes = require('./routes/projetRoutes');

/* ── Connexion à MongoDB ── */
connectDB();

/* ── Initialisation d'Express ── */
const app = express();

/* ════════════════════════════════════════════
   MIDDLEWARES GLOBAUX
   ════════════════════════════════════════════ */

/* Accepter les requêtes JSON dans le body */
app.use(express.json({ limit: '10mb' }));

/* Accepter les données de formulaires URL-encodées */
app.use(express.urlencoded({ extended: true }));

/* CORS — autoriser les requêtes depuis le frontend React */
/* Configuration CORS pour sécuriser les accès frontend */
app.use(
  cors({
    origin: [
      'http://localhost:3000', // React dev server
      'http://localhost:5173', // Vite dev server
    ],

    methods : ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

/* ════════════════════════════════════════════
   ROUTES
   ════════════════════════════════════════════ */

/* Route de santé — vérifier que l'API est vivante */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 API Portfolio — Express.js + MongoDB',
    version: '1.0.0',
    endpoints: {
      'GET    /projets'     : 'Lister tous les projets',
      'POST   /projets'     : 'Ajouter un projet',
      'GET    /projets/:id' : 'Obtenir un projet par ID',
      'PUT    /projets/:id' : 'Modifier un projet',
      'DELETE /projets/:id' : 'Supprimer un projet',
    },
  });
});

/* Routes des projets */
app.use('/projets', projetRoutes);

/* ════════════════════════════════════════════
   GESTION DES ERREURS
   ════════════════════════════════════════════ */

/* Route non trouvée (404) */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route non trouvée : ${req.method} ${req.originalUrl}`,
  });
});

/* Gestionnaire d'erreurs global */
app.use((err, req, res, next) => {
  console.error('💥 Erreur non gérée :', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne.',
  });
});

/* ════════════════════════════════════════════
   DÉMARRAGE DU SERVEUR
   ════════════════════════════════════════════ */
/* Démarrage du serveur et écoute sur le port configuré */
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   🚀  API PORTFOLIO — DÉMARRÉE           ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log(`║   Port    : http://localhost:${PORT}          ║`);
  console.log(`║   Env     : ${process.env.NODE_ENV || 'development'}                   ║`);
  console.log('╚══════════════════════════════════════════╝');
  console.log('');
});

module.exports = app;
