import cookieParser from 'cookie-parser';
import express from 'express';
import multer from 'multer';
import cors from 'cors'
import dotenv from 'dotenv'
import connectDb from './utils/db.js';
import userRoutes from './routes/user.route.js';
import companyRoutes from './routes/company.route.js';
import jobRoutes from './routes/job.route.js';
import applicationRoute from './routes/application.route.js'
import aiRoutes from './routes/ai.route.js'
dotenv.config({})

const app=express();
app.set('trust proxy', 1);
connectDb();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const corsOptions={
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials:true,
}
app.use(cors(corsOptions));

//routes
app.use('/api/v1/user',userRoutes);
app.use('/api/v1/company',companyRoutes);
app.use('/api/v1/job',jobRoutes);
app.use('/api/v1/application',applicationRoute);
app.use('/api/v1/ai',aiRoutes);

// error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ msg: err.message, success: false });
    }
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        msg: err.message || 'Internal Server Error',
        success: false
    });
});

const PORT=process.env.PORT || 8000;
app.listen(PORT,()=>{
    console.log("http://localhost:"+PORT);
})