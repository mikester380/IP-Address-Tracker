'use strict';

//wait till javascript is loaded before displaying the application
gsap.set('body', {visibility:  'visible'});

//getting required DOM elements 
const form = document.querySelector('.form');
const formInput = document.querySelector('.form__input')
const ipPlaceholder = document.querySelector('.search-info__ip');
const locationPlaceholder = document.querySelector('.search-info__location');
const timezonePlaceholder = document.querySelector('.search-info__timezone');
const ispPlaceholder = document.querySelector('.search-info__isp');

//creating a custom marker icon for the map
const customMarkerIcon = L.icon({
  iconUrl: "../images/icon-location.svg",
  //iconSize: [30, 30]
});

//creating an instance of the map class and configuring it's layer
const map = L.map('map');
L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//function to render map to the screen
const renderMap = function(coords) {
  map.setView(coords, 13);
  L.marker(coords, {
    icon: customMarkerIcon
  }).addTo(map);
}

//function to display info about the entered IP Address
const updateInfo = function(data) {
  const {city,region,timezone,postalCode} = data.location;
  const {isp,ip} = data;
  ipPlaceholder.textContent = ip;
  timezonePlaceholder.textContent = `UTC ${timezone}`;
  locationPlaceholder.textContent = `${city}, ${region} ${postalCode}`
  ispPlaceholder.textContent = isp;
}

//function to get IP Address data from the IPify api
const getData = function() {
  let apiKey = "at_qR7c8vTpCgvzZLrNeHrbvNCMGz6PD";
  let ipAddress = formInput.value ? `&ipAddress=${formInput.value}`: "";
  let url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}${ipAddress}`;
  fetch(url).then(response => response.json())
  .then(data => {
    const {lat, lng} = data.location;
    updateInfo(data);
    renderMap([lat, lng]);
  });

}

//handles submit event for search form
form.addEventListener('submit', function(e) {
  e.preventDefault();
  getData();
  formInput.value = "";
});

//load user ip address info on page load
getData();

//Animation code starts here!
const timeline = gsap.timeline();
timeline.from('.form__input', {x: -100, opacity: 0, ease: "linear"})
        .from('.form__submit', {x: 100, opacity: 0, ease: "linear"}, "<")
        .from('.main-heading', {opacity: 0, y: -50})
        .from('.search-info', {opacity:0, xPercent: -100, yPercent: -50, ease: "back"})
        .from('#map', {opacity:0, scale:0})