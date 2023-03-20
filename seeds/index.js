const express = require('express');
const usCcities = require('./cities')
const nlCities = require('./nl')
const {places, descriptors} = require('./seedHelpers')
const path = require('path');
const mongoose = require('mongoose')
const Bar = require('../models/Bar')



mongoose.connect('mongodb://localhost:27017/craftBar-book', {
    useNewUrlParser: true,
   // useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
})


const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Bar.deleteMany({})
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 30)
        const price = Math.floor(Math.random() * 40) + 10
        const lngLat = [nlCities[random1000].lng, nlCities[random1000].lat]
        const camp = new Bar({
            author: '63989187774f1b1e9423d28a',
            location: `${nlCities[random1000].city}, ${nlCities[random1000].country}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam esse incidunt, facere, beatae quam aliquam nemo iure delectus fuga voluptatum accusamus doloribus porro soluta perspiciatis ex voluptate. Sequi, esse aut!',
            price: price,
            geometry: {
               type: 'Point',
               coordinates: lngLat
               //[ 4.9, 52.378 ] 
              },
            snacks: 'yes',
            menu: 'yes',
            images: [
                {
                  url: 'https://res.cloudinary.com/dzbovxcji/image/upload/v1671476347/craftBarBook/findmk4rsjah6vxaooip.jpg',
                  filename: 'craftBarBook/findmk4rsjah6vxaooip'
                },
                {
                  url: 'https://res.cloudinary.com/dzbovxcji/image/upload/v1671476348/craftBarBook/ojxvbbhbusrfohs6slmr.jpg',
                  filename: 'craftBarBook/ojxvbbhbusrfohs6slmr'
                },
                {
                  url: 'https://res.cloudinary.com/dzbovxcji/image/upload/v1671476349/craftBarBook/qlu5fcr6lhwddvcisqay.jpg',
                  filename: 'craftBarBook/qlu5fcr6lhwddvcisqay'   
                }
              ]
        })
        await camp.save()
    }
  
}

seedDB().then(()=>{
    mongoose.connection.close()
})