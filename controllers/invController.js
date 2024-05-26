const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    console.error("Error in buildByClassificationId function:", error);
    res.status(500).send("Internal Server Error");
  }
};

invCont.buildByModelId = async function (req, res, next) {
  try {
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
  } catch (error) {
    console.error("Error in buildByModelId function:", error);
    res.status(500).send("Internal Server Error");
  }
};

invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const { classification_id } = req.body;
    const selectList = await utilities.getClassifications(classification_id);
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      selectList,
      errors: null,
    });
  } catch (error) {
    console.error("Error in buildManagement function:", error);
    res.status(500).send("Internal Server Error");
  }
};

invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    });
  } catch (error) {
    console.error("Error in buildAddClassification function:", error);
    res.status(500).send("Internal Server Error");
  }
};

invCont.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    let selectList = await utilities.getClassifications();
    res.render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      selectList,
      errors: null,
    });
  } catch (error) {
    console.error("Error in buildAddInventory function:", error);
    res.status(500).send("Internal Server Error");
  }
};

invCont.addNewClassification = async function (req, res, next) {
  try {
    const { add_classification } = req.body;
    const classification_id = req.body.classification_id;
    const classResult = await invModel.addClassification(add_classification);
    if (classResult) {
      let nav = await utilities.getNav();
      let selectList = await utilities.getClassifications();
      req.flash(
        "notice",
        `Congratulations, you\'ve created the ${add_classification} classification!`
      );
      res.status(201).render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        selectList: selectList, 
        errors: null,
      });
    } else {
      req.flash(
        "notice",
        "Sorry, that classification did not work. Please try again"
      );
      res.status(501).render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        selectList: selectList, 
        errors: null,
      });
    }
  } catch (error) {
    console.error("Error in addNewClassification function:", error);
    res.status(500).send("Internal Server Error");
  }
};

invCont.addNewInventory = async function (req, res, next) {
  try {
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
  } catch (error) {
    console.error("Error in addNewInventory function:", error);
    res.status(500).send("Internal Server Error");
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = parseInt(req.params.classification_id);
    const invData = await invModel.getInventoryByClassificationId(
      classification_id
    );
    if (invData[0].inv_id) {
      return res.json(invData);
    } else {
      next(new Error("No data returned"));
    }
  } catch (error) {
    console.error("Error in getInventoryJSON function:", error);
    res.status(500).send("Internal Server Error");
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  try {
    const model_id = req.params.inv_id;
    let nav = await utilities.getNav();
    const itemData = await invModel.getModelById(model_id);
    const selectedItemData = itemData[0];
    const selectList = await utilities.getClassifications(
      itemData.classification_id
    );
    const itemName = `${selectedItemData.inv_make} ${selectedItemData.inv_model}`;
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      selectList: selectList,
      errors: null,
      inv_id: selectedItemData.inv_id,
      inv_make: selectedItemData.inv_make,
      inv_model: selectedItemData.inv_model,
      inv_year: selectedItemData.inv_year,
      inv_description: selectedItemData.inv_description,
      inv_image: selectedItemData.inv_image,
      inv_thumbnail: selectedItemData.inv_thumbnail,
      inv_price: selectedItemData.inv_price,
      inv_miles: selectedItemData.inv_miles,
      inv_color: selectedItemData.inv_color,
      classification_id: selectedItemData.classification_id,
    });
  } catch (error) {
    console.error("Error in editInventoryView function:", error);
    res.status(500).send("Internal Server Error");
  }
};

invCont.updateInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body;

    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    );

    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model;
      req.flash("notice", `The ${itemName} was successfully updated.`);
      res.redirect("/inv/");
    } else {
      const selectList = await utilities.getClassifications(classification_id);
      const itemName = `${inv_make} ${inv_model}`;
      req.flash("notice", "Sorry, the insert failed.");
      res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        selectList: selectList,
        errors: null,
        inv_id,
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
      });
    }
  } catch (error) {
    console.error("Error in updateInventory function:", error);
    res.status(500).send("Internal Server Error");
  }
};

invCont.deleteView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    const itemData = await invModel.getModelById(inv_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_price: itemData.inv_price,
      inv_year: itemData.inv_year,
    });
  } catch (error) {
    console.error("Error in deleteView function:", error);
    res.status(500).send("Internal Server Error");
  }
};

invCont.deleteItem = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const inv_id = parseInt(req.body.inv_id);

    const deleteResult = await invModel.deleteInventoryItem(inv_id);
    if (deleteResult) {
      req.flash("notice", "The deletion was successful.");
      res.redirect("/inv/");
    } else {
      req.flash("notice", "Sorry, the delete failed.");
      res.redirect("/inv/delete/inv_id");
    }
  } catch (error) {
    console.error("Error in deleteItem function:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = invCont;
