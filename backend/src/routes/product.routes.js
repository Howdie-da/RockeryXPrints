import { Router } from "express";
import { jwtVerifier } from "../middleware/jwt.middleware.js";
import { adminCheck } from "../middleware/admin.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { addCategory, addCollection, addProduct, deleteCategory, deleteCollection, deleteProduct, getCategories, getCollections, getProductBySlug, getProducts, updateCategory, updateCollection, updateProduct } from "../controllers/product.controller.js";

const prodRouter = Router()

prodRouter.route('/categories').get(getCategories)
prodRouter.route('/collections').get(getCollections)
prodRouter.route('/products').get(getProducts)
prodRouter.route('/products/:slug').get(getProductBySlug)

prodRouter.use(jwtVerifier, adminCheck)

prodRouter.route('/admin/categories').get(getCategories)
prodRouter.route('/admin/collections').get(getCollections)

prodRouter.route('/add-category').post(
    upload.fields([{
        name: "coverImage", 
        maxCount: 1 
    }]), 
    addCategory
)

prodRouter.route('/delete-category/:categoryId').delete(deleteCategory)

prodRouter.route('/add-collection').post(
    upload.fields([{
        name: "coverImage", 
        maxCount: 1 
    }]), 
    addCollection
)

prodRouter.route('/update-collection/:collectionId').post(
    upload.fields([{
        name: "coverImage", 
        maxCount: 1 
    }]), 
    updateCollection
)

prodRouter.route('/delete-collection/:collectionId').delete(deleteCollection)

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