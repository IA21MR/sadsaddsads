import { ReservationsWhatsappHandler } from './ReservationsWhatsappHandler';

describe('ReservationsWhatsappHandler', () => {
  afterEach(() => jest.restoreAllMocks());

  it('lee secretos/config del contexto y envía el mensaje', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true } as Response);
    const secrets = { get: jest.fn(async (key: string) => key === 'accessToken' ? 'token' : 'phone-id') };
    const handler = new ReservationsWhatsappHandler();
    await handler.handle({
      id: 'event-1', type: 'reservation.created', organizationId: 'org-1', occurredAt: new Date(),
      payload: { reservationId: 'res-1', customerName: 'Ana', customerPhone: '56911111111', scheduledAt: '2026-07-15T13:30:00Z' },
    }, {
      organizationId: 'org-1', packageName: '@sotek/erp-extension-reservas-whatsapp',
      config: { confirmationTemplate: 'Confirmada para {{name}} el {{date}}' }, secrets,
      apis: { get: jest.fn() },
    });
    expect(secrets.get).toHaveBeenCalledWith('accessToken');
    expect(secrets.get).toHaveBeenCalledWith('phoneNumberId');
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/phone-id/messages'), expect.objectContaining({
      method: 'POST', headers: expect.objectContaining({ Authorization: 'Bearer token' }),
    }));
  });

  it('falla de forma explícita si faltan secretos', async () => {
    const handler = new ReservationsWhatsappHandler();
    await expect(handler.handle({
      id: 'event-1', type: 'reservation.cancelled', organizationId: 'org-1', payload: {}, occurredAt: new Date(),
    }, {
      organizationId: 'org-1', packageName: 'pkg', config: {},
      secrets: { get: jest.fn().mockResolvedValue(undefined) }, apis: { get: jest.fn() },
    })).rejects.toThrow(/no está configurado/);
  });
});
