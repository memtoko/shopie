// Our markdown parser use markdown-it, it available on global variable on browser
// this file intended to extend the parser for our favour
let markdown = markdownit().use(markdownitEmoji)

export default markdown;
