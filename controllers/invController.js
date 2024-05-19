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
    // Handle errors appropriately
    next(error);
  }
};

invCont.buildAddClassification = async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

invCont.addNewClassification = async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
    const { add_classification } = req.body;

    // Check if the classification already exists
    const exists = await invModel.checkExistingClassification(
      add_classification
    );
    if (exists) {
      req.flash(
        "notice",
        "Classification with that name already exists. Please try a different name."
      );
      return res.status(400).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: [{ msg: "Classification with that name already exists." }],
      });
    }

    // Add new classification
    const result = await invModel.addClassification(add_classification);
    if (result) {
      req.flash(
        "notice",
        `Successfully added the ${add_classification} classification!`
      );
      return res.status(201).redirect("/inv");
    } else {
      req.flash(
        "notice",
        "Failed to add the classification. Please try again."
      );
      return res.status(500).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: [{ msg: "Failed to add the classification." }],
      });
    }
  } catch (error) {
    next(error);
  }
};

invCont.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    let selectList = await utilities.getClassifications();
    res.render("./inventory/add-inventory.ejs", {
      title: "Add New Inventory",
      nav,
      selectList,
      errors: null,
    });
  } catch (error) {
    // Handle errors appropriately
    next(error);
  }
};

invCont.AddNewInventory = async function (req, res, next) {
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
