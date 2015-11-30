# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import shopie.models.product
from decimal import Decimal
import shopie.models.fields
import uuid
import django.utils.timezone
import shopie.models.order
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExraPriceOrderItemField',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('label', models.CharField(verbose_name='Label', max_length=255)),
                ('value', shopie.models.fields.CurrencyField(default=Decimal('0.00'), decimal_places=2, max_digits=30, verbose_name='Amount')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ExtraPriceOrderField',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('label', models.CharField(verbose_name='Label', max_length=255)),
                ('value', shopie.models.fields.CurrencyField(default=Decimal('0.00'), decimal_places=2, max_digits=30, verbose_name='Amount')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Issue',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('slug', models.CharField(verbose_name='Slug', max_length=250)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('name', models.CharField(verbose_name='Name', max_length=255)),
                ('body', models.TextField(verbose_name='The body', max_length=10000)),
                ('target_object_id', models.CharField(blank=True, null=True, max_length=255)),
                ('is_closed', models.BooleanField(verbose_name='Is close?', default=False)),
                ('target_content_type', models.ForeignKey(null=True, blank=True, to='contenttypes.ContentType')),
                ('user', models.ForeignKey(verbose_name='user', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Label',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('slug', models.CharField(verbose_name='Slug', max_length=250)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('name', models.CharField(unique=True, verbose_name='The label name', max_length=100)),
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
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('license_key', models.CharField(unique=True, verbose_name='license key', max_length=255)),
                ('status', models.IntegerField(default=10, choices=[(10, 'inactive'), (20, 'active')])),
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
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('site', models.CharField(verbose_name='site', max_length=255)),
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
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('status', models.IntegerField(default=10, choices=[(10, 'Building'), (20, 'Confirming'), (30, 'Received'), (40, 'Accepted'), (50, 'Rejected')], verbose_name='Status')),
                ('full_name', models.CharField(blank=True, max_length=255, verbose_name='Full name')),
                ('number', models.CharField(blank=True, max_length=255, verbose_name='order number')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='Email address')),
                ('received_at', models.DateTimeField(blank=True, null=True, verbose_name='received_at')),
                ('order_key', models.CharField(unique=True, default=shopie.models.order.create_order_key, verbose_name='Order Key', max_length=255, blank=True)),
                ('order_subtotal', shopie.models.fields.CurrencyField(default=Decimal('0.0'), decimal_places=2, max_digits=30, verbose_name='Order Subtotal')),
                ('order_total', shopie.models.fields.CurrencyField(default=Decimal('0.0'), decimal_places=2, max_digits=30, verbose_name='Order Total')),
                ('accepted_at', models.DateTimeField(blank=True, null=True, verbose_name='accepted date')),
                ('rejected_at', models.DateTimeField(blank=True, null=True, verbose_name='rejected data')),
                ('accepted_by', models.ForeignKey(verbose_name='accepted by', null=True, blank=True, to=settings.AUTH_USER_MODEL, related_name='+')),
                ('rejected_by', models.ForeignKey(verbose_name='rejected by', null=True, blank=True, to=settings.AUTH_USER_MODEL, related_name='+')),
                ('user', models.ForeignKey(verbose_name='customer', null=True, blank=True, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Order',
                'verbose_name_plural': 'Orders',
            },
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('unit_price', shopie.models.fields.CurrencyField(default=Decimal('0.0'), decimal_places=2, max_digits=30, verbose_name='Unit Price')),
                ('quantity', models.IntegerField(default=1, verbose_name='Quantity')),
                ('is_renewal', models.BooleanField(verbose_name='is renewal', default=False)),
                ('renewal_license', models.CharField(blank=True, null=True, max_length=255, verbose_name='renewal license key')),
                ('line_subtotal', shopie.models.fields.CurrencyField(default=Decimal('0.0'), decimal_places=2, max_digits=30, verbose_name='Line Subtotal')),
                ('line_total', shopie.models.fields.CurrencyField(default=Decimal('0.0'), decimal_places=2, max_digits=30, verbose_name='Line Total')),
                ('order', models.ForeignKey(verbose_name='Order Item', related_name='items', to='shopie.Order')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('amount', shopie.models.fields.CurrencyField(default=Decimal('0.00'), decimal_places=2, max_digits=30, verbose_name='amount')),
                ('method', models.CharField(verbose_name='payment method', max_length=255)),
                ('reference', models.CharField(verbose_name='payment reference', max_length=255)),
                ('confirmed', models.BooleanField(verbose_name='confirmed', default=True)),
                ('refundable', models.BooleanField(verbose_name='refundable', default=False)),
                ('amount_refunded', shopie.models.fields.CurrencyField(default=Decimal('0.00'), decimal_places=2, max_digits=30, verbose_name='amount refunded')),
                ('order', models.ForeignKey(verbose_name='Order', related_name='payments', to='shopie.Order')),
                ('parent', models.ForeignKey(verbose_name='payment parent', null=True, blank=True, to='shopie.Payment')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PaymentProperty',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('key', models.CharField(verbose_name='propery key', max_length=255)),
                ('value', models.CharField(verbose_name='propery value', max_length=255)),
                ('payment', models.ForeignKey(related_name='payment_properties', to='shopie.Payment')),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('slug', models.CharField(verbose_name='Slug', max_length=250)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('name', models.CharField(verbose_name='Product Name', max_length=255)),
                ('short_description', models.TextField(verbose_name='Short Description', max_length=255)),
                ('description', models.TextField(verbose_name='Descriptions')),
                ('unit_price', shopie.models.fields.CurrencyField(verbose_name='Unit Price', default=Decimal('0.00'), decimal_places=2, max_digits=30, blank=True)),
                ('is_active', models.BooleanField(verbose_name='Active', default=False)),
                ('status', models.IntegerField(default=10, choices=[(10, 'Draft'), (20, 'Pending Review'), (30, 'Published')], verbose_name='Status')),
                ('activation_limit', models.IntegerField(default=1, help_text='Activation limit for this product', null=True, blank=True)),
                ('license_expiry', models.IntegerField(default=1, null=True, blank=True)),
                ('file', models.FileField(blank=True, upload_to=shopie.models.product.product_file_upload, verbose_name='File')),
                ('image', models.FileField(blank=True, upload_to='images', verbose_name='Product image')),
                ('author', models.ForeignKey(verbose_name='Author', null=True, blank=True, to=settings.AUTH_USER_MODEL)),
                ('parent', models.ForeignKey(verbose_name='Product Parent', null=True, blank=True, to='shopie.Product')),
            ],
            options={
                'verbose_name': 'Product',
                'verbose_name_plural': 'Products',
            },
        ),
        migrations.CreateModel(
            name='ProductTag',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('slug', models.CharField(verbose_name='Slug', max_length=250)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('name', models.CharField(verbose_name='Name', max_length=255)),
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
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('body', models.TextField(max_length=10000)),
                ('issue', models.ForeignKey(verbose_name='issue', related_name='replies', to='shopie.Issue')),
                ('user', models.ForeignKey(verbose_name='user', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='orderitem',
            name='product',
            field=models.ForeignKey(verbose_name='Product', to='shopie.Product'),
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
    ]
