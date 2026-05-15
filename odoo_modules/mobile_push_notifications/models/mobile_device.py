from odoo import models, fields

class MobileDevice(models.Model):
    _name = 'mobile.device'
    _description = 'Mobile Device'

    user_id = fields.Many2one('res.users', string='User', required=True, ondelete='cascade')
    token = fields.Char('Push Token', required=True)
    platform = fields.Selection([
        ('ios', 'iOS'),
        ('android', 'Android')
    ], string='Platform', required=True)
    active = fields.Boolean('Active', default=True)
    last_seen = fields.Datetime('Last Seen', default=fields.Datetime.now)
    app_version = fields.Char('App Version')

    _sql_constraints = [
        ('token_unique', 'unique(token)', 'Token must be unique!')
    ]
