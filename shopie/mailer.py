from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template import RequestContext, TemplateDoesNotExist
from django.template.loader import render_to_string

def mailer(recipient, subject, template, sender=None, context=None, request=None):
    context = context or {}
    if request is not None:
        context = RequestContext(request, context)
    # make sure subject doesnt contains newlines
    subject = ''.join(subject.splitlines())

    context.update({
        'subject' : subject,
        'recipient': recipient
    })

    if sender is None:
        sender = getattr(settings, 'DEFAULT_FROM_EMAIL', 'syaiful@pengunjungblog.com')

    plain = render_to_string('%s.txt' % template, context)
    message = EmailMultiAlternatives(subject, plain, sender, to=recipient)
    try:
        html = render_to_string('%s.html' % template, context)
    except TemplateDoesNotExist:
        pass
    else:
        message.attach_alternative(html, "text/html")
    return message


def order_added_mailer(user, order, **kwargs):
    ctx_dict = {
        'user': user,
        'order': order
    }
    subject = render_to_string("shopie/order/new_order_subject.txt", ctx_dict)
    template = "shopie/order/new_order_body"
    to = order.email or user.email
    message = mailer([to], subject, template, context=ctx_dict)
    message.send()
