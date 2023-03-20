

  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: bar.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
  });

  new mapboxgl.Marker()
  .setLngLat(bar.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h3> ${bar.title} </h3> <p> ${bar.location} </p>`
    )
  )
  .addTo(map)
