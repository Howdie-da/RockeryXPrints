import app from "./app.js";
import dotenv from 'dotenv'
import connectToDB from "./db/index.js";

dotenv.config({
    path: '.env'
})

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