import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const addCategory = asyncHandler(async (req, res) => {
    const {name} = req.body

    if (!name) {
        throw new ApiError(400, "Enter the Category name.")
    }

    const slug = name.toLowerCase().trim().replaceAll(' ', '-')
    
    const existingCategory = await Category.findOne({ slug });
    
    if (existingCategory) {
        throw new ApiError(400, "Category with this name already exists.");
    }
    
    const coverImagePath = req.files?.coverImage?.[0]?.path

    if (!coverImagePath) {
        throw new ApiError(400, "Upload cover photo for category")
    }

    const coverImage = await uploadOnCloudinary(coverImagePath)

    if (!coverImage) {
        throw new ApiError(500, "Internal occurred while uploading cover photo")
    }

    const category = await Category.create({
        name,
        slug,
        coverImage: coverImage.url
    })

    if (!category) {
        throw new ApiError(500, "Internal Error Occurred")
    }

    return res
    .status(201)
    .json(new ApiResponse(201, category, "Category created Successfully"))
})

const getCategories = asyncHandler(async (req, res) => {
    const filter = req.user?.role === 'admin' ? {} : {productCount: {$gt: 0}}

    const allCategories = await Category.find(filter).lean()

    return res
    .status(200)
    .json(new ApiResponse(200, allCategories.length ? allCategories : [], "Categories fetched successfully"))
})

const deleteCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    if (!categoryId) {
        throw new ApiError(400, "Choose a category to delete")
    }

    const existingCategory = await Category.findById(categoryId);
    
    if (!existingCategory) {
        throw new ApiError(404, "Category does not exist.");
    }

    if (existingCategory.productCount > 0) {
        throw new ApiError(400, `Cannot delete. This category still contains ${existingCategory.productCount} products.`);
    }

    if (existingCategory.coverImage) {
        await deleteOnCloudinary(existingCategory.coverImage);
    }

    await existingCategory.deleteOne()

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Category deleted successfully"))
})

const addProduct = asyncHandler(async (req, res) => {
    const { name, description, mrp, sellingPrice, parentProduct, 
        category, searchTags, sku, stock, deliveryDays, features} = req.body

    if (!name || !description || !mrp || !sellingPrice || !category) {
        throw new ApiError(400, "Enter all required fields")
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
        throw new ApiError(404, "Selected category does not exist.");
    }

    const slug = name.toLowerCase().trim().replaceAll(' ', '-')

    const existingProduct = await Product.findOne({ $or: [{ name }, { slug }] })

    if (existingProduct) {
        throw new ApiError(400, "Product with this name already exists")
    }

    let parsedFeatures = [];
    if (features) {
        try {
            parsedFeatures = JSON.parse(features); 
        } catch (error) {
            throw new ApiError(400, "Invalid features format. Must be a valid JSON array.");
        }
    }

    const imagesPath = req.files?.images?.map(item => item?.path) || []

    if (!imagesPath.length) {
        throw new ApiError(400, "Images are required to upload")
    }

    const uploadPromises = imagesPath.map(path => uploadOnCloudinary(path))
    const uploadResults = await Promise.all(uploadPromises)

    const imageUrls = uploadResults.map(result => {
        if (!result || !result.url) {
            throw new ApiError(500, "Some or all images are not uploaded successfully")
        }
        return result.url
    })

    const product = await Product.create({
        name,
        slug,
        description,
        mrp: Number(mrp),
        sellingPrice: Number(sellingPrice),
        category: categoryExists._id,
        parentProduct: parentProduct || null,
        searchTags,
        sku,
        stock: Number(stock) || 0,
        deliveryDays: Number(deliveryDays),
        images: imageUrls,
        features: parsedFeatures
    })

    if (!product) {
        throw new ApiError(500, "Internal Error occurred")
    }

    if (!parentProduct) {
        await Category.findByIdAndUpdate(categoryExists._id, {
            $inc: { productCount: 1 }
        });
    }

    return res
    .status(201)
    .json(new ApiResponse(201, product, "Product has been listed successfully"))
})

const updateProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    
    const { name, description, mrp, sellingPrice, category,
        searchTags, sku, stock, deliveryDays, parentProduct, features } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (!product.parentProduct && product.category.toString() !== category.toString()) {
        
        const newCategoryExists = await Category.findById(category);
        if (!newCategoryExists) {
            throw new ApiError(400, "Wrong category chosen.");
        }

        await Category.findByIdAndUpdate(product.category, { 
            $inc: { productCount: -1 } 
        });
        
        await Category.findByIdAndUpdate(category, { 
            $inc: { productCount: 1 } 
        });
    }

    let parsedFeatures = [];
    if (features) {
        try {
            parsedFeatures = JSON.parse(features); 
        } catch (error) {
            throw new ApiError(400, "Invalid features format. Must be a valid JSON array.");
        }
    }

    let updatedImages = product.images; 

    const newImagesPath = req.files?.images?.map(item => item?.path) || [];
    
    if (newImagesPath.length > 0) {
        for (const oldImageUrl of product.images) {
            await deleteOnCloudinary(oldImageUrl);
        }

        const uploadPromises = newImagesPath.map(path => uploadOnCloudinary(path));
        const uploadResults = await Promise.all(uploadPromises);
        
        updatedImages = uploadResults.map(result => result.url);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
            $set: {
                name,
                slug: name.toLowerCase().trim().replaceAll(' ', '-'),
                description,
                mrp: Number(mrp),
                sellingPrice: Number(sellingPrice),
                category, 
                parentProduct: parentProduct || null,
                searchTags,
                sku,
                stock: Number(stock),
                deliveryDays: Number(deliveryDays),
                images: updatedImages,
                features: parsedFeatures
            }
        },
        { 
            returnDocument: 'after'
         } 
    );

    return res
    .status(200)
    .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    for (const oldImageUrl of product.images) {
        await deleteOnCloudinary(oldImageUrl);
    }

    if (!product.parentProduct) {
        await Category.findByIdAndUpdate(product.category, {
            $inc: { productCount: -1 }
        });

        const variants = await Product.find({ parentProduct: product._id });

        for (const variant of variants) {
            for (const img of variant.images) {
                await deleteOnCloudinary(img);
            }
        }

        await Product.deleteMany({ parentProduct: product._id });
    }

    await product.deleteOne();

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product deleted successfully"))
})

const getProducts = asyncHandler(async (req, res) => {
    const { 
        category, 
        search, 
        page = 1, 
        limit = 12, 
        sort = "newest" 
    } = req.query; 

    // ---------------------------------------------
    // STAGE 1: Filtering ($match)
    // ---------------------------------------------
    const matchStage = { parentProduct: null };

    if (category) {
        // In aggregation, we must explicitly convert the string to a MongoDB ObjectId
        matchStage.category = new mongoose.Types.ObjectId(category);
    }

    if (search) {
        matchStage.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { searchTags: { $regex: search, $options: "i" } } 
        ];
    }

    // ---------------------------------------------
    // STAGE 2: Sorting ($sort)
    // ---------------------------------------------
    let sortStage = { createdAt: -1 }; 
    if (sort === "price-low") sortStage = { sellingPrice: 1 };
    if (sort === "price-high") sortStage = { sellingPrice: -1 };

    // ---------------------------------------------
    // THE PIPELINE
    // ---------------------------------------------
    const pipeline = [
        { 
            $match: matchStage 
        },
        {
            // $lookup is the aggregation equivalent of .populate()
            $lookup: {
                from: "categories", // MongoDB automatically lowercases and pluralizes your "Category" model name
                localField: "category",
                foreignField: "_id",
                as: "categoryDetails" // Temporarily store the populated data here
            }
        },
        {
            // $lookup returns an array. $unwind pulls the object out of the array.
            $unwind: "$categoryDetails" 
        },
        { 
            $sort: sortStage 
        }
    ];

    // ---------------------------------------------
    // EXECUTE PAGINATION
    // ---------------------------------------------
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    const aggregate = Product.aggregate(pipeline);
    
    // The plugin runs the pipeline and handles all the math automatically!
    const result = await Product.aggregatePaginate(aggregate, options);

    return res.status(200).json(
        new ApiResponse(200, result, "Products fetched successfully")
    );
});

const getProductBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const product = await Product.findOne({ slug }).populate("category", "name slug");

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const variants = await Product.find({ parentProduct: product._id })
        .select("name sku sellingPrice mrp stock images");

    const productData = {
        ...product.toObject(),
        variants
    };

    return res
    .status(200)
    .json(new ApiResponse(200, productData, "Product and variants fetched successfully"));
});

export {
    addCategory,
    getCategories,
    deleteCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProductBySlug
}