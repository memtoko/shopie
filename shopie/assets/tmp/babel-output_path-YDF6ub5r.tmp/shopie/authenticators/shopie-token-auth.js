import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';

export default Base.extend({

    init: function init() {
        var globalConfig = window.ENV['simple-auth'] || {};
        this.serverTokenEndpoint = globalConfig.serverTokenEndpoint || '/api-token-auth/';
    },

    restore: function restore(data) {
        return new Ember.RSVP.Promise(function (resolve, reject) {
            return Ember.isEmpty(data.token) ? reject() : resolve(data);
        });
    },

    authenticate: function authenticate(credentials) {
        var _this = this;

        var data = {
            username: credentials.identification,
            password: credentials.password
        };
        return new Ember.RSVP.Promise(function (resolve, reject) {
            _this.makeRequest(_this.serverTokenEndpoint, data).then(function (response) {
                Ember.run(function () {
                    return resolve();
                });
            }, function (xhr, status, error) {
                Ember.run(function () {
                    return reject(xhr.responseJSON || xhr.responseText);
                });
            });
        });
    },

    invalidate: function invalidate(data) {
        return new Ember.RSVP.Promise(function (resolve, reject) {
            return resolve();
        });
    },

    makeRequest: function makeRequest(url, data) {
        return Ember.$.ajax({
            url: url,
            type: 'POST',
            data: data,
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded'
        });
    }
});