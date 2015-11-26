export default function (name) {
  let cookieValue;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';'),
      cookie, i, len;
    for (i = 0, len = cookies.length; i < len; i++) {
      cookie = $.trim(cookies[i]);
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};
