// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const regValidate = require("../utilities/inventory-validation");

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
router.get(
  "/",
  regValidate.checkAccountAccess,
  utilities.handleErrors(invController.buildManagement)
);

// Route to build add-classification view
router.get(
  "/add-classification",
  regValidate.checkAccountAccess,
  utilities.handleErrors(invController.buildAddClassification)
);

router.post(
  "/add-classification",
  regValidate.checkAccountAccess,
  regValidate.classificationRules(),
  regValidate.checkClassificationData,
  utilities.handleErrors(invController.addNewClassification)
);

router.get(
  "/add-inventory",
  regValidate.checkAccountAccess,
  utilities.handleErrors(invController.buildAddInventory)
);

router.post(
  "/add-inventory",
  regValidate.inventoryRules(),
  regValidate.checkInventoryData,
  utilities.handleErrors(invController.addNewInventory)
);

router.get(
  "/management",
  regValidate.checkAccountAccess,
  utilities.handleErrors(invController.buildManagement)
);

router.get(
  "/getInventory/:classification_id",
  regValidate.checkAccountAccess,
  utilities.handleErrors(invController.getInventoryJSON)
);

router.get(
  "/edit/:inv_id",
  regValidate.checkAccountAccess,
  utilities.handleErrors(invController.editInventoryView)
);

router.post(
  "/update/",
  regValidate.checkAccountAccess,
  regValidate.inventoryRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

router.get("/delete/:inv_id", regValidate.checkAccountAccess, utilities.handleErrors(invController.deleteView));

router.post("/delete", regValidate.checkAccountAccess, utilities.handleErrors(invController.deleteItem));

module.exports = router;
