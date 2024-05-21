const invModel = require("../models/inventory-model");
const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  ************************************
 *  Classification Data Validation Rules
 *  ********************************* */
validate.classificationRules = () => {
  return [
    body("add_classification")
      .trim()
      .isLength({ min: 4 })
      .matches(/^[^\s]+$/, "g")
      .withMessage("Provide a correct classification name")
      .custom(async (add_classification) => {
        const classificationExists =
          await invModel.checkExistingClassification(add_classification);
        if (classificationExists) {
          throw new Error(
            "Classification with that name already exists. Please try different name.",
          );
        }
      }),
  ];
};

/*  *******************************
 *  Inventory Data Validation Rules
 * ***************************** */
validate.inventoryRules = () => {
  return [
    // vehicle make
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please enter a valid vehicle make."),
    // vehicle model
    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please enter a valid vehicle model."),
    // vehicle year
    body("inv_year")
      .trim()
      .isLength({ max: 4, min: 4 })
      .withMessage("Please enter a valid vehicle year."),
    // vehicle description
    body("inv_description")
      .trim()
      .isLength({ max: 150, min: 1 })
      .withMessage("Please enter a valid vehicle description."),
    // vehicle image
    body("inv_image")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please enter a valid vehicle image."),
    // vehicle thumbnail
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please enter a valid vehicle thumbnail."),
    // vehicle price
    body("inv_price")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please enter a valid vehicle price."),
    // vehicle mileage
    body("inv_miles")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please enter a valid vehicle miles."),
    // vehicle color
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please enter a valid vehicle color."),
  ];
};

/* ******************************************************************
 * Check data and return errors or continue to add new classification
 * *************************************************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { add_classification } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      add_classification,
    });
    return;
  }
  next();
};

/* *************************************************************
 * Check data and return errors or continue to add new inventory
 * ********************************************************** */
validate.checkInventoryData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let selectList = await utilities.getClassifications();
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      selectList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

module.exports = validate;