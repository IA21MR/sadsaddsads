import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ExtensionEventDispatcher } from '../../shared/plugin-system/events/ExtensionEventDispatcher';
import { ReservationsWhatsappHandler } from './ReservationsWhatsappHandler';

@Module({ providers: [ReservationsWhatsappHandler] })
export class ReservasWhatsappModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly dispatcher: ExtensionEventDispatcher,
    private readonly handler: ReservationsWhatsappHandler,
  ) {}
  onModuleInit(): void { this.dispatcher.registerHandler('reservas-whatsapp', this.handler); }
  onModuleDestroy(): void { this.dispatcher.unregisterHandler('reservas-whatsapp'); }
}

