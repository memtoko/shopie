# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
import shopie.models.order
import uuid
from decimal import Decimal
from django.conf import settings
import shopie.models.product
import shopie.models.fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExraPriceOrderItemField',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('label', models.CharField(max_length=255, verbose_name='Label')),
                ('value', shopie.models.fields.CurrencyField(decimal_places=2, verbose_name='Amount', max_digits=30, default=Decimal('0.00'))),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ExtraPriceOrderField',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('label', models.CharField(max_length=255, verbose_name='Label')),
                ('value', shopie.models.fields.CurrencyField(decimal_places=2, verbose_name='Amount', max_digits=30, default=Decimal('0.00'))),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Issue',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('slug', models.CharField(max_length=250, verbose_name='Slug')),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('name', models.CharField(max_length=255, verbose_name='Name')),
                ('body', models.TextField(max_length=10000, verbose_name='The body')),
                ('target_object_id', models.CharField(null=True, max_length=255, blank=True)),
                ('is_closed', models.BooleanField(verbose_name='Is close?', default=False)),
                ('target_content_type', models.ForeignKey(null=True, to='contenttypes.ContentType', blank=True)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL, verbose_name='user')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Label',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('slug', models.CharField(max_length=250, verbose_name='Slug')),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('name', models.CharField(max_length=100, unique=True, verbose_name='The label name')),
                ('description', models.CharField(max_length=250, blank=True, verbose_name='The label description')),
                ('issues', models.ManyToManyField(blank=True, to='shopie.Issue', verbose_name='issues')),
            ],
            options={
                'verbose_name': 'label',
                'verbose_name_plural': 'labels',
            },
        ),
        migrations.CreateModel(
            name='License',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('license_key', models.CharField(max_length=255, unique=True, verbose_name='license key')),
                ('status', models.IntegerField(choices=[(10, 'inactive'), (20, 'active')], default=10)),
                ('active_remaining', models.IntegerField(null=True, blank=True, verbose_name='activate remaining')),
                ('activate_count', models.IntegerField(verbose_name='Count activation', default=0)),
                ('expired_at', models.DateTimeField(null=True, blank=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='LicenseActivation',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('site', models.CharField(max_length=255, verbose_name='site')),
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
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('status', models.IntegerField(choices=[(10, 'Building'), (20, 'Confirming'), (30, 'Received'), (40, 'Accepted'), (50, 'Rejected')], verbose_name='Status', default=10)),
                ('full_name', models.CharField(max_length=255, blank=True, verbose_name='Full name')),
                ('email', models.EmailField(max_length=254, blank=True, verbose_name='Email address')),
                ('received_at', models.DateTimeField(null=True, blank=True, verbose_name='received_at')),
                ('order_key', models.CharField(max_length=255, unique=True, blank=True, verbose_name='Order Key', default=shopie.models.order.create_order_key)),
                ('order_subtotal', shopie.models.fields.CurrencyField(decimal_places=2, verbose_name='Order Subtotal', max_digits=30, default=Decimal('0.0'))),
                ('order_total', shopie.models.fields.CurrencyField(decimal_places=2, verbose_name='Order Total', max_digits=30, default=Decimal('0.0'))),
                ('accepted_at', models.DateTimeField(null=True, blank=True, verbose_name='accepted date')),
                ('rejected_at', models.DateTimeField(null=True, blank=True, verbose_name='rejected data')),
                ('accepted_by', models.ForeignKey(null=True, to=settings.AUTH_USER_MODEL, verbose_name='accepted by', related_name='+', blank=True)),
                ('rejected_by', models.ForeignKey(null=True, to=settings.AUTH_USER_MODEL, verbose_name='rejected by', related_name='+', blank=True)),
                ('user', models.ForeignKey(null=True, to=settings.AUTH_USER_MODEL, verbose_name='customer', blank=True)),
            ],
            options={
                'verbose_name': 'Order',
                'verbose_name_plural': 'Orders',
            },
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('unit_price', shopie.models.fields.CurrencyField(decimal_places=2, verbose_name='Unit Price', max_digits=30, default=Decimal('0.0'))),
                ('quantity', models.IntegerField(verbose_name='Quantity', default=1)),
                ('is_renewal', models.BooleanField(verbose_name='is renewal', default=False)),
                ('renewal_license', models.CharField(null=True, blank=True, max_length=255, verbose_name='renewal license key')),
                ('line_subtotal', shopie.models.fields.CurrencyField(decimal_places=2, verbose_name='Line Subtotal', max_digits=30, default=Decimal('0.0'))),
                ('line_total', shopie.models.fields.CurrencyField(decimal_places=2, verbose_name='Line Total', max_digits=30, default=Decimal('0.0'))),
                ('order', models.ForeignKey(to='shopie.Order', verbose_name='Order Item', related_name='items')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('amount', shopie.models.fields.CurrencyField(decimal_places=2, verbose_name='amount', max_digits=30, default=Decimal('0.00'))),
                ('method', models.CharField(max_length=255, verbose_name='payment method')),
                ('reference', models.CharField(max_length=255, verbose_name='payment reference')),
                ('confirmed', models.BooleanField(verbose_name='confirmed', default=True)),
                ('refundable', models.BooleanField(verbose_name='refundable', default=False)),
                ('amount_refunded', shopie.models.fields.CurrencyField(decimal_places=2, verbose_name='amount refunded', max_digits=30, default=Decimal('0.00'))),
                ('order', models.ForeignKey(to='shopie.Order', verbose_name='Order', related_name='payments')),
                ('parent', models.ForeignKey(null=True, to='shopie.Payment', verbose_name='payment parent', blank=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PaymentProperty',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('key', models.CharField(max_length=255, verbose_name='propery key')),
                ('value', models.CharField(max_length=255, verbose_name='propery value')),
                ('payment', models.ForeignKey(to='shopie.Payment', related_name='payment_properties')),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('slug', models.CharField(max_length=250, verbose_name='Slug')),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('name', models.CharField(max_length=255, verbose_name='Product Name')),
                ('short_description', models.TextField(max_length=255, verbose_name='Short Description')),
                ('description', models.TextField(verbose_name='Descriptions')),
                ('unit_price', shopie.models.fields.CurrencyField(blank=True, decimal_places=2, verbose_name='Unit Price', max_digits=30, default=Decimal('0.00'))),
                ('is_active', models.BooleanField(verbose_name='Active', default=False)),
                ('status', models.IntegerField(choices=[(10, 'Draft'), (20, 'Pending Review'), (30, 'Published')], verbose_name='Status', default=10)),
                ('activation_limit', models.IntegerField(null=True, blank=True, help_text='Activation limit for this product', default=1)),
                ('license_expiry', models.IntegerField(null=True, blank=True, default=1)),
                ('file', models.FileField(blank=True, upload_to=shopie.models.product.product_file_upload, verbose_name='File')),
                ('image', models.FileField(blank=True, upload_to='images', verbose_name='Product image')),
                ('author', models.ForeignKey(null=True, to=settings.AUTH_USER_MODEL, verbose_name='Author', blank=True)),
                ('parent', models.ForeignKey(null=True, to='shopie.Product', verbose_name='Product Parent', blank=True)),
            ],
            options={
                'verbose_name': 'Product',
                'verbose_name_plural': 'Products',
            },
        ),
        migrations.CreateModel(
            name='ProductTag',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('slug', models.CharField(max_length=250, verbose_name='Slug')),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('name', models.CharField(max_length=255, verbose_name='Name')),
                ('description', models.TextField(blank=True, verbose_name='Description', default='')),
                ('image', models.FileField(upload_to='images', verbose_name='Product image')),
                ('products', models.ManyToManyField(to='shopie.Product', verbose_name='products')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Reply',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('body', models.TextField(max_length=10000)),
                ('issue', models.ForeignKey(to='shopie.Issue', verbose_name='issue', related_name='replies')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL, verbose_name='user')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='orderitem',
            name='product',
            field=models.ForeignKey(to='shopie.Product', verbose_name='Product'),
        ),
        migrations.AddField(
            model_name='license',
            name='order',
            field=models.ForeignKey(to='shopie.Order'),
        ),
        migrations.AddField(
            model_name='license',
            name='product',
            field=models.ForeignKey(to='shopie.Product'),
        ),
        migrations.AddField(
            model_name='license',
            name='user',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL, verbose_name='License owner'),
        ),
        migrations.AddField(
            model_name='extrapriceorderfield',
            name='order',
            field=models.ForeignKey(to='shopie.Order', verbose_name='Order', related_name='extra_price_fields'),
        ),
        migrations.AddField(
            model_name='exrapriceorderitemfield',
            name='order_item',
            field=models.ForeignKey(to='shopie.OrderItem', verbose_name='Order item', related_name='extra_price_fields'),
        ),
    ]
