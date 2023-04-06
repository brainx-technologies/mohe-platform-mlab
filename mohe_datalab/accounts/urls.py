from django.urls import include, path

from mohe_datalab.accounts import views

urlpatterns = [
    path('settings/', views.settings, name='settings'),
    path('setup/', views.setup, name='setup'),
    path('setup/complete/', views.setup_completed, name='setup_completed'),
    path('', include('django.contrib.auth.urls'))
]
