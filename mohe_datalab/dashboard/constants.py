from django.utils.translation import gettext_lazy as _


class DashboardStyle(object):
    LIGHT = 'light'
    DARK = 'dark'

    CHOICES = (
        (LIGHT, _('light')),
        (DARK, _('dark')),
    )


class Period(object):
    MANUAL = 999
    WEEK = 7
    MONTH = 28
    QUARTER = 30 * 3
    YEAR = 365

    CHOICES = (
        (MANUAL, _('Set manually')),
        (WEEK, _('Previous 7 days')),
        (MONTH, _('Previous 30 days')),
        (QUARTER, _('Previous 90 days')),
        (YEAR, _('Previous 365 days')),
    )


class Numbers(object):
    CHOICES = (
        ('stock', _('kPlex in stock')),
        ('total', _('Total number of tests')),
        ('clear', _('Number of clear tests')),
        ('trigger', _('Number of triggered tests')),
        ('invalid', _('Number of invalid tests')),
        ('reader', _('Number of active readers')),
    )


class Compare(object):
    BEFORE = 1
    MANUAL = 2

    CHOICES = (
        (BEFORE, _('Same interval')),
        (MANUAL, _('Set manually')),
    )


class DashboardPreset(object):
    HOME = 'home'
    MAP = 'map'
    RESULTS = 'results'

    CHOICES = (
        (HOME, _('Home')),
        (MAP, _('Interactive map')),
        (RESULTS, _('Result list'))
    )
