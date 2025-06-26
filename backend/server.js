// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const planRoute=require('./routes/planRoute')
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/auth');
const inviteRoutes=require('./routes/inviteRoute');
const traineePlanRoutes=require('./routes/traineePlan')
const activityRoutes=require('./routes/activityRoute');
const progressRoute=require('./routes/progressRoute');
const TrainerProgress=require('./routes/TrainerProgress')
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerConfig');
const groupRoute = require('./routes/groupRoute');
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON

// Routes
app.use('/api/invite',inviteRoutes);
app.use('/api',planRoute);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', groupRoute); 
app.use('/api',traineePlanRoutes);
app.use('/api/activity',activityRoutes);
app.use('/api/progress',progressRoute);
app.use('/api/progress',TrainerProgress);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//connect to mongodb
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () => console.log(`Server running on port 5000`));
  })
  .catch((err) => console.error(err));