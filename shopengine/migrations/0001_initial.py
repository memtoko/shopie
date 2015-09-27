# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from decimal import Decimal
from django.conf import settings
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
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(blank=True, null=True, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='CartItem',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('quantity', models.IntegerField()),
                ('cart', models.ForeignKey(to='shopengine.Cart', related_name='items')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Disscount',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('name', models.CharField(max_length=255, verbose_name='name')),
                ('code', models.CharField(max_length=255, verbose_name='code')),
                ('discount_type', models.IntegerField(default=20, verbose_name='discount type', choices=[(10, 'Flat Amount'), (20, 'Percentage')])),
                ('amount', models.DecimalField(max_digits=30, default=Decimal('0.0'), decimal_places=2, verbose_name='amount')),
                ('min_amount_cart', models.DecimalField(max_digits=30, default=Decimal('0.0'), decimal_places=2, verbose_name='min amount cart')),
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
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('label', models.CharField(max_length=255, verbose_name='Label')),
                ('value', shopengine.models.fields.CurrencyField(max_digits=30, default=Decimal('0.0'), decimal_places=2, verbose_name='Amount')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ExtraPriceOrderField',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('label', models.CharField(max_length=255, verbose_name='Label')),
                ('value', shopengine.models.fields.CurrencyField(max_digits=30, default=Decimal('0.0'), decimal_places=2, verbose_name='Amount')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Issue',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('name', models.CharField(max_length=250)),
                ('slug', models.CharField(max_length=250)),
                ('body', models.TextField(blank=True, max_length=10000, null=True)),
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
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
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
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('license_key', models.CharField(max_length=255, verbose_name='license key', unique=True)),
                ('status', models.IntegerField(default=10, choices=[(10, 'inactive'), (20, 'active')])),
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
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('site', models.CharField(max_length=255, verbose_name='site')),
                ('activate_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('status', models.IntegerField(default=20, choices=[(10, 'inactive'), (20, 'active')])),
                ('license', models.ForeignKey(to='shopengine.License')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('full_name', models.CharField(blank=True, max_length=255, verbose_name='full name', null=True)),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('status', models.IntegerField(default=20, verbose_name='Status', choices=[(10, 'Pending'), (20, 'On Hold'), (30, 'Processing'), (40, 'Confirming'), (50, 'Confirmed'), (60, 'Completed'), (70, 'Cancelled'), (80, 'Refunded')])),
                ('order_date', models.DateTimeField(verbose_name='Order Date', auto_now=True)),
                ('order_key', models.CharField(blank=True, max_length=255, verbose_name='Order Key', unique=True, null=True)),
                ('order_subtotal', models.DecimalField(max_digits=30, default=Decimal('0.0'), decimal_places=2, verbose_name='Order Subtotal')),
                ('order_total', models.DecimalField(max_digits=30, default=Decimal('0.0'), decimal_places=2, verbose_name='Order Total')),
                ('cart_pk', models.PositiveIntegerField(blank=True, null=True, verbose_name='Cart primary key')),
                ('user', models.ForeignKey(blank=True, null=True, verbose_name='Customer', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('unit_price', models.DecimalField(max_digits=30, default=Decimal('0.0'), decimal_places=2, verbose_name='Unit Price')),
                ('quantity', models.IntegerField(default=1, verbose_name='Quantity')),
                ('line_subtotal', models.DecimalField(max_digits=30, default=Decimal('0.0'), decimal_places=2, verbose_name='Line Subtotal')),
                ('line_total', models.DecimalField(max_digits=30, default=Decimal('0.0'), decimal_places=2, verbose_name='Line Total')),
                ('order', models.ForeignKey(related_name='items', verbose_name='Order Item', to='shopengine.Order')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='OrderPayment',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('amount', shopengine.models.fields.CurrencyField(max_digits=30, default=Decimal('0.0'), decimal_places=2, verbose_name='amount')),
                ('transaction_id', models.CharField(max_length=255, verbose_name='Transaction ID', help_text="The transaction processor's reference")),
                ('payment_method', models.CharField(max_length=255, verbose_name='Payment method', help_text='The payment backend used to process the purchase')),
                ('created_at', models.DateTimeField(null=True, auto_now_add=True, verbose_name='Date added')),
                ('updated_at', models.DateTimeField(null=True, verbose_name='Last modified', auto_now=True)),
                ('order', models.ForeignKey(to='shopengine.Order', verbose_name='order')),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('name', models.CharField(max_length=255, verbose_name='Product Name')),
                ('slug', models.SlugField(verbose_name='Slug')),
                ('meta_description', models.CharField(max_length=255, verbose_name='Meta description')),
                ('short_description', models.TextField(max_length=255, verbose_name='Short Description')),
                ('description', models.TextField(verbose_name='Descriptions')),
                ('image', models.FileField(blank=True, upload_to='/home/syaiful/code/shopie/shopie/static/media', verbose_name='Product Image')),
                ('thumbnail', models.FileField(blank=True, upload_to='/home/syaiful/code/shopie/shopie/static/media', verbose_name='Product thumbnail')),
                ('unit_price', shopengine.models.fields.CurrencyField(max_digits=30, default=Decimal('0'), decimal_places=2, verbose_name='Unit Price')),
                ('is_active', models.BooleanField(default=False, verbose_name='Active')),
                ('status', models.IntegerField(default=10, verbose_name='Status', choices=[(10, 'Draft'), (20, 'Published')])),
                ('product_type', models.IntegerField(default=10, verbose_name='Product type', choices=[(30, 'Variant'), (50, 'Grouped'), (40, 'External'), (10, 'Simple'), (20, 'Variable')])),
                ('activation_limit', models.IntegerField(blank=True, null=True)),
                ('license_expiry', models.IntegerField(blank=True, null=True)),
                ('sales', models.IntegerField(blank=True, null=True, verbose_name='Sales')),
                ('earnings', models.DecimalField(max_digits=30, default=Decimal('0.0'), decimal_places=2, verbose_name='Earnings')),
                ('author', models.ForeignKey(blank=True, null=True, verbose_name='Author', to=settings.AUTH_USER_MODEL)),
                ('parent', models.ForeignKey(blank=True, null=True, verbose_name='Product variants', to='shopengine.Product')),
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
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('name', models.CharField(max_length=255, verbose_name='Name')),
                ('slug', models.SlugField(verbose_name='Slug')),
                ('meta_description', models.CharField(blank=True, max_length=255, verbose_name='Meta description', null=True)),
                ('description', models.TextField(blank=True, null=True, verbose_name='Description')),
                ('image', models.FileField(upload_to='/home/syaiful/code/shopie/shopie/static/media', verbose_name='Product image')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Date added')),
                ('updated_at', models.DateTimeField(verbose_name='Last modified', auto_now=True)),
                ('products', models.ManyToManyField(verbose_name='products', to='shopengine.Product')),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model, shopengine.models.product.SluggableMixin),
        ),
        migrations.CreateModel(
            name='Reply',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('uuid', models.UUIDField(verbose_name='UUID')),
                ('body', models.TextField(max_length=10000)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('issue', models.ForeignKey(related_name='replies', verbose_name='issue', to='shopengine.Issue')),
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
            field=models.ForeignKey(blank=True, null=True, verbose_name='label', to='shopengine.Label'),
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
