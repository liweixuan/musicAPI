var express = require('express');
var router  = express.Router();
var fs      = require("fs");
var moment  = require("moment");

//首页
router.get('/', function(req, res) {
	res.render("index", {
		title: "首页"
	});
});


module.exports = router;