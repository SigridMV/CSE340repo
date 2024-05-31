const jwt = require("jsonwebtoken");
require("dotenv").config();
const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

Util.getClassifications = async function (classification_id) {
  try {
    let data = await invModel.getClassificationsById(classification_id);
    let selectList =
      '<select name="classification_id" id="select_classification" class="select-classification">';
    selectList +=
      '<option value="" disabled selected>Choose a Classification</option>';
    data.rows.forEach((row) => {
      selectList +=
        '<option id="' +
        row.classification_id +
        '" value=' +
        row.classification_id +
        ">" +
        row.classification_name +
        "</option>";
    });
    selectList += "</select>";
    return selectList;
  } catch (error) {
    console.error("Error in Util.getClassifications:", error);
    return "";
  }
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid = "";
  if (data.length > 0) {
    grid += '<div id="inv-display">';
    let counter = 0;
    data.forEach((vehicle) => {
      if (counter % 3 === 0) {
        grid +=
          '<ul style="list-style-type: none; display: flex; flex-wrap: wrap;">';
      }
      grid += '<li class="vehicles-cards">';
      grid +=
        '<a  href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" ></a>';

      grid += '<div class="namePrice">';
      grid += '<hr class="line" >';
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
      counter++;
      if (counter % 3 === 0 || counter === data.length) {
        grid += "</ul>";
      }
    });
    grid += "</div>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* ***********************************
 * Build individual vehicle view HTML
 *************************************/
Util.buildModelGrid = async function (data) {
  const vehicle = data[0];
  let grid = '<section class="vehicle-cont">';
  grid +=
    '<img class="vehicle-imagen" src="' +
    vehicle.inv_image +
    '" alt="Image of ' +
    vehicle.inv_make +
    " " +
    vehicle.inv_model +
    ' on CSE Motors">';
  grid += '<div class="detail-cont">';
  grid +=
    "<h2>" + vehicle.inv_make + " " + vehicle.inv_model + " Details" + "</h2>";
  grid += '<ul class="vehicle-details">';
  grid +=
    '<li class="list-space">' +
    '<span class="bold">Price: </span>' +
    '<span class="bold">$' +
    new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
    "</span>" +
    "</li>";
  grid +=
    '<li class="list-space">' +
    '<span class="bold">' +
    "Description: " +
    "</span>" +
    vehicle.inv_description +
    "</li>";
  grid +=
    '<li class="list-space">' +
    '<span class="bold">' +
    "Color: " +
    "</span>" +
    vehicle.inv_color +
    "</li>";
  grid +=
    '<li class="list-space">' +
    '<span class="bold">' +
    "Miles: " +
    "</span>" +
    new Intl.NumberFormat("en-US").format(vehicle.inv_miles) +
    "</li>";
  grid += "</ul>";
  grid += "</div>";
  grid += "</section>";
  return grid;
};

Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

Util.buildReviewList = function(data){
  let list = '<ul id="rvw-display">'
  if(data.length > 0){
    data.forEach(review => { 
      let reviewDate = new Date(review.review_date)
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      let displayDate = reviewDate.toLocaleDateString('en-US', options)
      list += `<li>
      <strong>${review.account_firstname.slice(0,1)}${review.account_lastname}</strong>&nbsp;wrote on ${displayDate}
      <hr />
      <div>
      ${review.review_text}
      </div>
      </li>`
    })
    list += '</ul>'
  } else { 
    list = '<p class="notice">Be the first to write a review.</p>'
  }
  return list
}

Util.buildAccountReviewList = function(reviews){
  let list = '<ol>'
  if(reviews.length > 0){
    reviews.forEach(review => { 
      let reviewDate = new Date(review.review_date)
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      let displayDate = reviewDate.toLocaleDateString('en-US', options)
      list += `<li>Reviewed the 
      ${review.inv_year} ${review.inv_make} ${review.inv_model}&nbsp;on ${displayDate} | <a href="/review/edit/${review.review_id}">Edit</a> | <a href="/review/remove/${review.review_id}">Delete</a>
      </li>`
    })
    list += '</ol>'
  } else { 
    list = '<p class="notice">You have not written any reviews.</p>'
  }
  return list
 }

module.exports = Util;
