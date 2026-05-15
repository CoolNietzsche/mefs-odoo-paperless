import requests
import json
from odoo import models, api, fields
import logging

_logger = logging.getLogger(__name__)

class MailThread(models.AbstractModel):
    _inherit = 'mail.thread'

    @api.model
    def _notify_thread(self, message, msg_vals=False, **kwargs):
        res = super(MailThread, self)._notify_thread(message, msg_vals=msg_vals, **kwargs)
        self._send_mobile_push(message)
        return res

    def _send_mobile_push(self, message):
        """Send push notification to recipients of the message"""
        recipients = message.partner_ids
        if not recipients:
            return

        # Find active devices for these partners
        devices = self.env['mobile.device'].sudo().search([
            ('user_id.partner_id', 'in', recipients.ids),
            ('active', '=', True)
        ])

        if not devices:
            return

        tokens = devices.mapped('token')
        
        # Prepare Expo push payload
        payload = []
        for token in tokens:
            payload.append({
                'to': token,
                'title': message.author_id.name or 'New Message',
                'body': message.body_text or 'View details in Odoo',
                'data': {
                    'model': self._name,
                    'res_id': self.id,
                },
                'sound': 'default'
            })

        # Batch send to Expo
        # In a real production environment, this should be done in a @job (queue_job)
        try:
            response = requests.post(
                'https://exp.host/--/api/v2/push/send',
                json=payload,
                timeout=10
            )
            response.raise_for_status()
        except Exception as e:
            _logger.error("Failed to send push notification: %s", str(e))
