const path = require("path");
const express = require("express");
const hbs = require("hbs");
const forecast = require("./utils/forecast");
const geocode = require("./utils/geocode");

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const PUBLIC_DIRECTORY_PATH = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup Handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(PUBLIC_DIRECTORY_PATH));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Daniel B",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Daniel B",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Daniel B",
    message: "I love Colleen Cole",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Please provide and address",
    });
  }

  const address = req.query.address;
  // Get the long and lat for the address passed by the query string
  geocode(address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error });
    }

    // Get the forecast for the location
    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }
      res.send({
        forecast: forecastData,
        location,
        address,
      });
    });
  });
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "Search term is required",
    });
  }
  console.log(req.query.search);
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "Help",
    errorMessage: "Help article not found",
    name: "Daniel B",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    errorMessage: "Page not found",
    name: "Daniel B",
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
