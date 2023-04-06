from django.urls import path, include

import mohe_datalab.dashboard.views as dashboard_views
import mohe_datalab.accounts.views as account_views
import mohe_datalab.dashboard_alert.views as alert_views

urlpatterns = [
    path('api/frontend/', include('mohe_datalab.api.urls')),
    path('auth/', include('django.contrib.auth.urls')),

    # dashboard display
    path('', dashboard_views.home, name='home'),

    # dashboard editing
    path('dashboard/add/', dashboard_views.dashboard_add, name='dashboard_add'),
    path('dashboard/<str:slug>/', dashboard_views.dashboard, name='dashboard'),
    path('dashboard/<str:slug>/update/', dashboard_views.dashboard_update, name='dashboard_update'),
    path('dashboard/<str:slug>/delete/', dashboard_views.dashboard_delete, name='dashboard_delete'),
    path('dashboard/<str:slug>/reset/', dashboard_views.dashboard_reset, name='dashboard_reset'),
    path('dashboard/<str:slug>/export/', dashboard_views.dashboard_export, name='dashboard_export'),

    path('widget/add/', dashboard_views.widget_form, name='widget_add'),
    path('widget/<int:pk>/update/', dashboard_views.widget_form, name='widget_update'),

    path('alerts/', alert_views.alerts, name='alerts'),
    path('alerts/template/add/', alert_views.alert_template_form, name='alert_template_add'),
    path('alerts/template/<int:pk>/', alert_views.alert_template_form, name='alert_template_update'),
    path('alerts/template/<int:pk>/delete/', alert_views.alert_template_delete, name='alert_template_delete'),

    path('settings/', account_views.settings, name='settings'),
    path('setup/', account_views.setup, name='setup'),
    path('setup/complete/', account_views.setup_completed, name='setup_completed'),
]
