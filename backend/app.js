const express = require('express');
const cors = require('cors');
require('dotenv').config();

const jobRoutes = require('./Routes/jobRoute');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/v1/jobs', jobRoutes);

// Swagger Configuration
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger_spec');

app.use('/skill-bridge-api-spec', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
//Swagger UI will be available at http://localhost:5000/skill-bridge-api-spec

// Database Connection (Placeholder for now, or use existing from .env if available)
const mongoose = require('mongoose');
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('MongoDB Connected'))
//     .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
