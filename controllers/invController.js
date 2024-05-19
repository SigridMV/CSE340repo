const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

invCont.buildByModelId = async function (req, res, next) {
  const model_id = req.params.inventoryId;
  const data = await invModel.getModelById(model_id);
  const grid = await utilities.buildModelGrid(data);
  let nav = await utilities.getNav();
  const vehicle =
    data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model;
  res.render("./inventory/inventory.ejs", {
    title: vehicle,
    nav,
    grid,
  });
};

invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("./inventory/management.ejs", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

invCont.buildAddInventory = async function (req, res, next) {
  // const vehicle_id = req.params.vehicleId
  let nav = await utilities.getNav();
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    errors: null,
  });
};

module.exports = invCont;
