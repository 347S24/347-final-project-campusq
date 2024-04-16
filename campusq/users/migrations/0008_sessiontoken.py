# Generated by Django 4.2.11 on 2024-04-11 20:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_waitlist'),
    ]

    operations = [
        migrations.CreateModel(
            name='SessionToken',
            fields=[
                ('token', models.CharField(max_length=32, primary_key=True, serialize=False, unique=True)),
                ('api_key', models.CharField(blank=True, max_length=100, null=True, unique=True)),
                ('api_refresh_key', models.CharField(blank=True, max_length=100, null=True, unique=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
