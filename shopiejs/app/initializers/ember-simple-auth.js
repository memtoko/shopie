import ENV from '../config/environment';
import Configuration from 'ember-simple-auth/configuration';
import shopiePaths from '../utils/shopie-paths';
import ensureSlash from '../utils/ensure-slash';
import setupSession from 'ember-simple-auth/initializers/setup-session';
import setupSessionService from 'ember-simple-auth/initializers/setup-session-service';

export default {
  name: 'ember-simple-auth',
  initialize(registry) {
    const config   = ENV['ember-simple-auth'] || {};
    config.baseURL = ensureSlash(shopiePaths().adminRoot);
    Configuration.load(config);

    setupSession(registry);
    setupSessionService(registry);
  }
};
