import { Router } from "express";
import { jwtVerifier } from "../middleware/jwt.middleware.js";
import { adminCheck } from "../middleware/admin.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { addCategory, addProduct, deleteCategory, deleteProduct, getCategories, updateProduct } from "../controllers/product.controller.js";

const prodRouter = Router()

prodRouter.route('/categories').get(getCategories)
prodRouter.route('/products').get(getProducts)
prodRouter.route('/products/:slug').get(getProductBySlug)

prodRouter.use(jwtVerifier, adminCheck)

prodRouter.route('/add-category').post(upload.fields([{ 
        name: "coverPhoto", maxCount: 1 
    }]), 
    addCategory
)

prodRouter.route('/delete-category/:slug').delete(deleteCategory)

prodRouter.route('/add-product').post(upload.fields([{ 
        name: "images" 
    }]), 
    addProduct
)

prodRouter.route('/update-product/:productId').post(upload.fields([{
        name: "images"
    }]), 
    updateProduct
)

prodRouter.route('/delete-product/:productId').delete(deleteProduct)

export {prodRouter}