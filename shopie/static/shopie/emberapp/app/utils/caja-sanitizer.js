let url = function (url) {
  url = url.toString().replace(/['"]+/g, '');
  if (/^https?:\/\//.test(url) || /^\//.test(url)) {
    return url;
  }
};

let id = function (id) {
  return id;
};

export default {
  url: url,
  id: id
};
