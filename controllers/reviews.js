const Review = require('../models/review')
const Bar = require('../models/Bar')

module.exports.createReview = async(req, res) => {
    const bar = await Bar.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id
    bar.reviews.push(review);
    await review.save()
    await bar.save()
    req.flash('success', 'Successfully added review.')
    res.redirect(`/bars/${bar._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Bar.findByIdAndUpdate( id, { $pull: { reviews: reviewId } } );
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review.')
    res.redirect(`/bars/${id}`)
}

