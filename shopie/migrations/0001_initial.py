# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import uuid
from django.conf import settings
import shopie.models.product
import django.utils.timezone
from decimal import Decimal
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
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('label', models.CharField(max_length=255, verbose_name='Label')),
                ('value', shopie.models.fields.CurrencyField(max_digits=30, decimal_places=2, default=Decimal('0.00'), verbose_name='Amount')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ExtraPriceOrderField',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('label', models.CharField(max_length=255, verbose_name='Label')),
                ('value', shopie.models.fields.CurrencyField(max_digits=30, decimal_places=2, default=Decimal('0.00'), verbose_name='Amount')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Issue',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('slug', models.CharField(max_length=250, verbose_name='Slug')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('name', models.CharField(max_length=255, verbose_name='Name')),
                ('body', models.TextField(max_length=10000, verbose_name='The body')),
                ('target_object_id', models.CharField(null=True, max_length=255, blank=True)),
                ('is_closed', models.BooleanField(verbose_name='Is close?', default=False)),
                ('target_content_type', models.ForeignKey(to='contenttypes.ContentType', null=True, blank=True)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL, verbose_name='user')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Label',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('slug', models.CharField(max_length=250, verbose_name='Slug')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('name', models.CharField(max_length=100, unique=True, verbose_name='The label name')),
                ('description', models.CharField(max_length=250, blank=True, verbose_name='The label description')),
                ('issues', models.ManyToManyField(blank=True, verbose_name='issues', to='shopie.Issue')),
            ],
            options={
                'verbose_name': 'label',
                'verbose_name_plural': 'labels',
            },
        ),
        migrations.CreateModel(
            name='License',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('license_key', models.CharField(max_length=255, unique=True, verbose_name='license key')),
                ('status', models.IntegerField(default=10, choices=[(10, 'inactive'), (20, 'active')])),
                ('active_remaining', models.IntegerField(null=True, blank=True, verbose_name='activate remaining')),
                ('activate_count', models.IntegerField(default=0, verbose_name='Count activation')),
                ('expired_at', models.DateTimeField(null=True, blank=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='LicenseActivation',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('site', models.CharField(max_length=255, verbose_name='site')),
                ('status', models.IntegerField(default=20, choices=[(10, 'inactive'), (20, 'active')])),
                ('license', models.ForeignKey(to='shopie.License')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('status', models.IntegerField(choices=[(10, 'Building'), (20, 'Confirming'), (30, 'Received'), (40, 'Accepted'), (50, 'Rejected')], verbose_name='Status', default=10)),
                ('full_name', models.CharField(max_length=255, blank=True, verbose_name='Full name')),
                ('email', models.EmailField(max_length=254, verbose_name='Email address')),
                ('received_at', models.DateTimeField(null=True, blank=True, verbose_name='received_at')),
                ('order_key', models.CharField(max_length=255, blank=True, verbose_name='Order Key', unique=True)),
                ('order_subtotal', shopie.models.fields.CurrencyField(max_digits=30, decimal_places=2, default=Decimal('0.0'), verbose_name='Order Subtotal')),
                ('order_total', shopie.models.fields.CurrencyField(max_digits=30, decimal_places=2, default=Decimal('0.0'), verbose_name='Order Total')),
                ('accepted_at', models.DateTimeField(null=True, blank=True, verbose_name='accepted date')),
                ('rejected_at', models.DateTimeField(null=True, blank=True, verbose_name='rejected data')),
                ('accepted_by', models.ForeignKey(related_name='+', verbose_name='accepted by', null=True, to=settings.AUTH_USER_MODEL, blank=True)),
                ('rejected_by', models.ForeignKey(related_name='+', verbose_name='rejected by', null=True, to=settings.AUTH_USER_MODEL, blank=True)),
                ('user', models.ForeignKey(verbose_name='customer', null=True, to=settings.AUTH_USER_MODEL, blank=True)),
            ],
            options={
                'verbose_name': 'Order',
                'verbose_name_plural': 'Orders',
            },
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('unit_price', shopie.models.fields.CurrencyField(max_digits=30, decimal_places=2, default=Decimal('0.0'), verbose_name='Unit Price')),
                ('quantity', models.IntegerField(default=1, verbose_name='Quantity')),
                ('line_subtotal', shopie.models.fields.CurrencyField(max_digits=30, decimal_places=2, default=Decimal('0.0'), verbose_name='Line Subtotal')),
                ('line_total', shopie.models.fields.CurrencyField(max_digits=30, decimal_places=2, default=Decimal('0.0'), verbose_name='Line Total')),
                ('order', models.ForeignKey(related_name='items', verbose_name='Order Item', to='shopie.Order')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('amount', shopie.models.fields.CurrencyField(max_digits=30, decimal_places=2, default=Decimal('0.00'), verbose_name='amount')),
                ('method', models.CharField(max_length=255, verbose_name='payment method')),
                ('reference', models.CharField(max_length=255, verbose_name='payment reference')),
                ('confirmed', models.BooleanField(verbose_name='confirmed', default=True)),
                ('refundable', models.BooleanField(verbose_name='refundable', default=False)),
                ('amount_refunded', shopie.models.fields.CurrencyField(max_digits=30, decimal_places=2, default=Decimal('0.00'), verbose_name='amount refunded')),
                ('order', models.ForeignKey(related_name='payments', verbose_name='Order', to='shopie.Order')),
                ('parent', models.ForeignKey(verbose_name='payment parent', null=True, to='shopie.Payment', blank=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PaymentProperty',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('key', models.CharField(max_length=255, verbose_name='propery key')),
                ('value', models.CharField(max_length=255, verbose_name='propery value')),
                ('payment', models.ForeignKey(to='shopie.Payment', related_name='payment_properties')),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('slug', models.CharField(max_length=250, verbose_name='Slug')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('name', models.CharField(max_length=255, verbose_name='Product Name')),
                ('short_description', models.TextField(max_length=255, verbose_name='Short Description')),
                ('description', models.TextField(verbose_name='Descriptions')),
                ('unit_price', shopie.models.fields.CurrencyField(max_digits=30, decimal_places=2, blank=True, verbose_name='Unit Price', default=Decimal('0.00'))),
                ('is_active', models.BooleanField(verbose_name='Active', default=False)),
                ('status', models.IntegerField(choices=[(10, 'Draft'), (20, 'Pending Review'), (30, 'Published')], verbose_name='Status', default=10)),
                ('activation_limit', models.IntegerField(null=True, help_text='Activation limit for this product', blank=True, default=1)),
                ('license_expiry', models.IntegerField(null=True, blank=True, default=1)),
                ('file', models.FileField(upload_to=shopie.models.product.product_file_upload, blank=True, verbose_name='File')),
                ('image', models.FileField(upload_to='images', blank=True, verbose_name='Product image')),
                ('author', models.ForeignKey(verbose_name='Author', null=True, to=settings.AUTH_USER_MODEL, blank=True)),
                ('parent', models.ForeignKey(verbose_name='Product Parent', null=True, to='shopie.Product', blank=True)),
            ],
            options={
                'verbose_name': 'Product',
                'verbose_name_plural': 'Products',
            },
        ),
        migrations.CreateModel(
            name='ProductTag',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('slug', models.CharField(max_length=250, verbose_name='Slug')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
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
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('body', models.TextField(max_length=10000)),
                ('issue', models.ForeignKey(related_name='replies', verbose_name='issue', to='shopie.Issue')),
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
            field=models.ForeignKey(related_name='extra_price_fields', verbose_name='Order', to='shopie.Order'),
        ),
        migrations.AddField(
            model_name='exrapriceorderitemfield',
            name='order_item',
            field=models.ForeignKey(related_name='extra_price_fields', verbose_name='Order item', to='shopie.OrderItem'),
        ),
    ]
