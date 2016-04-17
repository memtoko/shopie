# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from decimal import Decimal
import shopie.models.product
from django.conf import settings
import shopie.models.fields
import shopie.models.order
import django.utils.timezone
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
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('label', models.CharField(max_length=255, verbose_name='Label')),
                ('value', shopie.models.fields.CurrencyField(decimal_places=2, default=Decimal('0.00'), max_digits=30, verbose_name='Amount')),
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
                ('label', models.CharField(max_length=255, verbose_name='Label')),
                ('value', shopie.models.fields.CurrencyField(decimal_places=2, default=Decimal('0.00'), max_digits=30, verbose_name='Amount')),
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
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('name', models.CharField(max_length=255, verbose_name='Name')),
                ('body', models.TextField(max_length=10000, verbose_name='The body')),
                ('target_object_id', models.CharField(blank=True, max_length=255, null=True)),
                ('is_closed', models.BooleanField(default=False, verbose_name='Is close?')),
                ('target_content_type', models.ForeignKey(to='contenttypes.ContentType', blank=True, null=True)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL, verbose_name='user')),
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
                ('slug', models.CharField(max_length=250, verbose_name='Slug')),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('name', models.CharField(unique=True, max_length=100, verbose_name='The label name')),
                ('description', models.CharField(blank=True, max_length=250, verbose_name='The label description')),
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
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('license_key', models.CharField(unique=True, max_length=255, verbose_name='license key')),
                ('status', models.IntegerField(choices=[(10, 'inactive'), (20, 'active'), (30, 'expired')], default=10)),
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
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('site', models.CharField(max_length=255, verbose_name='site')),
                ('status', models.IntegerField(choices=[(10, 'inactive'), (20, 'active'), (30, 'expired')], default=20)),
                ('license', models.ForeignKey(to='shopie.License')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Media',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('slug', models.CharField(max_length=250, verbose_name='Slug')),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('name', models.CharField(blank=True, max_length=255, verbose_name='Product Name')),
                ('description', models.TextField(blank=True, verbose_name='Descriptions')),
                ('file', models.FileField(upload_to='', verbose_name='File')),
                ('is_public', models.BooleanField(default=False, verbose_name='is public')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL, null=True, blank=True, verbose_name='owner')),
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
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('status', models.IntegerField(choices=[(10, 'Building'), (20, 'Confirming'), (30, 'Received'), (40, 'Accepted'), (50, 'Rejected')], default=10, verbose_name='Status')),
                ('full_name', models.CharField(blank=True, max_length=255, verbose_name='Full name')),
                ('number', models.CharField(blank=True, max_length=255, verbose_name='order number')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='Email address')),
                ('received_at', models.DateTimeField(blank=True, null=True, verbose_name='received_at')),
                ('order_key', models.CharField(unique=True, blank=True, max_length=255, default=shopie.models.order.create_order_key, verbose_name='Order Key')),
                ('order_subtotal', shopie.models.fields.CurrencyField(decimal_places=2, default=Decimal('0.0'), max_digits=30, verbose_name='Order Subtotal')),
                ('order_total', shopie.models.fields.CurrencyField(decimal_places=2, default=Decimal('0.0'), max_digits=30, verbose_name='Order Total')),
                ('accepted_at', models.DateTimeField(blank=True, null=True, verbose_name='accepted date')),
                ('rejected_at', models.DateTimeField(blank=True, null=True, verbose_name='rejected data')),
                ('accepted_by', models.ForeignKey(to=settings.AUTH_USER_MODEL, null=True, blank=True, verbose_name='accepted by', related_name='+')),
                ('rejected_by', models.ForeignKey(to=settings.AUTH_USER_MODEL, null=True, blank=True, verbose_name='rejected by', related_name='+')),
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
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('unit_price', shopie.models.fields.CurrencyField(decimal_places=2, default=Decimal('0.0'), max_digits=30, verbose_name='Unit Price')),
                ('quantity', models.IntegerField(default=1, verbose_name='Quantity')),
                ('is_renewal', models.BooleanField(default=False, verbose_name='is renewal')),
                ('renewal_license', models.CharField(blank=True, max_length=255, null=True, verbose_name='renewal license key')),
                ('line_subtotal', shopie.models.fields.CurrencyField(decimal_places=2, default=Decimal('0.0'), max_digits=30, verbose_name='Line Subtotal')),
                ('line_total', shopie.models.fields.CurrencyField(decimal_places=2, default=Decimal('0.0'), max_digits=30, verbose_name='Line Total')),
                ('order', models.ForeignKey(to='shopie.Order', verbose_name='Order Item', related_name='items')),
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
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('amount', shopie.models.fields.CurrencyField(decimal_places=2, default=Decimal('0.00'), max_digits=30, verbose_name='amount')),
                ('method', models.CharField(max_length=255, verbose_name='payment method')),
                ('reference', models.CharField(max_length=255, verbose_name='payment reference')),
                ('confirmed', models.BooleanField(default=True, verbose_name='confirmed')),
                ('refundable', models.BooleanField(default=False, verbose_name='refundable')),
                ('amount_refunded', shopie.models.fields.CurrencyField(decimal_places=2, default=Decimal('0.00'), max_digits=30, verbose_name='amount refunded')),
                ('order', models.ForeignKey(to='shopie.Order', verbose_name='Order', related_name='payments')),
                ('parent', models.ForeignKey(to='shopie.Payment', null=True, blank=True, verbose_name='payment parent')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PaymentProperty',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('key', models.CharField(max_length=255, verbose_name='propery key')),
                ('value', models.CharField(max_length=255, verbose_name='propery value')),
                ('payment', models.ForeignKey(to='shopie.Payment', related_name='payment_properties')),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('slug', models.CharField(max_length=250, verbose_name='Slug')),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('name', models.CharField(max_length=255, verbose_name='Product Name')),
                ('short_description', models.TextField(blank=True, max_length=255, verbose_name='Short Description')),
                ('description', models.TextField(blank=True, verbose_name='Descriptions')),
                ('unit_price', shopie.models.fields.CurrencyField(blank=True, decimal_places=2, default=Decimal('0.00'), max_digits=30, verbose_name='Unit Price')),
                ('is_active', models.BooleanField(default=False, verbose_name='Active')),
                ('status', models.IntegerField(choices=[(10, 'Draft'), (20, 'Pending Review'), (30, 'Published')], default=10, verbose_name='Status')),
                ('activation_limit', models.IntegerField(blank=True, help_text='Activation limit for this product', default=1, null=True)),
                ('license_expiry', models.IntegerField(blank=True, default=1, null=True)),
                ('file', models.FileField(blank=True, upload_to=shopie.models.product.product_file_upload, verbose_name='File')),
                ('image', models.FileField(blank=True, upload_to='images', verbose_name='Product image')),
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
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('slug', models.CharField(max_length=250, verbose_name='Slug')),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('name', models.CharField(max_length=255, verbose_name='Name')),
                ('description', models.TextField(blank=True, default='', verbose_name='Description')),
                ('image', models.FileField(blank=True, upload_to='images', verbose_name='image')),
                ('products', models.ManyToManyField(blank=True, to='shopie.Product', related_name='tags', verbose_name='products')),
            ],
            options={
                'verbose_name_plural': 'Product Tags',
                'verbose_name': 'Product Tag',
            },
        ),
        migrations.CreateModel(
            name='Reply',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
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
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('full_name', models.CharField(blank=True, max_length=200)),
                ('bio', models.CharField(blank=True, max_length=200)),
                ('website', models.URLField(blank=True)),
                ('status', models.CharField(max_length=200, default='active')),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL)),
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
