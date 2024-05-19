// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build inventory view
router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(invController.buildByModelId)
);

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagement));

router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
);

router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
);

// router.post(
//   "/add-classification",
//   regValidate.classificationRules(),
//   regValidate.checkClassificationData,
//   utilities.handleErrors(invController.addNewClassification)
// );

module.exports = router;
