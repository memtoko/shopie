import Ember from 'ember';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import getCookie from 'shopie/utils/get-cookie';

const { RSVP, isEmpty, run, get } = Ember;

export default BaseAuthenticator.extend({

    csrfTokenName: 'csrftoken',

    loginEndpoint: '/login/',

    logoutEndpoint: '/logout/',

    authenticate: function(identification, password) {
        return new RSVP.Promise((resolve, reject) => {
            let data = {username: identification, password: password};
            const loginEndpoint = this.get('loginEndpoint');
            this.makeRequest(loginEndpoint, data).then((response) => {
                run(() => {
                    // to do, we need somehow to check the session is still there
                    resolve(response);
                });
            }, (xhr) => {
                run(null, reject, xhr.responseJSON || xhr.responseText);
            });
        });
    },

    restore: function(data) {
        return new RSVP.Promise((resolve, reject) => resolve(data));
    },

    invalidate: function(data) {
        return new RSVP.Promise((resolve, reject) => {
            //hmm, i think i am only need to hit logoutEndpoint right?
            const url = this.get('logoutEndpoint');
            Ember.$.ajax({
                url,
                type: 'GET'
            }).then((response) => resolve(data));
        })
    },

    makeRequest: function(url, data) {
        let options = {
            url,
            data,
            type:        'POST',
            dataType:    'json',
            contentType: 'application/x-www-form-urlencoded'
        };
        const csrftoken = getCookie(this.get('csrfTokenName'));
        if (! isEmpty(csrftoken)) {
            Ember.merge(options, {
                headers: {
                    'X-CSRFToken': csrftoken
                }
            });
        }

        return Ember.$.ajax(options);
    },
});
