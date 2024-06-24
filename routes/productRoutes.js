const express = require('express');
const {createProduct, getAllProducts} = require("../controllers/productController");
const {uploadProductImage} = require("../controllers/uploadsController");

const router = express.Router();

router.route('/')
    .get(getAllProducts)
    .post(createProduct)

router.post('/uploads', uploadProductImage);

module.exports = {router};