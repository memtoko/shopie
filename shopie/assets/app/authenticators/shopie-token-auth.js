import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';

export default Base.extend({

    init: function() {
        let globalConfig = window.ENV['simple-auth'] || {};
        this.serverTokenEndpoint = globalConfig.serverTokenEndpoint || '/api-token-auth/';
    },

    restore: function(data) {
        return new Ember.RSVP.Promise((resolve, reject) => Ember.isEmpty(data.token) ? reject(): resolve(data));
    },

    authenticate: function(credentials) {
        var data = {
            username: credentials.identification,
            password: credentials.password
        };
        return new Ember.RSVP.Promise((resolve, reject) => {
            this.makeRequest(this.serverTokenEndpoint, data).then((response) => {
                Ember.run(() => resolve());
            },(xhr, status, error) => {
                Ember.run(() => reject(xhr.responseJSON || xhr.responseText));
            });
        });
    },

    invalidate: function(data) {
        return new Ember.RSVP.Promise((resolve, reject) => resolve());
    },

    makeRequest: function(url, data) {
        return Ember.$.ajax({
            url:         url,
            type:        'POST',
            data:        data,
            dataType:    'json',
            contentType: 'application/x-www-form-urlencoded'
        });
    }
});
