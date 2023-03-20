const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const users = require('../controllers/users')

router.get('/register', users.renderRegisterForm)
router.post('/register', catchAsync(users.register))
router.get('/login', users.renderLogInForm)
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login' }) , catchAsync(users.logIn))
router.get('/logout' , users.logOut)

module.exports = router

