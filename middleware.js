const Bar = require('./models/Bar')
const Review = require('./models/review')
const ExpressError = require('./utils/ExpressError')
const {barSchema, reviewSchema} = require('./schemas')


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must sign in to do that!')
        return res.redirect('/login')
    }
    next();
}


module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const foundbar = await Bar.findById(id)
    if(!foundbar.author.equals(req.user._id)){
        req.flash('error', 'You do not have permissions to do that.')
        return res.redirect(`/bars/${id}`)
    }
    next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const foundreview = await Review.findById(reviewId)
    if(!foundreview.author.equals(req.user._id)){
        req.flash('error', 'You do not have permissions to do that.')
        return res.redirect(`/bars/${id}`)
    }
    next()
}

module.exports.validateBar = (req, res, next) => {
    const { error } = barSchema.validate(req.body)
    if(error){
     const msg = error.details.map(el => el.message).join(',')
     throw new ExpressError(msg, 400)
    } else {
     next()
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)

    if(error){
     const msg = error.details.map(el => el.message).join(',')
     throw new ExpressError(msg, 400)
    } else {
     next()
    }
}



