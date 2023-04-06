from django.urls import path

from mohe_datalab.api import views

urlpatterns = [
    path('dashboard/', views.dashboard, name='dashboard'),
    path('widget/', views.widget, name='widget'),

    path('number/<int:pk>/', views.number, name='number'),
    path('latest/<int:pk>/', views.latest, name='latest'),
    path('trigger-per-kplex/<int:pk>/', views.trigger_per_kplex, name='trigger_per_plex'),
    path('trigger-per-test/<int:pk>/', views.trigger_per_test, name='trigger_per_test'),
    path('radar/<int:pk>/', views.radar, name='radar'),
    path('map/<int:pk>/', views.map, name='map'),
    path('results/<int:pk>/', views.results, name='results'),
    path('team-activity/<int:pk>/', views.team_activity, name='team_activity'),
    path('device-capacity/<int:pk>/', views.device_capacity, name='device_capacity'),
    path('country/<int:pk>/', views.country, name='country'),
    path('testkit-stock/<int:pk>/', views.testkit_stock, name='testkit_stock'),

    path('result/<int:pk>/', views.result, name='result'),
    path('alert/count/', views.alert_count, name='alert_count'),
]
