// import express from 'express';
import express from 'express'
import bodyParser from 'body-parser';
import connection from './dBConfig/dBConnection.js';
import cors from 'cors'
const app = express();
import dotenv from 'dotenv';
import path from 'path'
import { fileURLToPath } from 'url';

import RoleRoutes from './Routes/Auth.js';
import FeedbackRoutes from './Routes/Feedback.js'

const port = process.env.PORT || 8080;
// const port = 8080


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())
dotenv.config()


connection();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));


app.listen(port, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
});

app.use("/", RoleRoutes);
app.use("/", FeedbackRoutes)