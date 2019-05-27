const express = require("express");
var multer = require('multer');
const router = express.Router();

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public')
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' +file.originalname )
	}
})

var upload = multer({ storage: storage }).single('file')

router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

router.post("/upload", (req, res) => {
	console.log('allo');
	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			return res.status(500).json(err)
		} else if (err) {
			return res.status(500).json(err)
		}
		return res.status(200).send(req.file)
	})
})

module.exports = router;