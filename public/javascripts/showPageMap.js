mapboxgl.accessToken = mapToken;

// Center coordinates for India
const indiaCenter = [78.9629, 20.5937]; // [lng, lat]

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: indiaCenter, // set the center to India
    zoom: 5 // starting zoom level
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map);
