# Generated by Django 4.2.11 on 2024-04-16 22:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0013_sessionquestion_professor'),
    ]

    operations = [
        migrations.AddField(
            model_name='sessionquestion',
            name='waitlist',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='users.waitlist'),
        ),
    ]