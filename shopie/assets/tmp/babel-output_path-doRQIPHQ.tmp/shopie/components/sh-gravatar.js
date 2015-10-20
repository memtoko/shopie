import Ember from 'ember';
/* global md5 */
export default Ember.Component.extend({
    size: 200,
    email: '',

    gravatarUrl: Ember.computed('email', 'size', function () {
        var emailHash = md5(this.get('email')),
            size = this.get('size');
        return 'http://www.gravatar.com/avatar/' + emailHash + '?s=' + size;
    })
});