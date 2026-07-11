import mongoose from 'mongoose'

const DB_NAME = "take1"

const connectToDB = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("DB connected at: ", connection.connection.host)
    } catch (error) {
        console.log("Error occurred while connecting to DB: ", error)
    }
}

export default connectToDB

