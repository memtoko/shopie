# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import uuid
import shopie.models.product
import shopie.models.order
from django.conf import settings
import shopie.models.fields
from decimal import Decimal
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExraPriceOrderItemField',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('label', models.CharField(verbose_name='Label', max_length=255)),
                ('value', shopie.models.fields.CurrencyField(verbose_name='Amount', decimal_places=2, default=Decimal('0.00'), max_digits=30)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ExtraPriceOrderField',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('label', models.CharField(verbose_name='Label', max_length=255)),
                ('value', shopie.models.fields.CurrencyField(verbose_name='Amount', decimal_places=2, default=Decimal('0.00'), max_digits=30)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='License',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('license_key', models.CharField(verbose_name='license key', max_length=255, unique=True)),
                ('status', models.IntegerField(choices=[(10, 'inactive'), (20, 'active')], default=10)),
                ('active_remaining', models.IntegerField(verbose_name='activate remaining', blank=True, null=True)),
                ('activate_count', models.IntegerField(verbose_name='Count activation', default=0)),
                ('expired_at', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='LicenseActivation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('site', models.CharField(verbose_name='site', max_length=255)),
                ('status', models.IntegerField(choices=[(10, 'inactive'), (20, 'active')], default=20)),
                ('license', models.ForeignKey(to='shopie.License')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('status', models.IntegerField(verbose_name='Status', choices=[(10, 'Building'), (20, 'Confirming'), (30, 'Received'), (40, 'Accepted'), (50, 'Rejected')], default=10)),
                ('full_name', models.CharField(verbose_name='Full name', max_length=255, blank=True)),
                ('number', models.CharField(verbose_name='order number', max_length=255, blank=True)),
                ('email', models.EmailField(verbose_name='Email address', max_length=254, blank=True)),
                ('received_at', models.DateTimeField(verbose_name='received_at', blank=True, null=True)),
                ('order_key', models.CharField(verbose_name='Order Key', max_length=255, blank=True, default=shopie.models.order.create_order_key, unique=True)),
                ('order_subtotal', shopie.models.fields.CurrencyField(verbose_name='Order Subtotal', decimal_places=2, default=Decimal('0.0'), max_digits=30)),
                ('order_total', shopie.models.fields.CurrencyField(verbose_name='Order Total', decimal_places=2, default=Decimal('0.0'), max_digits=30)),
                ('accepted_at', models.DateTimeField(verbose_name='accepted date', blank=True, null=True)),
                ('rejected_at', models.DateTimeField(verbose_name='rejected data', blank=True, null=True)),
                ('accepted_by', models.ForeignKey(verbose_name='accepted by', blank=True, related_name='+', null=True, to=settings.AUTH_USER_MODEL)),
                ('rejected_by', models.ForeignKey(verbose_name='rejected by', blank=True, related_name='+', null=True, to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(verbose_name='customer', blank=True, null=True, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Order',
                'verbose_name_plural': 'Orders',
            },
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('unit_price', shopie.models.fields.CurrencyField(verbose_name='Unit Price', decimal_places=2, default=Decimal('0.0'), max_digits=30)),
                ('quantity', models.IntegerField(verbose_name='Quantity', default=1)),
                ('is_renewal', models.BooleanField(verbose_name='is renewal', default=False)),
                ('renewal_license', models.CharField(verbose_name='renewal license key', max_length=255, blank=True, null=True)),
                ('line_subtotal', shopie.models.fields.CurrencyField(verbose_name='Line Subtotal', decimal_places=2, default=Decimal('0.0'), max_digits=30)),
                ('line_total', shopie.models.fields.CurrencyField(verbose_name='Line Total', decimal_places=2, default=Decimal('0.0'), max_digits=30)),
                ('order', models.ForeignKey(verbose_name='Order Item', related_name='items', to='shopie.Order')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('amount', shopie.models.fields.CurrencyField(verbose_name='amount', decimal_places=2, default=Decimal('0.00'), max_digits=30)),
                ('method', models.CharField(verbose_name='payment method', max_length=255)),
                ('reference', models.CharField(verbose_name='payment reference', max_length=255)),
                ('confirmed', models.BooleanField(verbose_name='confirmed', default=True)),
                ('refundable', models.BooleanField(verbose_name='refundable', default=False)),
                ('amount_refunded', shopie.models.fields.CurrencyField(verbose_name='amount refunded', decimal_places=2, default=Decimal('0.00'), max_digits=30)),
                ('order', models.ForeignKey(verbose_name='Order', related_name='payments', to='shopie.Order')),
                ('parent', models.ForeignKey(verbose_name='payment parent', blank=True, null=True, to='shopie.Payment')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PaymentProperty',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('key', models.CharField(verbose_name='propery key', max_length=255)),
                ('value', models.CharField(verbose_name='propery value', max_length=255)),
                ('payment', models.ForeignKey(related_name='payment_properties', to='shopie.Payment')),
            ],
        ),
        migrations.CreateModel(
            name='Reply',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('body', models.TextField(max_length=10000)),
                ('user', models.ForeignKey(verbose_name='user', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SluggableMixin',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('slug', models.CharField(verbose_name='Slug', max_length=250)),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('full_name', models.CharField(max_length=200, blank=True)),
                ('bio', models.CharField(max_length=200, blank=True)),
                ('website', models.URLField(blank=True)),
                ('status', models.CharField(max_length=200, default='active')),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Issue',
            fields=[
                ('sluggablemixin_ptr', models.OneToOneField(parent_link=True, auto_created=True, to='shopie.SluggableMixin', serialize=False, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('name', models.CharField(verbose_name='Name', max_length=255)),
                ('body', models.TextField(verbose_name='The body', max_length=10000)),
                ('target_object_id', models.CharField(max_length=255, blank=True, null=True)),
                ('is_closed', models.BooleanField(verbose_name='Is close?', default=False)),
                ('target_content_type', models.ForeignKey(blank=True, null=True, to='contenttypes.ContentType')),
                ('user', models.ForeignKey(verbose_name='user', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
            bases=('shopie.sluggablemixin', models.Model),
        ),
        migrations.CreateModel(
            name='Label',
            fields=[
                ('sluggablemixin_ptr', models.OneToOneField(parent_link=True, auto_created=True, to='shopie.SluggableMixin', serialize=False, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('name', models.CharField(verbose_name='The label name', max_length=100, unique=True)),
                ('description', models.CharField(verbose_name='The label description', max_length=250, blank=True)),
                ('issues', models.ManyToManyField(verbose_name='issues', blank=True, to='shopie.Issue')),
            ],
            options={
                'verbose_name': 'label',
                'verbose_name_plural': 'labels',
            },
            bases=('shopie.sluggablemixin', models.Model),
        ),
        migrations.CreateModel(
            name='Media',
            fields=[
                ('sluggablemixin_ptr', models.OneToOneField(parent_link=True, auto_created=True, to='shopie.SluggableMixin', serialize=False, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('name', models.CharField(verbose_name='Product Name', max_length=255, blank=True)),
                ('description', models.TextField(verbose_name='Descriptions', blank=True)),
                ('file', models.FileField(verbose_name='File', upload_to='')),
                ('is_public', models.BooleanField(verbose_name='is public', default=False)),
                ('user', models.ForeignKey(verbose_name='owner', blank=True, null=True, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
            bases=('shopie.sluggablemixin', models.Model),
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('sluggablemixin_ptr', models.OneToOneField(parent_link=True, auto_created=True, to='shopie.SluggableMixin', serialize=False, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('name', models.CharField(verbose_name='Product Name', max_length=255)),
                ('short_description', models.TextField(verbose_name='Short Description', max_length=255)),
                ('description', models.TextField(verbose_name='Descriptions')),
                ('unit_price', shopie.models.fields.CurrencyField(verbose_name='Unit Price', decimal_places=2, blank=True, default=Decimal('0.00'), max_digits=30)),
                ('is_active', models.BooleanField(verbose_name='Active', default=False)),
                ('status', models.IntegerField(verbose_name='Status', choices=[(10, 'Draft'), (20, 'Pending Review'), (30, 'Published')], default=10)),
                ('activation_limit', models.IntegerField(blank=True, null=True, default=1, help_text='Activation limit for this product')),
                ('license_expiry', models.IntegerField(blank=True, null=True, default=1)),
                ('file', models.FileField(verbose_name='File', blank=True, upload_to=shopie.models.product.product_file_upload)),
                ('image', models.FileField(verbose_name='Product image', blank=True, upload_to='images')),
                ('author', models.ForeignKey(verbose_name='Author', blank=True, null=True, to=settings.AUTH_USER_MODEL)),
                ('parent', models.ForeignKey(verbose_name='Product Parent', blank=True, null=True, to='shopie.Product')),
            ],
            options={
                'verbose_name': 'Product',
                'verbose_name_plural': 'Products',
            },
            bases=('shopie.sluggablemixin', models.Model),
        ),
        migrations.CreateModel(
            name='ProductTag',
            fields=[
                ('sluggablemixin_ptr', models.OneToOneField(parent_link=True, auto_created=True, to='shopie.SluggableMixin', serialize=False, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('name', models.CharField(verbose_name='Name', max_length=255)),
                ('description', models.TextField(verbose_name='Description', blank=True, default='')),
                ('image', models.FileField(verbose_name='image', blank=True, upload_to='images')),
                ('products', models.ManyToManyField(verbose_name='products', blank=True, to='shopie.Product', related_name='tags')),
            ],
            options={
                'verbose_name': 'Product Tag',
                'verbose_name_plural': 'Product Tags',
            },
            bases=('shopie.sluggablemixin', models.Model),
        ),
        migrations.AddField(
            model_name='license',
            name='order',
            field=models.ForeignKey(to='shopie.Order'),
        ),
        migrations.AddField(
            model_name='license',
            name='user',
            field=models.ForeignKey(verbose_name='License owner', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='extrapriceorderfield',
            name='order',
            field=models.ForeignKey(verbose_name='Order', related_name='extra_price_fields', to='shopie.Order'),
        ),
        migrations.AddField(
            model_name='exrapriceorderitemfield',
            name='order_item',
            field=models.ForeignKey(verbose_name='Order item', related_name='extra_price_fields', to='shopie.OrderItem'),
        ),
        migrations.AddField(
            model_name='reply',
            name='issue',
            field=models.ForeignKey(verbose_name='issue', related_name='replies', to='shopie.Issue'),
        ),
        migrations.AddField(
            model_name='orderitem',
            name='product',
            field=models.ForeignKey(verbose_name='Product', to='shopie.Product'),
        ),
        migrations.AddField(
            model_name='license',
            name='product',
            field=models.ForeignKey(to='shopie.Product'),
        ),
    ]
