const Bar = require('../models/Bar')
const {cloudinary} = require('../cloudinary')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN

const geocoder = mbxGeocoding({accessToken: mapBoxToken})


module.exports.index = async (req,res) => {
    const bars = await Bar.find({})
    res.render('bars/index', { bars })
}

module.exports.renderNewForm = (req, res) => {

    res.render('bars/new')
}

module.exports.createBar = async(req, res, next) => {

    const geoData = await geocoder.forwardGeocode({
        query: req.body.bar.location,
        limit: 1
    }).send()

   
     const bar = new Bar(req.body.bar);
     bar.geometry = geoData.body.features[0].geometry
     bar.images = req.files.map( (f) => {

        return {
            url: f.path,
            filename: f.filename
        }

     } )

     
    bar.author = req.user._id
     await bar.save()
    console.log(bar)
    req.flash('success', 'Successfully created a new bar.')
    res.redirect(`/bars/${bar._id}`)
    
}

module.exports.showBar = async (req, res) => {
    const { id } = req.params;
    const bar = await Bar.findById(id).populate(
        { path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')

    
    if(!bar){
        req.flash('error', 'Cannot find bar')
        return res.redirect('/bars')
    }

    res.render('bars/show', { bar })
}

module.exports.renderEditForm = async (req,res) => {
    const { id } = req.params;
    const bar = await Bar.findById(id)
    if(!bar){
        req.flash('error', 'Cannot find bar.')
        return res.redirect('/bars')
    }
    res.render('bars/edit', { bar })
}

module.exports.updateBar = async (req, res) => {
    const {id} = req.params
    console.log(req.body)
    const bar = await Bar.findByIdAndUpdate(id, { ...req.body.bar });
    const imgs = req.files.map( (f) => {

        return {
            url: f.path,
            filename: f.filename
        }

     } )
     bar.images.push(...imgs)
     await bar.save()

     if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
           await cloudinary.uploader.destroy(filename)
        }
        await bar.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
        console.log(bar)
     }

    req.flash('success', 'Successfully updated bar.')
    res.redirect(`/bars/${bar._id}`)
}

module.exports.deleteBar = async (req, res)=>{
    const { id } = req.params;
    const bar = await Bar.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted a bar.')
    res.redirect('/bars')
}