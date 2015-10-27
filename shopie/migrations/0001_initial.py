# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings
from decimal import Decimal
import shopie.models.fields
import django.utils.timezone
import shopie.models.product
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ExraPriceOrderItemField',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('label', models.CharField(max_length=255, verbose_name='Label')),
                ('value', shopie.models.fields.CurrencyField(default=Decimal('0.00'), verbose_name='Amount', max_digits=30, decimal_places=2)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ExtraPriceOrderField',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('label', models.CharField(max_length=255, verbose_name='Label')),
                ('value', shopie.models.fields.CurrencyField(default=Decimal('0.00'), verbose_name='Amount', max_digits=30, decimal_places=2)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Issue',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('slug', models.CharField(max_length=250, verbose_name='Slug')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('name', models.CharField(max_length=255, verbose_name='Name')),
                ('body', models.TextField(max_length=10000, verbose_name='The body')),
                ('target_object_id', models.CharField(blank=True, null=True, max_length=255)),
                ('is_closed', models.BooleanField(default=False, verbose_name='Is close?')),
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
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('slug', models.CharField(max_length=250, verbose_name='Slug')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('name', models.CharField(unique=True, max_length=100, verbose_name='The label name')),
                ('description', models.CharField(blank=True, max_length=250, verbose_name='The label description')),
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
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('license_key', models.CharField(unique=True, max_length=255, verbose_name='license key')),
                ('status', models.IntegerField(choices=[(10, 'inactive'), (20, 'active')], default=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('active_remaining', models.IntegerField(blank=True, null=True, verbose_name='activate remaining')),
                ('activate_count', models.IntegerField(default=0, verbose_name='Count activation')),
                ('expired_at', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='LicenseActivation',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('site', models.CharField(max_length=255, verbose_name='site')),
                ('activate_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
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
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('status', models.IntegerField(choices=[(10, 'Building'), (20, 'Confirming'), (30, 'Received'), (40, 'Accepted'), (50, 'Rejected')], default=10, verbose_name='Status')),
                ('full_name', models.CharField(blank=True, max_length=255, verbose_name='Full name')),
                ('email', models.EmailField(max_length=254, verbose_name='Email address')),
                ('received_at', models.DateTimeField(blank=True, null=True, verbose_name='received_at')),
                ('order_key', models.CharField(blank=True, unique=True, max_length=255, verbose_name='Order Key')),
                ('order_subtotal', shopie.models.fields.CurrencyField(default=Decimal('0.0'), verbose_name='Order Subtotal', max_digits=30, decimal_places=2)),
                ('order_total', shopie.models.fields.CurrencyField(default=Decimal('0.0'), verbose_name='Order Total', max_digits=30, decimal_places=2)),
                ('accepted_at', models.DateTimeField(blank=True, null=True, verbose_name='accepted date')),
                ('rejected_at', models.DateTimeField(blank=True, null=True, verbose_name='rejected data')),
                ('accepted_by', models.ForeignKey(null=True, to=settings.AUTH_USER_MODEL, verbose_name='accepted by', blank=True, related_name='+')),
                ('rejected_by', models.ForeignKey(null=True, to=settings.AUTH_USER_MODEL, verbose_name='rejected by', blank=True, related_name='+')),
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
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('unit_price', shopie.models.fields.CurrencyField(default=Decimal('0.0'), verbose_name='Unit Price', max_digits=30, decimal_places=2)),
                ('quantity', models.IntegerField(default=1, verbose_name='Quantity')),
                ('line_subtotal', shopie.models.fields.CurrencyField(default=Decimal('0.0'), verbose_name='Line Subtotal', max_digits=30, decimal_places=2)),
                ('line_total', shopie.models.fields.CurrencyField(default=Decimal('0.0'), verbose_name='Line Total', max_digits=30, decimal_places=2)),
                ('order', models.ForeignKey(to='shopie.Order', verbose_name='Order Item', related_name='items')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('amount', shopie.models.fields.CurrencyField(default=Decimal('0.00'), verbose_name='amount', max_digits=30, decimal_places=2)),
                ('method', models.CharField(max_length=255, verbose_name='payment method')),
                ('transaction_id', models.CharField(max_length=255, verbose_name='transaction ID')),
                ('reference', models.CharField(max_length=255, verbose_name='payment reference')),
                ('confirmed', models.BooleanField(default=True, verbose_name='confirmed')),
                ('refundable', models.BooleanField(default=False, verbose_name='refundable')),
                ('amount_refunded', shopie.models.fields.CurrencyField(default=Decimal('0.00'), verbose_name='amount refunded', max_digits=30, decimal_places=2)),
                ('order', models.ForeignKey(to='shopie.Order', verbose_name='Order')),
                ('parent', models.ForeignKey(null=True, to='shopie.Payment', verbose_name='payment parent', blank=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PaymentProperty',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('key', models.CharField(max_length=255, verbose_name='propery key')),
                ('value', models.CharField(max_length=255, verbose_name='propery value')),
                ('payment', models.ForeignKey(related_name='payment_properties', to='shopie.Payment')),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('slug', models.CharField(max_length=250, verbose_name='Slug')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('name', models.CharField(max_length=255, verbose_name='Product Name')),
                ('short_description', models.TextField(max_length=255, verbose_name='Short Description')),
                ('description', models.TextField(verbose_name='Descriptions')),
                ('unit_price', shopie.models.fields.CurrencyField(blank=True, default=Decimal('0.00'), verbose_name='Unit Price', max_digits=30, decimal_places=2)),
                ('is_active', models.BooleanField(default=False, verbose_name='Active')),
                ('status', models.IntegerField(choices=[(10, 'Draft'), (20, 'Pending Review'), (30, 'Published')], default=10, verbose_name='Status')),
                ('activation_limit', models.IntegerField(blank=True, default=1, null=True, help_text='Activation limit for this product')),
                ('license_expiry', models.IntegerField(blank=True, default=1, null=True)),
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
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('slug', models.CharField(max_length=250, verbose_name='Slug')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('name', models.CharField(max_length=255, verbose_name='Name')),
                ('description', models.TextField(blank=True, default='', verbose_name='Description')),
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
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
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
