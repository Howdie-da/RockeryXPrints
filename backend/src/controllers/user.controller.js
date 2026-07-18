import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";

const options = {
    httpOnly: true,
    secure: true
}

const generateToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken.push(refreshToken)
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const {email, fullName, password} = req.body

    if (!email?.trim() || !fullName?.trim() || !password?.trim()) {
        throw new ApiError(400, "User credentials are missing")
    }

    const existedUser = await User.findOne({email})

    if (existedUser) {
        throw new ApiError(400, "User exists with this Email")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path

    let avatar = ""

    if (avatarLocalPath) {
        avatar = await uploadOnCloudinary(avatarLocalPath)
    }

    if (!avatar && avatarLocalPath) {
        console.log("Error uploading Avatar.")
    }

    const user = await User.create({
        email,
        fullName,
        password,
        avatar: avatar ? avatar.url : "",
    })
    
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Error while registering the user.")
    }

    const {accessToken, refreshToken} = await generateToken(user._id)

    return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(201, {
        user: createdUser,
        accessToken,
        refreshToken
    }, "User registered successfully!!"))
})

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    if (!email || !password) {
        throw new ApiError(400, "Enter User credentials.")
    }

    const user = await User.findOne({email})

    if (!user) {
        throw new ApiError(404, "Email is not registered.")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid User credentials")
    }

    const {accessToken, refreshToken} = await generateToken(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {
        user: loggedInUser,
        accessToken,
        refreshToken
    }, "User logged in Successfully"))
})

const logoutUser = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $pull: {
                refreshToken: refreshToken
            }
        },
        {
            returnDocument: 'after'
        }
    )

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"))
})

const changePassword = asyncHandler(async (req, res) => {
    const {oldPassword, newPassword} = req.body

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Enter password")
    }

    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Enter correct password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(400, "User is not authenticated.")
    }
    
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token.")
        }
    
        const isRefreshTokenValid = user.refreshToken.some((item) => item === incomingRefreshToken)
    
        if (!isRefreshTokenValid) {
            throw new ApiError(401, "Refresh Token have been expired.")
        }

        await User.findByIdAndUpdate(user._id, {
            $pull: { refreshToken: incomingRefreshToken }
        })
    
        const {accessToken, refreshToken} = await generateToken(user?._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {accessToken, refreshToken}, "Tokens have been refreshed."))
    } catch (error) {
        throw new ApiError(400, error || "Error occurred while refreshing tokens")
    }
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(200, req.user))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    let {email, fullName, addresses} = req.body

    if (!email && !fullName && !addresses) {
        throw new ApiError(400, "Enter a valid credential")
    }

    const updateFields = {};
    if (email) updateFields.email = email;
    if (fullName) updateFields.fullName = fullName;
    if (addresses) updateFields.addresses = addresses;

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: updateFields
        },
        {
            returnDocument: 'after'
        }
    ).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(500, "Internal Error Occurred.")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account Details Updated."))
})

const updateAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.files?.avatar?.[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Upload avatar file.")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar) {
        throw new ApiError(500, "Error uploading avatar.")
    }

    await deleteOnCloudinary(req.user?.avatar)

    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, "Avatar file uploaded successfully."))
})

const getUserCart = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id).populate(
        "cart.product", 
        "name sellingPrice mrp images slug stock"
    )

    return res
    .status(200)
    .json(new ApiResponse(200, user.cart, "Cart fetched successfully"));
})

const addToCart = asyncHandler(async (req, res) => {
    const {productId, quantity = 1} = req.body

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (product.stock < quantity) {
        throw new ApiError(400, "Not enough stock available");
    }

    const user = await User.findById(req.user._id);

    const existingCartItemIndex = user.cart.findIndex((item) => item.product.toString() === productId.toString())

    if (existingCartItemIndex > -1) {
        user.cart[existingCartItemIndex].quantity += Number(quantity);
        
        if (user.cart[existingCartItemIndex].quantity > product.stock) {
            user.cart[existingCartItemIndex].quantity = product.stock;
        }
    } else {
        user.cart.push({ product: productId, quantity: Number(quantity) });
    }

    await user.save({ validateBeforeSave: false });

    return res
    .status(200)
    .json(new ApiResponse(200, user.cart, "Item added to cart"));
})

const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: { cart: { product: productId } }
        },
        { 
            returnDocument: 'after'
        }
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, user.cart, "Item removed from cart"));
})

export {
    registerUser,
    loginUser,
    logoutUser,
    changePassword,
    refreshAccessToken,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar,
    getUserCart,
    addToCart,
    removeFromCart
}