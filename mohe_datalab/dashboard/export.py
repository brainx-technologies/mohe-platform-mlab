import csv
import datetime

import openpyxl
from django.http import HttpResponse

from mohe_datalab.api.util import period_measurements


def export_dashboard(dashboard, format='xlsx'):
    queryset = period_measurements(dashboard)
    if format == 'xlsx':
        return export_xls(queryset)
    else:
        return export_csv(queryset)


def export_xls(queryset):
    today = datetime.date.today()
    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = f'attachment; filename=mohe_export_{today}.xlsx'

    workbook = openpyxl.Workbook()
    sheet = workbook.active

    columns = [
        'id',
        'reference', 'title', 'comment', 'age', 'gender',
        'kPlex', 'status', 'trigger',
        'date', 'sync date',
        'tester', 'team', 'reader'
    ]
    sheet.append(columns)

    for obj in queryset:
        triggers = obj.triggered_tests_as_str(separator=', ')
        row = [
            obj.pk,
            obj.reference, obj.title, obj.comment, obj.age, obj.gender,
            obj.kplex.name, obj.status, triggers,
            obj.measurement_date, obj.sync_date,
            obj.user.get_full_name(), obj.team.name, obj.device.serial_number
        ]
        sheet.append(row)

    workbook.save(response)

    return response


def export_csv(queryset):
    today = datetime.date.today()

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename=mohe_export_{today}.csv'
    writer = csv.writer(response, csv.excel)
    response.write(u'\ufeff'.encode('utf8'))

    writer.writerow([
        'id',
        'reference', 'title', 'comment', 'age', 'gender',
        'kPlex', 'status', 'trigger',
        'date', 'sync date',
        'tester', 'team', 'reader'
    ])

    for obj in queryset:
        triggers = obj.triggered_tests_as_str(separator=', ')
        writer.writerow([
            obj.pk,
            obj.reference, obj.title, obj.comment, obj.age, obj.gender,
            obj.kplex.name, obj.get_status_display(), triggers,
            obj.measurement_date, obj.sync_date,
            obj.user.get_full_name(), obj.team.name, obj.device.serial_number
        ])

    return response
