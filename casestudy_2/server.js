const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const distanceRoutes = require('./routes/distances'); // Import the distance routes

const app = express();
const port = 3000;
const ip = '192.168.1.20';

// MongoDB connection URL
const url = `mongodb://${ip}:27017/cs2`;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3001' // Allow requests from this origin
}));

// Database name
const dbName = 'cs2';

async function main() {
    try {
        // Connect to the MongoDB server
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected successfully to MongoDB server");

        // Sample route to test the connection
        app.get('/', async (req, res) => {
            try {
                const collections = await mongoose.connection.db.listCollections().toArray();
                res.send(`Collections in the database: ${collections.map(col => col.name).join(', ')}`);
            } catch (err) {
                res.status(500).send('Error fetching collections');
            }
        });

        // Use the distance routes
        app.use('/api', distanceRoutes);

        // Start the Express server and listen on the specified IP address
        app.listen(port, ip, () => {
            console.log(`Server is running and accessible at http://${ip}:${port}`);
        });

    } catch (err) {
        console.error(err.stack);
        process.exit(1);
    }
}

main().catch(console.error);
