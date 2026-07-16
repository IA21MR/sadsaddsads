import type { ModuleManifest } from '../../shared/plugin-system/domain/ModuleManifest';
import { registerManifest } from '../../shared/plugin-system/application/ModuleCatalog';
import { ReservasWhatsappModule } from './ReservasWhatsapp.Module';

export const ReservasWhatsappManifest: ModuleManifest = {
  name: 'reservas-whatsapp', kind: 'extension', extends: 'reservas',
  packageName: '@sotek/erp-extension-reservas-whatsapp',
  description: 'Notificaciones de reservas mediante WhatsApp Cloud API.', version: '1.0.0',
  isCore: false, module: ReservasWhatsappModule, dependencies: ['reservas'],
  subscriptions: ['reservation.created', 'reservation.cancelled'],
  configuration: [
    { key: 'confirmationTemplate', label: 'Plantilla de confirmación', type: 'string', required: true, defaultValue: 'Hola {{name}}, tu reserva para {{date}} está confirmada.' },
    { key: 'cancellationTemplate', label: 'Plantilla de cancelación', type: 'string', required: true, defaultValue: 'Hola {{name}}, tu reserva fue cancelada.' },
    { key: 'accessToken', label: 'Access token', type: 'secret', required: true, envVar: 'WHATSAPP_ACCESS_TOKEN' },
    { key: 'phoneNumberId', label: 'Phone number ID', type: 'secret', required: true, envVar: 'WHATSAPP_PHONE_NUMBER_ID' },
  ],
  permissions: [], prismaFragments: [], seedScripts: [], pluginPermissions: ['network'],
  onLoad: async () => {
    if (!ReservasWhatsappManifest.subscriptions?.length) throw new Error('La extensión debe declarar subscriptions.');
  },
  healthCheck: async () => {
    if (!process.env.PLUGIN_SECRET_KEY) return 'degraded';
    try {
      const response = await fetch('https://graph.facebook.com', { signal: AbortSignal.timeout(3_000) });
      return response.status < 500 ? 'healthy' : 'degraded';
    } catch {
      return 'failed';
    }
  },
};
registerManifest(ReservasWhatsappManifest);

