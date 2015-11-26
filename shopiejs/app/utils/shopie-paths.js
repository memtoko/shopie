function makeRoute (root, args) {
  let slashAtStart = /^\//,
    slashAtEnd = /\/$/,
    route = root.replace(slashAtEnd, ''),
    parts = Array.prototype.slice.call(args, 0),
    part, _i, _len;
  for (_i = 0, _len = parts.length; _i < _len; _i++) {
    part = parts[_i];
    if (part) {
      route = [route, part.replace(slashAtStart, '').replace(slashAtEnd, '')].join('/');
    }
  }
  return route += '/';
}

export default function shopiePaths () {
  let adminRoot = '/console',
    oauth2Root = '/o',
    apiRoot = '/api/v1';

  return {
    adminRoot: adminRoot,
    oauth2Root: oauth2Root,
    apiRoot: apiRoot,
    url: {
      admin() {
        return makeRoute(adminRoot, arguments);
      },
      api() {
        return makeRoute(apiRoot, arguments);
      },
      oauth2() {
        return makeRoute(oauth2Root, arguments);
      },
      join() {
        if (arguments.length > 1) {
          return makeRoute(arguments[0], Array.prototype.slice.call(arguments, 1));
        } else if (arguments.length === 1) {
          let arg = arguments[0];
          return arg.slice(-1) === '/' ? arg :  arg + '/';
        } else {
          return '/';
        }
      }
    }
  };
};
