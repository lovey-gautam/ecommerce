import express from 'express'
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors({
  origin:  ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));

export default app;
//module.exports = app
