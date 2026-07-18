import mongoose from 'mongoose'

const DB_NAME = "take1"

const connectToDB = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("DB connected at: ", connection.connection.host)
        
        try {
            await mongoose.connection.db.collection('users').dropIndex("username_1");
            console.log("Successfully dropped legacy index username_1");
        } catch (e) {
            // Index might not exist, ignore
        }
    } catch (error) {
        console.log("Error occurred while connecting to DB: ", error)
    }
}

export default connectToDB

