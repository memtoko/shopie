# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from decimal import Decimal
import shopie.models.fields
from django.conf import settings
import shopie.models.product


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExraPriceOrderItemField',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('label', models.CharField(verbose_name='Label', max_length=255)),
                ('value', shopie.models.fields.CurrencyField(max_digits=30, verbose_name='Amount', default=Decimal('0.00'), decimal_places=2)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ExtraPriceOrderField',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('label', models.CharField(verbose_name='Label', max_length=255)),
                ('value', shopie.models.fields.CurrencyField(max_digits=30, verbose_name='Amount', default=Decimal('0.00'), decimal_places=2)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Issue',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('slug', models.CharField(verbose_name='Slug', max_length=250)),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now=True, db_index=True)),
                ('name', models.CharField(verbose_name='Name', max_length=255)),
                ('body', models.TextField(verbose_name='The body', max_length=10000)),
                ('target_object_id', models.CharField(blank=True, null=True, max_length=255)),
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
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('slug', models.CharField(verbose_name='Slug', max_length=250)),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now=True, db_index=True)),
                ('name', models.CharField(max_length=100, verbose_name='The label name', unique=True)),
                ('description', models.CharField(blank=True, verbose_name='The label description', max_length=250)),
                ('issues', models.ManyToManyField(blank=True, to='shopie.Issue', verbose_name='issues')),
            ],
            options={
                'verbose_name_plural': 'labels',
                'verbose_name': 'label',
            },
        ),
        migrations.CreateModel(
            name='License',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('license_key', models.CharField(max_length=255, verbose_name='license key', unique=True)),
                ('status', models.IntegerField(default=10, choices=[(10, 'inactive'), (20, 'active')])),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('active_remaining', models.IntegerField(blank=True, verbose_name='activate remaining', null=True)),
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
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('site', models.CharField(verbose_name='site', max_length=255)),
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
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now=True, db_index=True)),
                ('status', models.IntegerField(verbose_name='Status', default=10, choices=[(10, 'Building'), (20, 'Confirming'), (30, 'Received'), (40, 'Accepted'), (50, 'Rejected')])),
                ('full_name', models.CharField(blank=True, verbose_name='Full name', max_length=255)),
                ('email', models.EmailField(verbose_name='Email address', max_length=254)),
                ('received_at', models.DateTimeField(blank=True, verbose_name='received_at', null=True)),
                ('order_key', models.CharField(blank=True, max_length=255, verbose_name='Order Key', unique=True)),
                ('order_subtotal', shopie.models.fields.CurrencyField(max_digits=30, verbose_name='Order Subtotal', default=Decimal('0.0'), decimal_places=2)),
                ('order_total', shopie.models.fields.CurrencyField(max_digits=30, verbose_name='Order Total', default=Decimal('0.0'), decimal_places=2)),
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
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('unit_price', shopie.models.fields.CurrencyField(max_digits=30, verbose_name='Unit Price', default=Decimal('0.0'), decimal_places=2)),
                ('quantity', models.IntegerField(verbose_name='Quantity', default=1)),
                ('line_subtotal', shopie.models.fields.CurrencyField(max_digits=30, verbose_name='Line Subtotal', default=Decimal('0.0'), decimal_places=2)),
                ('line_total', shopie.models.fields.CurrencyField(max_digits=30, verbose_name='Line Total', default=Decimal('0.0'), decimal_places=2)),
                ('order', models.ForeignKey(related_name='items', to='shopie.Order', verbose_name='Order Item')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now=True, db_index=True)),
                ('amount', shopie.models.fields.CurrencyField(max_digits=30, verbose_name='amount', default=Decimal('0.00'), decimal_places=2)),
                ('method', models.CharField(verbose_name='payment method', max_length=255)),
                ('transaction_id', models.CharField(verbose_name='transaction ID', max_length=255)),
                ('reference', models.CharField(verbose_name='payment reference', max_length=255)),
                ('confirmed', models.BooleanField(verbose_name='confirmed', default=True)),
                ('refundable', models.BooleanField(verbose_name='refundable', default=False)),
                ('amount_refunded', shopie.models.fields.CurrencyField(max_digits=30, verbose_name='amount refunded', default=Decimal('0.00'), decimal_places=2)),
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
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('slug', models.CharField(verbose_name='Slug', max_length=250)),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now=True, db_index=True)),
                ('name', models.CharField(verbose_name='Product Name', max_length=255)),
                ('short_description', models.TextField(verbose_name='Short Description', max_length=255)),
                ('description', models.TextField(verbose_name='Descriptions')),
                ('unit_price', shopie.models.fields.CurrencyField(blank=True, max_digits=30, verbose_name='Unit Price', default=Decimal('0.00'), decimal_places=2)),
                ('is_active', models.BooleanField(verbose_name='Active', default=False)),
                ('status', models.IntegerField(verbose_name='Status', default=10, choices=[(10, 'Draft'), (20, 'Pending Review'), (30, 'Published')])),
                ('activation_limit', models.IntegerField(help_text='Activation limit for this product', blank=True, null=True, default=1)),
                ('license_expiry', models.IntegerField(blank=True, null=True, default=1)),
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
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('slug', models.CharField(verbose_name='Slug', max_length=250)),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now=True, db_index=True)),
                ('name', models.CharField(verbose_name='Name', max_length=255)),
                ('description', models.TextField(blank=True, verbose_name='Description', default='')),
                ('image', models.FileField(verbose_name='Product image', upload_to='images')),
                ('products', models.ManyToManyField(to='shopie.Product', verbose_name='products')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Reply',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now=True, db_index=True)),
                ('body', models.TextField(max_length=10000)),
                ('issue', models.ForeignKey(related_name='replies', to='shopie.Issue', verbose_name='issue')),
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
            field=models.ForeignKey(related_name='extra_price_fields', to='shopie.Order', verbose_name='Order'),
        ),
        migrations.AddField(
            model_name='exrapriceorderitemfield',
            name='order_item',
            field=models.ForeignKey(related_name='extra_price_fields', to='shopie.OrderItem', verbose_name='Order item'),
        ),
    ]
