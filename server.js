require('dotenv').config();
const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// Database Connection
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Tanish@SQL00',
    database: process.env.DB_NAME || 'agro_kisan',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Weather API Config
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'your_weather_api_key';

// Routes
app.get('/', (req, res) => {
    res.render('home.html');
});

app.get('/about', (req, res) => {
    res.render('about.html');
});


app.get('/services', (req, res) => {
    res.render('services.html');
});

app.get('/blog', (req, res) => {
    res.render('blog.html');
});

app.get('/contact', (req, res) => {
    res.render('contact.html');
});

// Add this with your other routes in app.js
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    
    // In a real application, you would:
    // 1. Validate the input
    // 2. Store in database
    // 3. Send email notification
    
    console.log('Contact form submission:', { name, email, subject, message });
    
    // Simulate processing delay
    setTimeout(() => {
        res.json({
            success: true,
            message: 'Thank you for your message! We will get back to you soon.'
        });
    }, 1000);
});

app.get('/crops', (req, res) => {
    res.render('crops.html');
});

app.get('/market', (req, res) => {
    res.render('market.html');
});

app.get('/weather', (req, res) => {
    res.render('weather.html');
});

// API Routes
app.get('/api/crops/popular', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM crops WHERE is_popular = 1 LIMIT 4');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/api/crops/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM crops WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Crop not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/api/market/latest', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT m.*, c.name as commodity 
            FROM market_prices m
            JOIN commodities c ON m.commodity_id = c.id
            WHERE m.date = CURDATE()
            ORDER BY m.id DESC
            LIMIT 10
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/api/weather', async (req, res) => {
    const location = req.query.location || 'Bangalore';
    
    try {
        // In a real app, you would call a weather API here
        // This is a mock response for demonstration
        const mockWeather = {
            location: location,
            forecast: [
                {
                    date: new Date().toLocaleDateString(),
                    temp: Math.floor(Math.random() * 10) + 25,
                    condition: 'Sunny',
                    humidity: Math.floor(Math.random() * 30) + 50
                },
                {
                    date: new Date(Date.now() + 86400000).toLocaleDateString(),
                    temp: Math.floor(Math.random() * 10) + 24,
                    condition: 'Partly Cloudy',
                    humidity: Math.floor(Math.random() * 30) + 55
                },
                {
                    date: new Date(Date.now() + 172800000).toLocaleDateString(),
                    temp: Math.floor(Math.random() * 10) + 23,
                    condition: 'Rainy',
                    humidity: Math.floor(Math.random() * 30) + 60
                }
            ]
        };
        
        res.json(mockWeather);
    } catch (error) {
        console.error('Weather API error:', error);
        res.status(500).json({ error: 'Weather service unavailable' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});