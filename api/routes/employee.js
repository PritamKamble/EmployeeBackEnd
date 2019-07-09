
const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const EmpController = require('../controllers/employee');
const multer=require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });
  


router.get("/", EmpController.emp_get_all);

router.post("/", upload.single('employeeImage'), EmpController.emp_create_emp);

router.get("/:empId", EmpController.emp_get_emp);

router.patch("/:empId", upload.single('employeeImage'), EmpController.emp_update_emp);

router.delete("/:empId", EmpController.emp_delete);

module.exports = router;