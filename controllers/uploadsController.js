const {StatusCodes} = require("http-status-codes");
const path = require("path");
const {BadRequestError} = require("../errors");
const cloudinary = require('cloudinary').v2;
const fs = require('node:fs');
const uploadProductImageLocal = async (req, res) => {
    // check if file exists
    if (!req.files){
        throw new BadRequestError('No File Uploaded.')
    }
    // check format
    if (!req.files.image.mimetype.startsWith('image/')){
        throw new BadRequestError('File is not image.')
    }
    // check size
    const maxSize = 1024 * 1024;
    if (req.files.image.size > maxSize){
        throw new BadRequestError('Please upload image smaller than 1KB.')
    }
    // 1) Save uploaded image object into variable
    const image = req.files.image;
    // 2) Create path where we need to save uploaded image
    const imagePath = path.join(__dirname, '../public/uploads/' + image.name);
    await image.mv(imagePath);
    return res
        .status(StatusCodes.OK)
        .json({image: {src: `/uploads/${image.name}`}})
}

const uploadProductImage = async (req, res) => {
    const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
            use_filename: true,
            folder: 'file-upload',
        }
    );
    fs.unlinkSync(req.files.image.tempFilePath);
    return res.status(StatusCodes.OK).json({image: {src: result.secure_url}});
}


module.exports = {
    uploadProductImage,
}