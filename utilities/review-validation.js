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
  try {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new Error("Provide review text of at least 10 characters.")
    }
    next()
  } catch (error) {
    console.error(`Error checking review: ${error.message}`)
    req.flash("message warning", error.message)
    res.redirect(`/inv/detail/${inv_id}`)
  }
}

module.exports = validate
