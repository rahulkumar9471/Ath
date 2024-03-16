const express = require('express');
const app = express();

require('dotenv').config();
require('./config/connection').connect();
const cookiesParser = require("cookie-parser")

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookiesParser());

const user = require('./routes/user');
app.use('/api/v1',user);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

