import Ember from 'ember';

function isNumber(num) {
  return Ember.$.isNumeric(num);
};

function mapType(val) {
  var e;
  if (val === '') {
    return null;
  } else if (val === 'true') {
    return true;
  } else if (val === 'false') {
    return false;
  } else if (isNumber(val)) {
    return +val;
  } else if (val.indexOf('{') === 0) {
    try {
      return JSON.parse(val);
    } catch (_error) {
      e = _error;
      return val;
    }
  } else {
    return val;
  }
}

export default Ember.Service.extend(Ember._ProxyMixin, {
  content: Ember.computed(function() {
    var config, metaConfigTags;
    metaConfigTags = Ember.$('meta[name^="env-"]');
    config = {};
    metaConfigTags.each(function(i, el) {
      var key, propertyName, value;
      key = el.name;
      value = el.content;
      propertyName = key.substring(4);
      return config[propertyName] = _mapType(value);
    });
    return config;
  })
});
