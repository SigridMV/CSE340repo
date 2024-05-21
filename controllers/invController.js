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
    const { classification_id } = req.body
    const selectList = await utilities.getClassifications(classification_id)
    res.render("./inventory/management.ejs", {
      title: "Vehicle Management",
      selectList,
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
  let nav = await utilities.getNav();
  let selectList = await utilities.getClassifications();
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    selectList,
    errors: null,
  });
};

invCont.addNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { add_classification } = req.body;
  const classResult = await invModel.addClassification(add_classification);
  if (classResult) {
    req.flash(
      "notice",
      `The ${add_classification} classification was successfully added!`,
    );
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    req.flash(
      "notice",
      "Sorry, that classification did not work. Please try again",
    );
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  }
};

invCont.addNewInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
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
    classification_id,
  } = req.body;

  const invResult = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (invResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve added ${inv_make} ${inv_model} to the inventory!\n`
    );
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    req.flash(
      "notice",
      "Sorry, there was an issue adding a new vehicle. Please try again."
    );
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
    });
  }
};

module.exports = invCont;
