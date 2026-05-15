from odoo import http
from odoo.http import request
import json

class MobileAPI(http.Controller):
    
    @http.route('/mobile/v1/register', type='json', auth='user', methods=['POST'], csrf=False)
    def register_device(self, **post):
        token = post.get('token')
        platform = post.get('platform')
        app_version = post.get('app_version')

        if not token or not platform:
            return {'status': 'error', 'message': 'Token and platform are required'}

        device = request.env['mobile.device'].sudo().search([('token', '=', token)])
        if device:
            device.write({
                'user_id': request.uid,
                'active': True,
                'last_seen': fields.Datetime.now(),
                'app_version': app_version
            })
        else:
            request.env['mobile.device'].sudo().create({
                'user_id': request.uid,
                'token': token,
                'platform': platform,
                'app_version': app_version
            })
        
        return {'status': 'success'}

    @http.route('/mobile/v1/unregister', type='json', auth='user', methods=['POST'], csrf=False)
    def unregister_device(self, **post):
        token = post.get('token')
        if token:
            device = request.env['mobile.device'].sudo().search([('token', '=', token)])
            if device:
                device.unlink()
        return {'status': 'success'}
