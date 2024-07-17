const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/db/db');
const userRoutes = require('./src/Routes/userRoutes');
const adminRoutes = require('./src/Routes/adminRoutes');
const agentRoutes = require('./src/Routes/agentRoutes');



dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


connectDB();


app.use('/api/v1/user', userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/agent', agentRoutes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
