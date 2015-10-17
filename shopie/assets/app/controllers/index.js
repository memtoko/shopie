import Ember from 'ember';

let headerImages = [
    "/static/images/home15.jpg",
    "/static/images/home14.jpg",
    "/static/images/home13.jpg",
];

export default Ember.Controller.extend({
	imageCover: headerImages[Math.floor(Math.random()*headerImages.length)],
});