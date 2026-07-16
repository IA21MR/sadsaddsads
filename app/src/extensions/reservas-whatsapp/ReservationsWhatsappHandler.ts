import { Injectable } from '@nestjs/common';
import type { ExtensionEventHandler } from '../../shared/plugin-system/events/ExtensionEventDispatcher';
import type { TenantDomainEvent } from '../../shared/plugin-system/events/TenantDomainEvent';
import type { TenantPluginContext } from '../../shared/plugin-system/context/TenantPluginContext';

interface ReservationPayload {
  reservationId: string; customerName: string; customerPhone: string; scheduledAt: string;
}

@Injectable()
export class ReservationsWhatsappHandler implements ExtensionEventHandler {
  async handle(event: TenantDomainEvent, context: TenantPluginContext): Promise<void> {
    const payload = event.payload as ReservationPayload;
    const accessToken = await context.secrets.get('accessToken');
    const phoneNumberId = await context.secrets.get('phoneNumberId');
    if (!accessToken || !phoneNumberId) throw new Error('WhatsApp no está configurado para esta organización.');

    const templateKey = event.type === 'reservation.cancelled' ? 'cancellationTemplate' : 'confirmationTemplate';
    const fallback = event.type === 'reservation.cancelled'
      ? 'Hola {{name}}, tu reserva fue cancelada.'
      : 'Hola {{name}}, tu reserva para {{date}} está confirmada.';
    const template = String(context.config[templateKey] ?? fallback);
    const body = template
      .replaceAll('{{name}}', payload.customerName)
      .replaceAll('{{date}}', new Date(payload.scheduledAt).toLocaleString('es-CL'));

    const response = await fetch(`https://graph.facebook.com/v23.0/${encodeURIComponent(phoneNumberId)}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp', to: payload.customerPhone,
        type: 'text', text: { preview_url: false, body },
      }),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(`WhatsApp API respondió ${response.status}${detail ? `: ${detail.slice(0, 300)}` : ''}`);
    }
  }
}

