import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
    identification: 'shopie:cart-id',

    init() {
        this._super(...arguments);
        if (! this._testStorage('localStorage')) {
            alert('The shopping cart cant work, because you in old browser or on private mode.')
        }
        this.listenStorageEvents();
    },

    set(orderid) {
        this._lastData = orderid;
        localStorage.setItem(this.identification, orderid);
    },

    retrieve() {
        return localStorage.getItem(this.identification);
    },

    _testStorage(type) {
        try {
            let storage = window[type],
                x = '__teststorage___';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch(e) {
            return false;
        }
    },

    listenStorageEvents() {
        Ember.$(window).bind('shopingCart', () => {
            let data = this.retrieve();
            if (!data == this._lastData) {
                this._lastData = data;
                this.trigger('shopingCartUpdated', data);
            }
        });
    }
});
