import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only images (JPEG, PNG, WebP, GIF) and PDF files are allowed'), false);
    }
};

export const singleUpload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
}).single('file');
