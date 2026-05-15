{
    'name': 'Mobile Push Notifications',
    'version': '1.0.0',
    'category': 'Extra Tools',
    'summary': 'Native push notifications for Odoo Mobile app via Expo Push API',
    'description': """
        Integrates Odoo internal notifications with mobile push notifications.
        Requires the Odoo Mobile app.
    """,
    'author': 'Odoo Mobile Team',
    'depends': ['base', 'mail'],
    'data': [
        'security/ir.model.access.csv',
        'views/mobile_device_views.xml',
    ],
    'installable': True,
    'application': False,
    'license': 'LGPL-3',
}
