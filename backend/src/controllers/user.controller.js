import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/ApiResponse";

const options = {
    httpOnly: true,
    secure: true
}

const generateToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
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

    return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully!!"))
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

export {
    registerUser,
    loginUser,
    logoutUser
}