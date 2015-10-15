import Ember from 'ember';
import styleBody from 'shopie/mixins/style-body';

export default Ember.Route.extend(styleBody, {
    classNames: ['home', 'js-home'],
    titleToken: 'Home',

    renderTemplate: function() {
        this.render('cover/home', {
            into: 'application',
            outlet: 'header-cover'
        });
        this.render('index');
    }
});
