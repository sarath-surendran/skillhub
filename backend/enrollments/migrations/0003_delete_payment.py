# Generated by Django 4.2.4 on 2023-09-12 08:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('enrollments', '0002_payment'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Payment',
        ),
    ]
