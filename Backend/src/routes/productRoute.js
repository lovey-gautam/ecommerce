import express from "express";
import { addProduct, deleteProduct, getAllProduct, updateProduct } from "../controllers/product/productController.js";
import { isAdmin, isAuthenticated } from "../isAuthenticated/isAuthenticated.js";
import multer from "multer";
import { multipleUpload } from "../controllers/middleware/multer.js";


const router = express.Router();
const upload = multer(); // memory storage

router.post("/add", isAuthenticated, upload.array("files"), addProduct);
//router.post("/add", isAuthenticated,("file, addProduct);
router.get("/getallproducts", getAllProduct);
router.delete('/delete/:productId',isAuthenticated,isAdmin,deleteProduct);
router.put("/update/:productId",isAuthenticated,isAdmin,multipleUpload,updateProduct)
export default router;