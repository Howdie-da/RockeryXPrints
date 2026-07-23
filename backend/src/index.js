import dotenv from 'dotenv'
dotenv.config({
    path: '.env'
})

import app from "./app.js";
import connectToDB from "./db/index.js";

connectToDB()
.then(() => {
    app.on("error", (err) => {
        console.log("Error while connecting to DB: ", err)
        process.exit(1)
    })

    const PORT = process.env.PORT || 1001

    app.listen(PORT, () => {
        console.log("Listening to at PORT: ", PORT)
    })
})
.catch((err) => console.log("Error occurred: " , err))