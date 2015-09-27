import re
import hashlib
import random
import markdown

from django.utils.text import slugify as _slugify
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _

from markdown.extensions import Extension
from markdown.extensions.codehilite import CodeHiliteExtension
from markdown.extensions.fenced_code import FencedCodeExtension
from markdown.extensions.smart_strong import SmartEmphasisExtension
from markdown.extensions.tables import TableExtension
from markdown.extensions.nl2br import Nl2BrExtension

def slugify(base, instance=None, slug_field='slug'):
    slug = base = _slugify(str(base).replace('_', ' '))
    if instance:
        def get_query():
            query = instance.objects.filter(**{slug_field: slug})
            if instance.pk:
                query = query.exclude(pk=instance.pk)
            return query.exists()
        i = 1
        while get_query():
            slug = "%s-%s" % (base, i)
            i += 1
    return slug

class validate_sluggable(object):

    def __init__(self, error_short=None, error_long=None):
        self.error_short = error_short or _(
                "Value has to contain alpha-numerical characters."
            )
        self.error_long = error_long or _("Value is too long.")

    def __call__(self, value):
        slug = slugify(value)

        if not slug.replace('-', ''):
            raise ValidationError(self.error_short)

        if len(slug) > 255:
            raise ValidationError(self.error_long)

def create_sha1_key(based):
    salt = hashlib.sha1(str(random.random()).encode('ascii')).hexdigest()[:5]
    salt = salt.encode('ascii')
    base = str(based)
    if isinstance(base, str):
        base = base.encode('utf-8')
    return hashlib.sha1(salt+base).hexdigest()

# regex to match ``~~strike~~``
STRIKE_RE = r'(~{2})(.+?)(~{2})'
MAIL_RE = r'\b(?i)([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]+)\b'
# roughly based http://daringfireball.net/2010/07/improved_regex_for_matching_urls
URL_RE = r'(?i)\b((?:(?:ftp|https?)://|www\d{0,3}[.])(?:[^\s()<>]+|' + \
          r'\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()' + \
          r'<>]+\)))*\)|[^\s`!()\[\]{};:' + r"'" + r'".,<>?«»“”‘’]))'

BRK = markdown.inlinepatterns.BRK
NOIMG = markdown.inlinepatterns.NOIMG
SPACE = r"(?:\s*(?:\r\n|\r|\n)?\s*)"

SPACED_LINK_RE = markdown.inlinepatterns.LINK_RE.replace(
    NOIMG + BRK, NOIMG + BRK + SPACE)

SPACED_REFERENCE_RE = markdown.inlinepatterns.REFERENCE_RE.replace(
    NOIMG + BRK, NOIMG + BRK + SPACE)

SPACED_IMAGE_LINK_RE = markdown.inlinepatterns.IMAGE_LINK_RE.replace(
    r'\!' + BRK, r'\!' + BRK + SPACE)

SPACED_IMAGE_REFERENCE_RE = markdown.inlinepatterns.IMAGE_REFERENCE_RE.replace(
    r'\!' + BRK, r'\!' + BRK + SPACE)

class StrikethroughExtension(markdown.Extension):

    def extendMarkdown(self, md, md_globals):
        pattern = markdown.inlinepatterns.SimpleTagPattern(STRIKE_RE, 'del')
        md.inlinePatterns.add('gfm-strikethrough', pattern, '_end')

class AutoMailPattern(markdown.inlinepatterns.Pattern):

    def handleMatch(self, m):
        el = markdown.util.etree.Element("a")
        el.set('href', self.unescape('mailto:' + m.group(2)))
        el.text = markdown.util.AtomicString(m.group(2))
        return el

class AutoMailExtension(markdown.Extension):
    """This extension turn all email address into link (mailto)"""
    def extendMarkdown(self, md, md_globals):
        automail = AutoMailPattern(MAIL_RE, md)
        md.inlinePatterns.add('gfm-automail', automail, '_end')

class AutoLinkPattern(markdown.inlinepatterns.Pattern):

    def handleMatch(self, m):
        el = markdown.util.etree.Element("a")

        href = m.group(2)
        if not re.match('^(ftp|https?)://', href, flags=re.IGNORECASE):
            href = 'http://%s' % href
        el.set('href', self.unescape(href))

        el.text = markdown.util.AtomicString(m.group(2))
        return el

class AutoLinkExtension(markdown.Extension):
    """This extension turn all URLS into links.

    """

    def extendMarkdown(self, md, md_globals):
        autolink = AutoLinkPattern(URL_RE, md)
        md.inlinePatterns.add('gfm-autolink', autolink, '_end')

class SemiSaneOListProcessor(markdown.blockprocessors.OListProcessor):
    SIBLING_TAGS = ['ol']

class SemiSaneUListProcessor(markdown.blockprocessors.UListProcessor):
    SIBLING_TAGS = ['ul']

class SemiSaneListExtension(markdown.Extension):
    """An extension that causes lists to be treated the same way GitHub does.

    Like the sane_lists extension, GitHub considers a list to end if it's
    separated by multiple newlines from another list of a different type. Unlike
    the sane_lists extension, GitHub will mix list types if they're not
    separated by multiple newlines.

    Github also recognizes lists that start in the middle of a paragraph. This
    is currently not supported by this extension, since the Python parser has a
    deeply-ingrained belief that blocks are always separated by multiple
    newlines.
    """

    def extendMarkdown(self, md, md_globals):
        md.parser.blockprocessors['olist'] = SemiSaneOListProcessor(md.parser)
        md.parser.blockprocessors['ulist'] = SemiSaneUListProcessor(md.parser)

class SpacedLinkExtension(markdown.Extension):
    """An extension that supports links and images with additional whitespace.

    GitHub's Markdown engine allows links and images to have whitespace --
    including a single newline -- between the first set of brackets and the
    second (e.g. ``[text] (href)``). Python-Markdown does not, but this
    extension adds such support.
    """

    def extendMarkdown(self, md, md_globals):
        md.inlinePatterns["link"] = \
            markdown.inlinepatterns.LinkPattern(SPACED_LINK_RE, md)
        md.inlinePatterns["reference"] = \
            markdown.inlinepatterns.ReferencePattern(SPACED_REFERENCE_RE, md)
        md.inlinePatterns["image_link"] = \
            markdown.inlinepatterns.ImagePattern(SPACED_IMAGE_LINK_RE, md)
        md.inlinePatterns["image_reference"] = \
            markdown.inlinepatterns.ImageReferencePattern(
                SPACED_IMAGE_REFERENCE_RE, md)

class HiddenHiliteExtension(CodeHiliteExtension):
    """A subclass of CodeHiliteExtension that doesn't highlight on its own.

    This just enables the fenced code extension to use syntax highlighting,
    without adding syntax highlighting or line numbers to any additional code
    blocks.
    """

    def extendMarkdown(self, md, md_globals):
        md.registerExtension(self)

class PartialGFMExtension(Extension):

    def extendMarkdown(self, md, md_globals):
        # Built-in extensions
        FencedCodeExtension().extendMarkdown(md, md_globals)
        SmartEmphasisExtension().extendMarkdown(md, md_globals)
        TableExtension().extendMarkdown(md, md_globals)

        # Custom extensions
        AutoLinkExtension().extendMarkdown(md, md_globals)
        AutoMailExtension().extendMarkdown(md, md_globals)
        HiddenHiliteExtension([
            ('guess_lang', 'False'),
            ('css_class', 'highlight')
        ]).extendMarkdown(md, md_globals)
        SemiSaneListExtension().extendMarkdown(md, md_globals)
        SpacedLinkExtension().extendMarkdown(md, md_globals)
        StrikethroughExtension().extendMarkdown(md, md_globals)

class GFMExtension(Extension):

    def extendMarkdown(self, md, md_globals):
        PartialGFMExtension().extendMarkdown(md, md_globals)
        Nl2BrExtension().extendMarkdown(md, md_globals)

def common_markdown(value):
    return markdown.markdown(value, extensions=[GFMExtension()])
