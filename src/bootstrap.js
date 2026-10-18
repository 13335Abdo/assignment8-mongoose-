import { connectDB } from "./DB/connection.js";
import { notesRouter, usersRouter } from "./modules/index.js";
import "./DB/models/index.js";

export const bootstrap = async (express, app) => {


    app.use(express.json());

    await connectDB();

    app.use("/users", usersRouter);
    app.use("/notes", notesRouter);



    app.all("/*dummy", (req, res) => {
        res.status(404).json({ message: "Route not found" });
    });

}