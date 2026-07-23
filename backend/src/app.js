import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (process.env.CORS_ORIGIN === '*' || !process.env.CORS_ORIGIN) {
            return callback(null, true);
        }
        const allowedOrigins = process.env.CORS_ORIGIN.split(',').map((o) => o.trim());
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(null, true); // Fallback allow origin for local dev
    },
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import { userRouter } from './routes/user.routes.js'
import { prodRouter } from './routes/product.routes.js'
import { orderRouter } from './routes/order.routes.js'

app.use('/api/v1/users', userRouter)
app.use('/api/v1/prods', prodRouter)
app.use('/api/v1/orders', orderRouter)

export default app