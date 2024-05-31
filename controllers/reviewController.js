const rvwModel = require("../models/review-model")
const utilities = require("../utilities/")
const rvwCont = {}

/* ***************************
 *  Add new review
 * ************************** */
rvwCont.insertReview = async function (req, res, next) {
  const { review_text, account_id, inv_id } = req.body
  try {
    const insertResult = await rvwModel.insertReview(review_text, account_id, inv_id)
  
    if (insertResult) {
      req.flash("message success", "Review added successfully.")
      res.redirect(`/inv/detail/${inv_id}`)
    } else {
      throw new Error("Failed to insert review.")
    }
  } catch (error) {
    console.error(`Error inserting review: ${error.message}`)
    req.flash("message warning", "Sorry, add review failed.")
    res.redirect(`/inv/detail/${inv_id}`)
  }
}

/* ***************************
 *  Edit review
 *  Begins edit process
 * ************************** */
rvwCont.editReview = async function (req, res, next) {
  const review_id = req.params.review_id
  try {
    const review = await rvwModel.getReviewById(review_id)
  
    if (review) {
      let reviewDate = new Date(review.review_date)
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      let displayDate = reviewDate.toLocaleDateString('en-US', options)

      res.render("review/edit", {
        title: `Edit ${review.inv_year} ${review.inv_make} ${review.inv_model} Review`,
        nav: await utilities.getNav(),
        review_id: review.review_id,
        review_text: review.review_text,
        review_date: displayDate,
        errors: null
      })
    } else {
      throw new Error("Review not found.")
    }
  } catch (error) {
    console.error(`Error editing review: ${error.message}`)
    req.flash("message warning", "No review found.")
    res.redirect(`/account/`)
  }
}

/* ***************************
 *  Update review
 *  Updates review in DB
 * ************************** */
rvwCont.updateReview = async function (req, res, next) {
  const { review_text, review_id } = req.body
  try {
    const updateResult = await rvwModel.updateReview(review_id, review_text)
  
    if (updateResult) {
      req.flash("message success", "Review updated successfully.")
      res.redirect(`/account/`)
    } else {
      throw new Error("Failed to update review.")
    }
  } catch (error) {
    console.error(`Error updating review: ${error.message}`)
    req.flash("message warning", "Sorry, review update failed.")
    res.redirect(`/review/edit/${review_id}`)
  }
}

/* ***************************
 *  Remove review
 *  Begins deletion process
 * ************************** */
rvwCont.removeReview = async function (req, res, next) {
  const review_id = req.params.review_id
  try {
    const review = await rvwModel.getReviewById(review_id)
  
    if (review) {
      let reviewDate = new Date(review.review_date)
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      let displayDate = reviewDate.toLocaleDateString('en-US', options)

      res.render("review/delete", {
        title: `Delete ${review.inv_year} ${review.inv_make} ${review.inv_model} Review`,
        nav: await utilities.getNav(),
        review_id: review.review_id,
        review_text: review.review_text,
        review_date: displayDate,
      })
    } else {
      throw new Error("Review not found.")
    }
  } catch (error) {
    console.error(`Error removing review: ${error.message}`)
    req.flash("message warning", "No review found.")
    res.redirect(`/account/`)
  }
}

/* ***************************
 *  Delete review
 *  Deletes review from DB
 * ************************** */
rvwCont.deleteReview = async function (req, res, next) {
  const { review_id } = req.body
  try {
    const deleteResult = await rvwModel.deleteReview(review_id)
  
    if (deleteResult) {
      req.flash("message success", "Review deleted successfully.")
      res.redirect(`/account/`)
    } else {
      throw new Error("Failed to delete review.")
    }
  } catch (error) {
    console.error(`Error deleting review: ${error.message}`)
    req.flash("message warning", "Sorry, review deletion failed.")
    res.redirect(`/review/remove/${review_id}`)
  }
}

/* ***************************
 *  Get reviews by inventory id
 * ************************** */
rvwCont.getReviewsBymodel_id = async function (req, res, next) {
  const inv_id = req.params.inv_id
  try {
    const reviews = await rvwModel.getReviewsBymodel_id(inv_id)
    const reviewList = utilities.buildReviewList(reviews)
    return reviewList
  } catch (error) {
    console.error(`Error getting reviews by inventory id: ${error.message}`)
    next(error)
  }
}

/* ***************************
 *  Get reviews by account id
 * ************************** */
rvwCont.getReviewsByAccountId = async function (req, res, next) {
  const account_id = req.params.account_id
  try {
    const reviews = await rvwModel.getReviewsByAccountId(account_id)
    const reviewList = utilities.buildAccountReviewsList(reviews)
    return reviewList
  } catch (error) {
    console.error(`Error getting reviews by account id: ${error.message}`)
    next(error)
  }
}

module.exports = rvwCont