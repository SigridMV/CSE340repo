const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  //console.log(data.rows)
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
      grid += '<li id="vehicles-cards">';
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
        ' on CSE Motors" /></a>';

      grid += '<div class="namePrice">';
      grid += '<hr id="line" />';
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
    ' on CSE Motors"/>';
  grid += '<div class="detail-cont">';
  grid +=
    "<h2>" + vehicle.inv_make + " " + vehicle.inv_model + " Details" + "</h2>";
  grid += '<ul class="vehicle-details">';
  grid +=
    '<li class="list-space">' +
    '<span class="bold">Price: </span>' +
    '<span class="bold">$' +
    new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
    '</span>' +
    "</li>";
  grid +=
    '<li class="list-space">'  +
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

module.exports = Util;
