# Generated by Django 4.2.11 on 2024-04-16 03:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0010_user_canvas_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='student',
            name='session',
        ),
        migrations.RemoveField(
            model_name='waitlist',
            name='student',
        ),
        migrations.AddField(
            model_name='student',
            name='waitlist',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='users.waitlist'),
        ),
    ]