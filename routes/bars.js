const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const Bar = require('../models/Bar')
const {isLoggedIn, isAuthor, validateBar} = require('../middleware');
const { populate } = require('../models/Bar');
const bars = require('../controllers/bars')
const multer = require('multer')
const { storage } = require('../cloudinary/index')
const upload =  multer({ storage })

router.get('/bars',  catchAsync(bars.index))
router.get('/bars/new', isLoggedIn, bars.renderNewForm)
router.post('/bars', isLoggedIn, upload.array('image'), validateBar, catchAsync(bars.createBar))
router.get('/bars/:id', catchAsync(bars.showBar))
router.get('/bars/:id/edit', isLoggedIn, isAuthor, catchAsync(bars.renderEditForm))
router.put('/bars/:id', isLoggedIn, isAuthor, upload.array('image'), validateBar, catchAsync(bars.updateBar))
router.delete('/bars/:id', isLoggedIn, isAuthor,  catchAsync(bars.deleteBar))

module.exports = router;