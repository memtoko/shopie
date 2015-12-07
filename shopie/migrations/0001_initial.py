# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import shopie.models.fields
import shopie.models.order
import uuid
from django.conf import settings
from decimal import Decimal
import django.utils.timezone
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
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('label', models.CharField(verbose_name='Label', max_length=255)),
                ('value', shopie.models.fields.CurrencyField(default=Decimal('0.00'), verbose_name='Amount', decimal_places=2, max_digits=30)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ExtraPriceOrderField',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('label', models.CharField(verbose_name='Label', max_length=255)),
                ('value', shopie.models.fields.CurrencyField(default=Decimal('0.00'), verbose_name='Amount', decimal_places=2, max_digits=30)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Issue',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('slug', models.CharField(verbose_name='Slug', max_length=250)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('name', models.CharField(verbose_name='Name', max_length=255)),
                ('body', models.TextField(verbose_name='The body', max_length=10000)),
                ('target_object_id', models.CharField(null=True, max_length=255, blank=True)),
                ('is_closed', models.BooleanField(default=False, verbose_name='Is close?')),
                ('target_content_type', models.ForeignKey(null=True, to='contenttypes.ContentType', blank=True)),
                ('user', models.ForeignKey(verbose_name='user', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Label',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('slug', models.CharField(verbose_name='Slug', max_length=250)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('name', models.CharField(verbose_name='The label name', unique=True, max_length=100)),
                ('description', models.CharField(verbose_name='The label description', max_length=250, blank=True)),
                ('issues', models.ManyToManyField(verbose_name='issues', to='shopie.Issue', blank=True)),
            ],
            options={
                'verbose_name': 'label',
                'verbose_name_plural': 'labels',
            },
        ),
        migrations.CreateModel(
            name='License',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('license_key', models.CharField(verbose_name='license key', unique=True, max_length=255)),
                ('status', models.IntegerField(default=10, choices=[(10, 'inactive'), (20, 'active')])),
                ('active_remaining', models.IntegerField(verbose_name='activate remaining', null=True, blank=True)),
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
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
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
            name='Media',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('slug', models.CharField(verbose_name='Slug', max_length=250)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('name', models.CharField(verbose_name='Product Name', max_length=255, blank=True)),
                ('description', models.TextField(verbose_name='Descriptions', blank=True)),
                ('file', models.FileField(verbose_name='File', upload_to='')),
                ('is_public', models.BooleanField(default=False, verbose_name='is public')),
                ('user', models.ForeignKey(null=True, verbose_name='owner', to=settings.AUTH_USER_MODEL, blank=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('status', models.IntegerField(default=10, verbose_name='Status', choices=[(10, 'Building'), (20, 'Confirming'), (30, 'Received'), (40, 'Accepted'), (50, 'Rejected')])),
                ('full_name', models.CharField(verbose_name='Full name', max_length=255, blank=True)),
                ('number', models.CharField(verbose_name='order number', max_length=255, blank=True)),
                ('email', models.EmailField(verbose_name='Email address', max_length=254, blank=True)),
                ('received_at', models.DateTimeField(verbose_name='received_at', null=True, blank=True)),
                ('order_key', models.CharField(default=shopie.models.order.create_order_key, verbose_name='Order Key', unique=True, max_length=255, blank=True)),
                ('order_subtotal', shopie.models.fields.CurrencyField(default=Decimal('0.0'), verbose_name='Order Subtotal', decimal_places=2, max_digits=30)),
                ('order_total', shopie.models.fields.CurrencyField(default=Decimal('0.0'), verbose_name='Order Total', decimal_places=2, max_digits=30)),
                ('accepted_at', models.DateTimeField(verbose_name='accepted date', null=True, blank=True)),
                ('rejected_at', models.DateTimeField(verbose_name='rejected data', null=True, blank=True)),
                ('accepted_by', models.ForeignKey(null=True, related_name='+', verbose_name='accepted by', to=settings.AUTH_USER_MODEL, blank=True)),
                ('rejected_by', models.ForeignKey(null=True, related_name='+', verbose_name='rejected by', to=settings.AUTH_USER_MODEL, blank=True)),
                ('user', models.ForeignKey(null=True, verbose_name='customer', to=settings.AUTH_USER_MODEL, blank=True)),
            ],
            options={
                'verbose_name': 'Order',
                'verbose_name_plural': 'Orders',
            },
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('unit_price', shopie.models.fields.CurrencyField(default=Decimal('0.0'), verbose_name='Unit Price', decimal_places=2, max_digits=30)),
                ('quantity', models.IntegerField(default=1, verbose_name='Quantity')),
                ('is_renewal', models.BooleanField(default=False, verbose_name='is renewal')),
                ('renewal_license', models.CharField(verbose_name='renewal license key', null=True, max_length=255, blank=True)),
                ('line_subtotal', shopie.models.fields.CurrencyField(default=Decimal('0.0'), verbose_name='Line Subtotal', decimal_places=2, max_digits=30)),
                ('line_total', shopie.models.fields.CurrencyField(default=Decimal('0.0'), verbose_name='Line Total', decimal_places=2, max_digits=30)),
                ('order', models.ForeignKey(related_name='items', verbose_name='Order Item', to='shopie.Order')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('amount', shopie.models.fields.CurrencyField(default=Decimal('0.00'), verbose_name='amount', decimal_places=2, max_digits=30)),
                ('method', models.CharField(verbose_name='payment method', max_length=255)),
                ('reference', models.CharField(verbose_name='payment reference', max_length=255)),
                ('confirmed', models.BooleanField(default=True, verbose_name='confirmed')),
                ('refundable', models.BooleanField(default=False, verbose_name='refundable')),
                ('amount_refunded', shopie.models.fields.CurrencyField(default=Decimal('0.00'), verbose_name='amount refunded', decimal_places=2, max_digits=30)),
                ('order', models.ForeignKey(related_name='payments', verbose_name='Order', to='shopie.Order')),
                ('parent', models.ForeignKey(null=True, verbose_name='payment parent', to='shopie.Payment', blank=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PaymentProperty',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('key', models.CharField(verbose_name='propery key', max_length=255)),
                ('value', models.CharField(verbose_name='propery value', max_length=255)),
                ('payment', models.ForeignKey(to='shopie.Payment', related_name='payment_properties')),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('slug', models.CharField(verbose_name='Slug', max_length=250)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('name', models.CharField(verbose_name='Product Name', max_length=255)),
                ('short_description', models.TextField(verbose_name='Short Description', max_length=255)),
                ('description', models.TextField(verbose_name='Descriptions')),
                ('unit_price', shopie.models.fields.CurrencyField(default=Decimal('0.00'), verbose_name='Unit Price', decimal_places=2, max_digits=30, blank=True)),
                ('is_active', models.BooleanField(default=False, verbose_name='Active')),
                ('status', models.IntegerField(default=10, verbose_name='Status', choices=[(10, 'Draft'), (20, 'Pending Review'), (30, 'Published')])),
                ('activation_limit', models.IntegerField(default=1, null=True, help_text='Activation limit for this product', blank=True)),
                ('license_expiry', models.IntegerField(default=1, null=True, blank=True)),
                ('file', models.FileField(verbose_name='File', upload_to=shopie.models.product.product_file_upload, blank=True)),
                ('image', models.FileField(verbose_name='Product image', upload_to='images', blank=True)),
                ('author', models.ForeignKey(null=True, verbose_name='Author', to=settings.AUTH_USER_MODEL, blank=True)),
                ('parent', models.ForeignKey(null=True, verbose_name='Product Parent', to='shopie.Product', blank=True)),
            ],
            options={
                'verbose_name': 'Product',
                'verbose_name_plural': 'Products',
            },
        ),
        migrations.CreateModel(
            name='ProductTag',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('slug', models.CharField(verbose_name='Slug', max_length=250)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('name', models.CharField(verbose_name='Name', max_length=255)),
                ('description', models.TextField(default='', verbose_name='Description', blank=True)),
                ('image', models.FileField(verbose_name='image', upload_to='images', blank=True)),
                ('products', models.ManyToManyField(verbose_name='products', to='shopie.Product', related_name='tags')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Reply',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('body', models.TextField(max_length=10000)),
                ('issue', models.ForeignKey(related_name='replies', verbose_name='issue', to='shopie.Issue')),
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
            field=models.ForeignKey(related_name='extra_price_fields', verbose_name='Order', to='shopie.Order'),
        ),
        migrations.AddField(
            model_name='exrapriceorderitemfield',
            name='order_item',
            field=models.ForeignKey(related_name='extra_price_fields', verbose_name='Order item', to='shopie.OrderItem'),
        ),
    ]
