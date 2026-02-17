import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
console.log('Testing connection to:', uri.split('@')[1]); // Hide password

mongoose.connect(uri)
    .then(() => {
        console.log('✅ SUCCESS: Connected to MongoDB Atlas!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ ERROR: Could not connect to MongoDB.');
        console.error('Error details:', err.message);
        if (err.message.includes('bad auth')) console.log('Hint: Check your username and password.');
        if (err.message.includes('querySrv ETIMEOUT')) console.log('Hint: Check your IP Whitelist in Atlas (Network Access)._');
        process.exit(1);
    });
