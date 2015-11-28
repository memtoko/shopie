/**
 * Under certain circumtance, Django cant maintain post data when there are not
 * slash at the end of url.Here we will normalize all url, to end up with it
 */
export default function ensureSlash(url) {
  var queryStart, queryString ;

  queryStart = url.indexOf('?');
  //this url include query params, so take it out
  if (queryStart !== -1) {
    queryString = url.substr(queryStart + 1, url.length);
    url = path.substr(0, queryStart);
  }
  url = url.slice(-1) !== '/' ? `${url}/` : url;
  return queryString == null ? url : `${url}?$queryString`;
}
