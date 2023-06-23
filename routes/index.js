var express = require("express");
var router = express();
var bodyParser = require("body-parser");
var bcrypt = require("bcrypt");
// -------------------------- body parser -----------------------------------------
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
router.use(bodyParser.json());

// ============ ejs view engine ===================================

router.set("view engine", "ejs");

/* --------------------------------- GET home page.-------------------------- */
router.get("/", function (req, res, next) {
  res.render("index");
});

router.post("/login", async function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  try {
    // const useremail = await user.find({ email: email });

    var data = await user.find({ email: email });

    bcrypt.compare(password, data[0].password, function (err, result) {
      if (result == true) {
        return res.render("dashboard");
      } else {
        console.log("check your password");
        res.send("check your password");
        console.log(err);
      }
    });
  } catch (error) {
    res.send("invalid email");

    console.log(error);
  }
});

// ----------------------------------- register routing --------------------------------------------

router.get("/register", function (req, res, next) {
  res.render("register");
});

// ------------------------------------ register schema -----------------------------------------------

var mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/project-2022");

const userschema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  city: {
    type: String,
  },
  gender: {
    type: String,
  },
  hobby: {
    type: Array,
  },
  contact: {
    type: Number,
    unique: true,
  },
  password: {
    type: String,
    unique: true,
  },
});

const user = mongoose.model("user", userschema);
module.exports = user;

router.post("/register", async function (req, res, next) {
  try {
    var bpass = await bcrypt.hash(req.body.password, 10);
    const data_obj = {
      name: req.body.name,
      email: req.body.email,
      city: req.body.city,
      gender: req.body.gender,
      hobby: req.body.hobby,
      contact: req.body.contact,
      password: bpass,
    };

    var data = await user.create(data_obj);

    res.status(200).json({
      status: "succes",
      data,
    });
  } catch (error) {
    error;
  }
});

// ===================================== dashboard routing ======

router.get("/dashboard", function (req, res, next) {
  res.render("dashboard");
});
module.exports = router;
