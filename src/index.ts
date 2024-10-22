import express, { Application } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import appRoutes from "./routes/app.route";
import AppError from "./utils/appError";
dotenv.config();

const app: Application = express();

app.use(session({
  secret: process.env.SECRET_KEY!,
  resave: false,
  saveUninitialized: false,
//   store: store,
  cookie: {
    secure: process.env.NODE_ENV === "production", 
    httpOnly: true,
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

const corsOptions = {
  origin: ["http://localhost:3000"]
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/v1", appRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});


app.all("*", (req, res, next) => {
  next(
    new AppError(
      `The route ${req.originalUrl} with the ${req.method} method does not exist on this server! 💨`,
      404
    )
  );
});

// db.on("error", console.error.bind(console, "Mongodb Connection Error:"));





const PORT: number | string = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});


export default app;