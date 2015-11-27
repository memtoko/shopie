export default function setScrollClass(options) {
  var $target = options.target || this,
    offset = options.offset,
    className = options.className || 'scrolling';

  if (this.scrollTop() > offset) {
    $target.addClass(className);
  } else {
    $target.removeClass(className);
  }
}
