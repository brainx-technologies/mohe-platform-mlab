from mohe.settings.base import *

# Application definition

INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # 3rd party
    'rest_framework',
    'rest_framework.authtoken',
    'bootstrap3',
    'django_bootstrap5',
    'compressor',

    # mohe core
    'mohe.client',
    'mohe.diagnostics',
    'mohe.hardware',
    'mohe.kplex',
    'mohe.geo',
    'mohe.patient',
    'mohe.measurement',
    'mohe.supply',
    'mohe.util',
    'mohe.alert',
    'mohe.ui',
    'mohe.datalab',

    # mohe_datalab
    'mohe_datalab.dashboard',
    'mohe_datalab.dashboard_alert',
]

ROOT_URLCONF = 'mohe_datalab.urls'

WSGI_APPLICATION = 'mohe_datalab.wsgi.application'

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'compressor.finders.CompressorFinder',
)

COMPRESS_PRECOMPILERS = (
    ('text/x-scss', 'django_libsass.SassCompiler'),
)


# AUTH

LOGIN_URL = '/auth/login/'

LOGIN_REDIRECT_URL = '/'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication'
    )
}

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.messages.context_processors.messages',
                'mohe_datalab.dashboard.context_processors.dashboards',
                'mohe_datalab.dashboard.context_processors.config',
                'mohe_datalab.dashboard_alert.context_processors.alerts',
            ]
        },
    },
]
