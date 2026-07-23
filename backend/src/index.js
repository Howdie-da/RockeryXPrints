import dotenv from 'dotenv'
dotenv.config({
    path: '.env'
})

import app from "./app.js";
import connectToDB from "./db/index.js";

console.log("Is PORT injected by Render?:", process.env.PORT);
console.log("Is MONGO_URI injected by Render?:", !!process.env.MONGO_URI);

connectToDB()
.then(() => {
    app.on("error", (err) => {
        console.log("Error while connecting to DB: ", err)
        process.exit(1)
    })

    const PORT = process.env.PORT || 1001

    app.listen(PORT, () => {
        console.log("Listening to at PORT 1000")
    })
})
.catch((err) => console.log("Error occurred: " , err))