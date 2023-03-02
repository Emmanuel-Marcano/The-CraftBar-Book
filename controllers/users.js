const User = require('../models/user')
const Bar = require('../models/Bar')


module.exports.renderRegisterForm = (req, res) => {
   // const bar = Bar.findByIdAndDelete('63a0be41fb0c21ace1318fd4')
   // console.log(bar)
    res.render('users/register')
}

module.exports.register = async (req, res, next) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.logIn(registeredUser, (error) => {
            if(error) return next(error)
            req.flash('success', 'Welcome to the Craft Bar community! Feel free to submit a bar you have enjoyed recently. Please be as detailed as possible when creating reviews, it will help others!')
            res.redirect('/bars')
        })
    } catch(e){
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.renderLogInForm = (req, res) => {
    Bar.de
    res.render('users/login')
}

module.exports.logIn = async (req, res) => {
    req.flash('success', `Welcome back, ${req.user.username}.`)
    const redirectUrl = req.session.returnTo || '/bars'
    res.redirect(redirectUrl)
}

module.exports.logOut = (req, res) => {
    req.logout(()=> {
        req.flash('success', 'Logged out. Goodbye!')
        res.redirect('/bars')

    });
}