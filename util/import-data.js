const dotenv = require("dotenv");
const fs = require("fs");
const mongoose = require("mongoose");
const Products = require("../models/product");
const User = require("../models/user");

dotenv.config({
    path: "../.env",
});
const DB = process.env.DB;
mongoose
    .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("DB connection successful!");
    });

const data = JSON.parse(fs.readFileSync("./data-product", "utf-8"));

const importData = async () => {
    try {
        await Products.create(data);
        console.log("Data successfully loaded!");
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await Products.deleteMany();
        console.log("Data successfully deleted!");
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === "--import") {
    importData();
} else if (process.argv[2] === "--delete") {
    deleteData();
}

// const data = JSON.parse(fs.readFileSync("./data-product.json", "utf-8"));
// const productType = data.map((item) => item.productType);

// const uniqueProductType = productType.filter((obj, index) => {
//     return productType.findIndex((item) => item.main === obj.main) === index;
// });

// console.log(JSON.stringify(uniqueProductType));
