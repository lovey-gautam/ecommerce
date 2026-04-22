import express from 'express'
import cors from "cors";

const app = express();

app.use(express.json());


app.use(express.urlencoded({ extended: true }));

export default app;
//module.exports = app
