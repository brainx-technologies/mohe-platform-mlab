# Generated by Django 4.2 on 2023-04-18 19:34

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('kplex', '0002_alter_kplex_options'),
        ('client', '0001_initial'),
        ('geo', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Dashboard',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(help_text='A short but descriptive title for this dashboard.', max_length=100, verbose_name='title')),
                ('slug', models.SlugField(blank=True, verbose_name='slug')),
                ('preset', models.CharField(choices=[('home', 'Home'), ('map', 'Interactive map'), ('results', 'Result list')], default='home', help_text='The default configuration for this dashboard', max_length=10, verbose_name='preset')),
                ('style', models.CharField(choices=[('light', 'light'), ('dark', 'dark')], default='dark', help_text='The color scheme for this dashboard', max_length=30, verbose_name='style')),
                ('status', models.CharField(blank=True, choices=[('negative', 'Negative'), ('positive', 'Positive'), ('invalid', 'Invalid'), ('expired', 'Expired')], max_length=10, verbose_name='status')),
                ('period', models.IntegerField(choices=[(999, 'Set manually'), (7, 'Previous 7 days'), (28, 'Previous 30 days'), (90, 'Previous 90 days'), (365, 'Previous 365 days')], default=90, verbose_name='date range')),
                ('period_from', models.DateField(blank=True, null=True, verbose_name='from')),
                ('period_to', models.DateField(blank=True, null=True, verbose_name='to')),
                ('compare', models.IntegerField(choices=[(1, 'Same interval'), (2, 'Set manually')], default=1, verbose_name='compare')),
                ('compare_from', models.DateField(blank=True, null=True, verbose_name='from')),
                ('compare_to', models.DateField(blank=True, null=True, verbose_name='to')),
                ('country', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='geo.country', verbose_name='country')),
                ('kplex', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='kplex.kplex', verbose_name='kPlex')),
                ('team', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='client.team', verbose_name='team')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='user')),
            ],
            options={
                'verbose_name': 'dashboard',
                'verbose_name_plural': 'dashboards',
                'unique_together': {('user', 'slug')},
            },
        ),
        migrations.CreateModel(
            name='DashboardModule',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('module', models.CharField(editable=False, max_length=30, verbose_name='module')),
                ('title', models.CharField(max_length=100, verbose_name='title')),
                ('x', models.IntegerField(default=0, verbose_name='x')),
                ('y', models.IntegerField(default=999, verbose_name='y')),
                ('width', models.IntegerField(default=1, verbose_name='width')),
                ('height', models.IntegerField(default=1, verbose_name='height')),
                ('dashboard', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='dashboard.dashboard', verbose_name='dashboard')),
            ],
        ),
        migrations.CreateModel(
            name='DeviceCapacity',
            fields=[
                ('dashboardmodule_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='dashboard.dashboardmodule')),
            ],
            options={
                'verbose_name': 'remaining reader capacity',
                'verbose_name_plural': 'remaining reader capacity',
            },
            bases=('dashboard.dashboardmodule',),
        ),
        migrations.CreateModel(
            name='Latest',
            fields=[
                ('dashboardmodule_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='dashboard.dashboardmodule')),
            ],
            options={
                'verbose_name': 'latest results',
                'verbose_name_plural': 'latest results',
            },
            bases=('dashboard.dashboardmodule',),
        ),
        migrations.CreateModel(
            name='Map',
            fields=[
                ('dashboardmodule_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='dashboard.dashboardmodule')),
                ('lat', models.DecimalField(decimal_places=8, max_digits=12, verbose_name='initial latitude')),
                ('lng', models.DecimalField(decimal_places=8, max_digits=12, verbose_name='initial longitude')),
                ('zoom', models.IntegerField(verbose_name='initial zoom')),
            ],
            options={
                'verbose_name': 'world map',
                'verbose_name_plural': 'world map',
            },
            bases=('dashboard.dashboardmodule',),
        ),
        migrations.CreateModel(
            name='Number',
            fields=[
                ('dashboardmodule_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='dashboard.dashboardmodule')),
                ('value', models.CharField(choices=[('stock', 'kPlex in stock'), ('total', 'Total number of tests'), ('clear', 'Number of clear tests'), ('trigger', 'Number of triggered tests'), ('invalid', 'Number of invalid tests'), ('reader', 'Number of active readers')], max_length=20, verbose_name='value')),
            ],
            options={
                'verbose_name': 'number',
                'verbose_name_plural': 'number',
            },
            bases=('dashboard.dashboardmodule',),
        ),
        migrations.CreateModel(
            name='Radar',
            fields=[
                ('dashboardmodule_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='dashboard.dashboardmodule')),
                ('lat', models.DecimalField(decimal_places=8, max_digits=12, verbose_name='initial latitude')),
                ('lng', models.DecimalField(decimal_places=8, max_digits=12, verbose_name='initial longitude')),
                ('zoom', models.IntegerField(verbose_name='initial zoom')),
            ],
            options={
                'verbose_name': 'radar',
                'verbose_name_plural': 'radar',
            },
            bases=('dashboard.dashboardmodule',),
        ),
        migrations.CreateModel(
            name='Results',
            fields=[
                ('dashboardmodule_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='dashboard.dashboardmodule')),
            ],
            options={
                'verbose_name': 'full result list',
                'verbose_name_plural': 'full result list',
            },
            bases=('dashboard.dashboardmodule',),
        ),
        migrations.CreateModel(
            name='TeamActivity',
            fields=[
                ('dashboardmodule_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='dashboard.dashboardmodule')),
            ],
            options={
                'verbose_name': 'team activity',
                'verbose_name_plural': 'team activity',
            },
            bases=('dashboard.dashboardmodule',),
        ),
        migrations.CreateModel(
            name='TestkitStock',
            fields=[
                ('dashboardmodule_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='dashboard.dashboardmodule')),
            ],
            options={
                'verbose_name': 'kPlex in stock',
                'verbose_name_plural': 'kPlex in stock',
            },
            bases=('dashboard.dashboardmodule',),
        ),
        migrations.CreateModel(
            name='TriggerPerKplex',
            fields=[
                ('dashboardmodule_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='dashboard.dashboardmodule')),
            ],
            options={
                'verbose_name': 'trigger per kPlex',
                'verbose_name_plural': 'trigger per kPlex',
            },
            bases=('dashboard.dashboardmodule',),
        ),
        migrations.CreateModel(
            name='TriggerPerTest',
            fields=[
                ('dashboardmodule_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='dashboard.dashboardmodule')),
            ],
            options={
                'verbose_name': 'trigger per parameter',
                'verbose_name_plural': 'trigger per parameter',
            },
            bases=('dashboard.dashboardmodule',),
        ),
        migrations.CreateModel(
            name='CountryModule',
            fields=[
                ('dashboardmodule_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='dashboard.dashboardmodule')),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='geo.country')),
            ],
            options={
                'verbose_name': 'country heat map',
                'verbose_name_plural': 'country heat map',
            },
            bases=('dashboard.dashboardmodule',),
        ),
    ]