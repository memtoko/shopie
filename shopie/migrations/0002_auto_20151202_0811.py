# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
import uuid
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('shopie', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Media',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('slug', models.CharField(max_length=250, verbose_name='Slug')),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('name', models.CharField(max_length=255, verbose_name='name', blank=True)),
                ('description', models.TextField(null=True, blank=True, verbose_name='description')),
                ('file', models.FileField(verbose_name='File', upload_to='')),
                ('is_public', models.BooleanField(default=True, verbose_name='Public')),
                ('owner', models.ForeignKey(blank=True, null=True, to=settings.AUTH_USER_MODEL, verbose_name='Author')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AlterField(
            model_name='producttag',
            name='image',
            field=models.FileField(verbose_name='image', upload_to='images'),
        ),
    ]
