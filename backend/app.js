const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const cors = require('cors'); 
// Create an Express app
const app = express();

// Middleware for parsing incoming request bodies
app.use(bodyParser.json());
app.use(cors({
    origin:["https://raj-riddhi-group-api1.vercel.app"],
    methods:["post","get"],
    credentials:true
}));
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection string
const url = "mongodb+srv://gofood:mlRWAjwjIoCKM3TP@cluster0.5qbblkc.mongodb.net/suppliersDB?retryWrites=true&w=majority&appName=Cluster0/suppliersDB";

// Connect to MongoDB
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.log('MongoDB connection error:', err);
});

// Create a schema for contact form data
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    message: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create a model
const Contact = mongoose.model('Contact', contactSchema);

app.post('/contact', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Save the form data in the database
        const newContact = new Contact({ name, email, phone, message });
        await newContact.save();

        // Respond with a success message
        res.json({ message: 'Your message has been submitted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing your request.' });
    }
});
app.get('/contact_get', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts' });
    }
});
app.get("/",(req,res)=>
{
    res.json("Hello");
})

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
