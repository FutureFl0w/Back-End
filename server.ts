import express from "express";
import env from "dotenv";
import cors from "cors";

env.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// app.use("/", routes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

async function start() {
    app.listen(process.env.PORT, () => {
      console.log(
        `Server is running on http://${process.env.HOST}:${process.env.PORT}`,
      );
    });
}

start();