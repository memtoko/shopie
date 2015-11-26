from django import template
from django.utils.safestring import mark_safe
import hashlib

try:
    from django.utils.encoding import force_text
except ImportError:
    from django.utils.encoding import force_unicode as force_text

from shopie.utils.text import common_markdown

register = template.Library()

@register.filter(name="markdown")
def markdown_filter(value):
    return mark_safe(common_markdown(value))
markdown_filter.is_safe = True

@register.filter(name="md5")
def md5_filter(value):
    return hashlib.md5(str(value).encode('utf-8')).hexdigest()
md5_filter.is_safe = True

@register.tag(name="markdown")
def markdown_tag(parser, token):
    nodelist = parser.parse(('endmarkdown',))
    bits = token.split_contents()
    if len(bits) > 1:
        raise template.TemplateSyntaxError("`markdown` tag requires exactly "
            "zero arguments")
    parser.delete_first_token()
    return MarkdownNode(nodelist)

class MarkdownNode(template.Node):
    def __init__(self, nodelist):
        self.nodelist = nodelist
    def render(self, context):
        value = self.nodelist.render(context)
        try:
            return mark_safe(common_markdown(value))
        except ImportError:
            if settings.DEBUG:
                raise template.TemplateSyntaxError("Error in `markdown` tag: "
                    "The python-markdown library isn't installed.")
            return force_text(value)
