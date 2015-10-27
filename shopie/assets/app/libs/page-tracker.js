import Ember from 'ember';

let pageTracker = function () {
    Ember.Route.reopen({
        notifyGA: function() {
            return ga('send', 'pageview', {
                'page': this.get('url'),
                'title': window.document.title || this.get('url')
            })
        }.on('didTransition')
    });
};

export default pageTracker;
