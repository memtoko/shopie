import Ember from 'ember';

export default Ember.Mixin.create({
  isLoading: false,
  triggerPoint: 10,

  checkScroll(event) {
    var elem = event.target,
      triggerPoint = this.get('triggerPoint'),
      isLoading = this.get('isLoading');

    let trigPoint = elem.scrollTop + elem.clientHeight + triggerPoint;
    if (isLoading || (trigPoint <= elem.scrollHeight)) {
      return;
    }
    this.sendAction('fetch');
  },

  didInsertElement() {
    let el = this.get('element');
    el.onscroll = Ember.run.bind(this, this.checkScroll);
    if (el.scrollHeight <= el.clientHeight) {
      this.sendAction('fetch');
    }
  },

  willDestroyElement() {
    this.get('element').onscroll = null;
  }
});
