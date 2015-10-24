# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import shopie.models.product
import uuid
import shopie.models.fields
from decimal import Decimal
from django.conf import settings
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
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('label', models.CharField(max_length=255, verbose_name='Label')),
                ('value', shopie.models.fields.CurrencyField(verbose_name='Amount', decimal_places=2, default=Decimal('0.00'), max_digits=30)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ExtraPriceOrderField',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('label', models.CharField(max_length=255, verbose_name='Label')),
                ('value', shopie.models.fields.CurrencyField(verbose_name='Amount', decimal_places=2, default=Decimal('0.00'), max_digits=30)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Issue',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('slug', models.CharField(max_length=250, verbose_name='Slug')),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('name', models.CharField(max_length=255, verbose_name='Name')),
                ('body', models.TextField(max_length=10000, verbose_name='The body')),
                ('target_object_id', models.CharField(max_length=255, null=True, blank=True)),
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
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('slug', models.CharField(max_length=250, verbose_name='Slug')),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('name', models.CharField(max_length=100, unique=True, verbose_name='The label name')),
                ('description', models.CharField(max_length=250, verbose_name='The label description', blank=True)),
                ('issues', models.ManyToManyField(verbose_name='issues', to='shopie.Issue', blank=True)),
            ],
            options={
                'verbose_name_plural': 'labels',
                'verbose_name': 'label',
            },
        ),
        migrations.CreateModel(
            name='License',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('license_key', models.CharField(max_length=255, unique=True, verbose_name='license key')),
                ('status', models.IntegerField(default=10, choices=[(10, 'inactive'), (20, 'active')])),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('active_remaining', models.IntegerField(verbose_name='activate remaining', null=True, blank=True)),
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
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('site', models.CharField(max_length=255, verbose_name='site')),
                ('activate_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
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
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('status', models.IntegerField(verbose_name='Status', default=10, choices=[(10, 'Building'), (20, 'Confirming'), (30, 'Received'), (40, 'Accepted'), (50, 'Rejected')])),
                ('full_name', models.CharField(max_length=255, verbose_name='Full name', blank=True)),
                ('email', models.EmailField(max_length=254, verbose_name='Email address')),
                ('received_at', models.DateTimeField(verbose_name='received_at', null=True, blank=True)),
                ('order_key', models.CharField(max_length=255, unique=True, verbose_name='Order Key', blank=True)),
                ('order_subtotal', shopie.models.fields.CurrencyField(verbose_name='Order Subtotal', decimal_places=2, default=Decimal('0.0'), max_digits=30)),
                ('order_total', shopie.models.fields.CurrencyField(verbose_name='Order Total', decimal_places=2, default=Decimal('0.0'), max_digits=30)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL, null=True, blank=True, verbose_name='customer')),
            ],
            options={
                'verbose_name_plural': 'Orders',
                'verbose_name': 'Order',
            },
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('unit_price', shopie.models.fields.CurrencyField(verbose_name='Unit Price', decimal_places=2, default=Decimal('0.0'), max_digits=30)),
                ('quantity', models.IntegerField(verbose_name='Quantity', default=1)),
                ('line_subtotal', shopie.models.fields.CurrencyField(verbose_name='Line Subtotal', decimal_places=2, default=Decimal('0.0'), max_digits=30)),
                ('line_total', shopie.models.fields.CurrencyField(verbose_name='Line Total', decimal_places=2, default=Decimal('0.0'), max_digits=30)),
                ('order', models.ForeignKey(to='shopie.Order', related_name='items', verbose_name='Order Item')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('amount', shopie.models.fields.CurrencyField(verbose_name='amount', decimal_places=2, default=Decimal('0.00'), max_digits=30)),
                ('method', models.CharField(max_length=255, verbose_name='payment method')),
                ('transaction_id', models.CharField(max_length=255, verbose_name='transaction ID')),
                ('reference', models.CharField(max_length=255, verbose_name='payment reference')),
                ('confirmed', models.BooleanField(verbose_name='confirmed', default=True)),
                ('refundable', models.BooleanField(verbose_name='refundable', default=False)),
                ('amount_refunded', shopie.models.fields.CurrencyField(verbose_name='amount refunded', decimal_places=2, default=Decimal('0.00'), max_digits=30)),
                ('order', models.ForeignKey(to='shopie.Order', verbose_name='Order')),
                ('parent', models.ForeignKey(to='shopie.Payment', null=True, blank=True, verbose_name='payment parent')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('slug', models.CharField(max_length=250, verbose_name='Slug')),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('name', models.CharField(max_length=255, verbose_name='Product Name')),
                ('short_description', models.TextField(max_length=255, verbose_name='Short Description')),
                ('description', models.TextField(verbose_name='Descriptions')),
                ('unit_price', shopie.models.fields.CurrencyField(verbose_name='Unit Price', decimal_places=2, default=Decimal('0.00'), max_digits=30, blank=True)),
                ('is_active', models.BooleanField(verbose_name='Active', default=False)),
                ('status', models.IntegerField(verbose_name='Status', default=10, choices=[(10, 'Draft'), (20, 'Pending Review'), (30, 'Published')])),
                ('activation_limit', models.IntegerField(help_text='Activation limit for this product', default=1, null=True, blank=True)),
                ('license_expiry', models.IntegerField(default=1, null=True, blank=True)),
                ('file', models.FileField(verbose_name='File', upload_to=shopie.models.product.product_file_upload)),
                ('image', models.FileField(verbose_name='Product image', upload_to='images')),
                ('author', models.ForeignKey(to=settings.AUTH_USER_MODEL, null=True, blank=True, verbose_name='Author')),
                ('parent', models.ForeignKey(to='shopie.Product', null=True, blank=True, verbose_name='Product Parent')),
            ],
            options={
                'verbose_name_plural': 'Products',
                'verbose_name': 'Product',
            },
        ),
        migrations.CreateModel(
            name='ProductTag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('slug', models.CharField(max_length=250, verbose_name='Slug')),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('name', models.CharField(max_length=255, verbose_name='Name')),
                ('description', models.TextField(verbose_name='Description', default='', blank=True)),
                ('image', models.FileField(verbose_name='Product image', upload_to='images')),
                ('products', models.ManyToManyField(verbose_name='products', to='shopie.Product')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Reply',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('uuid', models.UUIDField(verbose_name='UUID', default=uuid.uuid4)),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('body', models.TextField(max_length=10000)),
                ('issue', models.ForeignKey(to='shopie.Issue', related_name='replies', verbose_name='issue')),
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
            field=models.ForeignKey(to='shopie.Order', related_name='extra_price_fields', verbose_name='Order'),
        ),
        migrations.AddField(
            model_name='exrapriceorderitemfield',
            name='order_item',
            field=models.ForeignKey(to='shopie.OrderItem', related_name='extra_price_fields', verbose_name='Order item'),
        ),
    ]
