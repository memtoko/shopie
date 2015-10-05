# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings
from decimal import Decimal
import shopengine.models.fields
import shopengine.models.product


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Cart',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL, blank=True, null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='CartItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('quantity', models.IntegerField()),
                ('cart', models.ForeignKey(related_name='items', to='shopengine.Cart')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Disscount',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('name', models.CharField(max_length=255, verbose_name='name')),
                ('code', models.CharField(max_length=255, verbose_name='code')),
                ('discount_type', models.IntegerField(choices=[(10, 'Flat Amount'), (20, 'Percentage')], default=20, verbose_name='discount type')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=30, default=Decimal('0.0'), verbose_name='amount')),
                ('min_amount_cart', models.DecimalField(decimal_places=2, max_digits=30, default=Decimal('0.0'), verbose_name='min amount cart')),
                ('start_date', models.DateTimeField(verbose_name='start date')),
                ('end_date', models.DateTimeField(verbose_name='end date')),
                ('max_used', models.IntegerField(verbose_name='maximum used')),
                ('used', models.IntegerField(default=0, verbose_name='used')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ExraPriceOrderItemField',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('label', models.CharField(max_length=255, verbose_name='Label')),
                ('value', shopengine.models.fields.CurrencyField(decimal_places=2, max_digits=30, default=Decimal('0.0'), verbose_name='Amount')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ExtraPriceOrderField',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('label', models.CharField(max_length=255, verbose_name='Label')),
                ('value', shopengine.models.fields.CurrencyField(decimal_places=2, max_digits=30, default=Decimal('0.0'), verbose_name='Amount')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Issue',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('name', models.CharField(max_length=250)),
                ('slug', models.CharField(max_length=250)),
                ('body', models.TextField(null=True, max_length=10000, blank=True)),
                ('is_closed', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model, shopengine.models.product.SluggableMixin),
        ),
        migrations.CreateModel(
            name='Label',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('name', models.CharField(max_length=60, verbose_name='label title')),
                ('description', models.CharField(max_length=225, verbose_name='label description')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='License',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('license_key', models.CharField(max_length=255, unique=True, verbose_name='license key')),
                ('status', models.IntegerField(choices=[(10, 'inactive'), (20, 'active')], default=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
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
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('site', models.CharField(max_length=255, verbose_name='site')),
                ('activate_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('status', models.IntegerField(choices=[(10, 'inactive'), (20, 'active')], default=20)),
                ('license', models.ForeignKey(to='shopengine.License')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('full_name', models.CharField(null=True, max_length=255, blank=True, verbose_name='full name')),
                ('email', models.EmailField(max_length=254, blank=True, verbose_name='email address')),
                ('status', models.IntegerField(choices=[(10, 'Pending'), (20, 'On Hold'), (30, 'Processing'), (40, 'Confirming'), (50, 'Confirmed'), (60, 'Completed'), (70, 'Cancelled'), (80, 'Refunded')], default=20, verbose_name='Status')),
                ('order_date', models.DateTimeField(auto_now=True, verbose_name='Order Date')),
                ('order_key', models.CharField(unique=True, null=True, max_length=255, blank=True, verbose_name='Order Key')),
                ('order_subtotal', models.DecimalField(decimal_places=2, max_digits=30, default=Decimal('0.0'), verbose_name='Order Subtotal')),
                ('order_total', models.DecimalField(decimal_places=2, max_digits=30, default=Decimal('0.0'), verbose_name='Order Total')),
                ('cart_pk', models.PositiveIntegerField(null=True, blank=True, verbose_name='Cart primary key')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL, blank=True, verbose_name='Customer', null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('unit_price', models.DecimalField(decimal_places=2, max_digits=30, default=Decimal('0.0'), verbose_name='Unit Price')),
                ('quantity', models.IntegerField(default=1, verbose_name='Quantity')),
                ('line_subtotal', models.DecimalField(decimal_places=2, max_digits=30, default=Decimal('0.0'), verbose_name='Line Subtotal')),
                ('line_total', models.DecimalField(decimal_places=2, max_digits=30, default=Decimal('0.0'), verbose_name='Line Total')),
                ('order', models.ForeignKey(related_name='items', to='shopengine.Order', verbose_name='Order Item')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='OrderPayment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', shopengine.models.fields.CurrencyField(decimal_places=2, max_digits=30, default=Decimal('0.0'), verbose_name='amount')),
                ('transaction_id', models.CharField(help_text="The transaction processor's reference", max_length=255, verbose_name='Transaction ID')),
                ('payment_method', models.CharField(help_text='The payment backend used to process the purchase', max_length=255, verbose_name='Payment method')),
                ('created_at', models.DateTimeField(null=True, auto_now_add=True, verbose_name='Date added')),
                ('updated_at', models.DateTimeField(null=True, auto_now=True, verbose_name='Last modified')),
                ('order', models.ForeignKey(to='shopengine.Order', verbose_name='order')),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('name', models.CharField(max_length=255, verbose_name='Product Name')),
                ('slug', models.SlugField(verbose_name='Slug')),
                ('meta_description', models.CharField(max_length=255, verbose_name='Meta description')),
                ('short_description', models.TextField(max_length=255, verbose_name='Short Description')),
                ('description', models.TextField(verbose_name='Descriptions')),
                ('image', models.FileField(upload_to='image', blank=True, verbose_name='Product Image')),
                ('thumbnail', models.FileField(upload_to='image', blank=True, verbose_name='Product thumbnail')),
                ('unit_price', shopengine.models.fields.CurrencyField(decimal_places=2, max_digits=30, default=Decimal('0'), verbose_name='Unit Price')),
                ('is_active', models.BooleanField(default=False, verbose_name='Active')),
                ('status', models.IntegerField(choices=[(10, 'Draft'), (20, 'Published')], default=10, verbose_name='Status')),
                ('product_type', models.IntegerField(choices=[(20, 'Variable'), (40, 'External'), (30, 'Variant'), (10, 'Simple'), (50, 'Grouped')], default=10, verbose_name='Product type')),
                ('activation_limit', models.IntegerField(null=True, blank=True)),
                ('license_expiry', models.IntegerField(null=True, blank=True)),
                ('sales', models.IntegerField(null=True, blank=True, verbose_name='Sales')),
                ('earnings', models.DecimalField(decimal_places=2, max_digits=30, default=Decimal('0.0'), verbose_name='Earnings')),
                ('author', models.ForeignKey(to=settings.AUTH_USER_MODEL, blank=True, verbose_name='Author', null=True)),
                ('parent', models.ForeignKey(to='shopengine.Product', blank=True, verbose_name='Product variants', null=True)),
            ],
            options={
                'verbose_name_plural': 'Products',
                'verbose_name': 'Product',
            },
            bases=(models.Model, shopengine.models.product.SluggableMixin),
        ),
        migrations.CreateModel(
            name='ProductTag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('name', models.CharField(max_length=255, verbose_name='Name')),
                ('slug', models.SlugField(verbose_name='Slug')),
                ('meta_description', models.CharField(null=True, max_length=255, blank=True, verbose_name='Meta description')),
                ('description', models.TextField(null=True, blank=True, verbose_name='Description')),
                ('image', models.FileField(upload_to='image', verbose_name='Product image')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Date added')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Last modified')),
                ('products', models.ManyToManyField(to='shopengine.Product', verbose_name='products')),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model, shopengine.models.product.SluggableMixin),
        ),
        migrations.CreateModel(
            name='Reply',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('body', models.TextField(max_length=10000)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('issue', models.ForeignKey(related_name='replies', to='shopengine.Issue', verbose_name='issue')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL, verbose_name='user')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='orderitem',
            name='product',
            field=models.ForeignKey(to='shopengine.Product', verbose_name='Product'),
        ),
        migrations.AddField(
            model_name='license',
            name='order',
            field=models.ForeignKey(to='shopengine.Order'),
        ),
        migrations.AddField(
            model_name='license',
            name='product',
            field=models.ForeignKey(to='shopengine.Product'),
        ),
        migrations.AddField(
            model_name='license',
            name='user',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL, verbose_name='License owner'),
        ),
        migrations.AddField(
            model_name='issue',
            name='label',
            field=models.ForeignKey(to='shopengine.Label', blank=True, verbose_name='label', null=True),
        ),
        migrations.AddField(
            model_name='issue',
            name='product',
            field=models.ForeignKey(to='shopengine.Product', verbose_name='product'),
        ),
        migrations.AddField(
            model_name='issue',
            name='user',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL, verbose_name='user'),
        ),
        migrations.AddField(
            model_name='extrapriceorderfield',
            name='order',
            field=models.ForeignKey(to='shopengine.Order', verbose_name='Order'),
        ),
        migrations.AddField(
            model_name='exrapriceorderitemfield',
            name='order_item',
            field=models.ForeignKey(to='shopengine.OrderItem', verbose_name='Order item'),
        ),
        migrations.AddField(
            model_name='cartitem',
            name='product',
            field=models.ForeignKey(to='shopengine.Product'),
        ),
    ]
