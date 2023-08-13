import app from "./app";
// import env from "../src/utils/validateEnv";
import mongoose from "mongoose";

const port = process.env.PORT;
const url = process.env.MONGO_URL as string;

mongoose
    .connect(url)
    .then(() => {
        console.log(`Mongoose Connected -- !`);
    })
    .catch(console.error);

app.listen(port!, () => {
    // variable! <--- not in JS only ts -- telling the program that we know it might not exist but still do it
    console.log(`Server launched on port ------> ${port}`);
});
