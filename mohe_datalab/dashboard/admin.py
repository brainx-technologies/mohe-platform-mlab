from django.contrib import admin

from mohe_datalab.dashboard.models import Dashboard


@admin.register(Dashboard)
class DashboardAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user')
    search_fields = ('user__last_name', 'user__email', 'title')
