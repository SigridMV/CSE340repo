const utilities = require(".")
const invCont = require("../controllers/invController")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Review Validation Rule
 *  ********************************* */
validate.reviewRule = () => {
  return [
    // name is required and must be string
    body("review_text")
      .trim()
      .notEmpty()
      .escape()
      .isLength({ min: 5 })
      .isString()
      .withMessage("Provide review text of at least 5 characters."),
  ]
}

/* ******************************
 * Check and return error or continue to insert review
 * ***************************** */
validate.checkReview = async (req, res, next) => {
  const { inv_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash("message warning", "Provide review text of at least 10 characters.")
  res.redirect(`/inv/detail/${inv_id}`)
    return
  }
  next()
}

validate.newInventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .isInt({
        no_symbols: true,
      })
      .withMessage("The vehicle's classification is required."),

    body("inv_make")
      .trim()
      .escape()
      .isLength({
        min: 3,
      })
      .withMessage("A vehicle make is required."),

    body("inv_model")
      .trim()
      .escape()
      .isLength({
        min: 3,
      })
      .withMessage("A vehicle model is required."),

    body("inv_description")
      .trim()
      .escape()
      .isLength({
        min: 3,
      })
      .withMessage("A vehicle description is required."),

    body("inv_image")
      .trim()
      .isLength({
        min: 6,
      })
      .withMessage("A vehicle image path is required."),

    body("inv_thumbnail")
      .trim()
      .isLength({
        min: 6,
      })
      .withMessage("A vehicle thumbnail path is required."),

    body("inv_price")
      .trim()
      .isDecimal()
      .withMessage("A vehicle price is required."),

    body("inv_year")
      .trim()
      .isInt({
        min: 1900,
        max: 2099,
      })
      .withMessage("A vehicle year is required."),

    body("inv_miles")
      .trim()
      .isInt({
        no_symbols: true,
      })
      .withMessage("The vehicle's miles is required."),

    body("inv_color")
      .trim()
      .escape()
      .isLength({
        min: 3,
      })
      .withMessage("The vehicle's color is required."),
  ]
}

validate.checkUpdateData = async (req, res, next) => {
  const {
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
    inv_id,
  } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    )
    res.render("inventory/edit-inventory", {
      errors,
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      classificationSelect,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      inv_id,
    })
    return
  }
  next()
}

module.exports = validate
