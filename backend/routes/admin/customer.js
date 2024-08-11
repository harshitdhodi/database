const express = require("express");
const router = express.Router();
const mongoose =require('mongoose');
// import userRegistration  from "../controller/userController.js";
const fs = require('fs');
const path = require('path');

const {
  userRegistration,
  logoutUser,
  userLogin,
  sendUserPasswordResetEmail,
  userPasswordReset,
  getUserById,
  updateUserById,
  updateUserByObjectId,
  getUser,
  getUserByObjectId,
  deleteUserById
} = require("../../controller/admin/customer.js");
const {uploadLogo} = require('../../middleware/logoUpload.js');
const { requireAuth } = require("../../middleware/admin/requireAuth.js");

//public Routes
router.post("/register",uploadLogo, userRegistration);
router.post("/login", userLogin);
router.post("/forgot-password", sendUserPasswordResetEmail);
router.post("/reset-password", userPasswordReset);
router.post("/logout", logoutUser);
router.get("/getUserById",requireAuth, getUserById);
router.get("/getUser",getUser);
router.get("/get",getUserByObjectId);
router.put("/updateUser",uploadLogo,requireAuth, updateUserById);
router.put("/updateUserByid",uploadLogo, updateUserByObjectId);
router.delete("/delete",deleteUserById);
// export default router;


// Define route to download all collections



module.exports = router;
