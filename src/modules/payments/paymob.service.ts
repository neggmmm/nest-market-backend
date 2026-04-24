import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';

@Injectable()
export class PaymobService {
  private readonly baseUrl = 'https://accept.paymob.com/api';

  constructor(private readonly configService: ConfigService) {}

  async getAuthToken(): Promise<string> {
    const apiKey = this.configService.getOrThrow<string>('paymob.apiKey');

    const response = await fetch(`${this.baseUrl}/auth/tokens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey }),
    });

    if (!response.ok) {
      throw new InternalServerErrorException('Failed to get Paymob auth token');
    }

    const data = (await response.json()) as { token: string };
    return data.token;
  }

  async createOrder(authToken: string, payload: {
    amountCents: number;
    items: Array<{ name: string; amount_cents: number; quantity: number }>;
  }): Promise<string> {
    const response = await fetch(`${this.baseUrl}/ecommerce/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: payload.amountCents,
        currency: 'EGP',
        items: payload.items,
      }),
    });

    if (!response.ok) {
      throw new InternalServerErrorException('Failed to create Paymob order');
    }

    const data = (await response.json()) as { id: number | string };
    return String(data.id);
  }

  async generatePaymentKey(authToken: string, payload: {
    amountCents: number;
    paymobOrderId: string;
  }): Promise<string> {
    const integrationId = Number(this.configService.getOrThrow<string>('paymob.integrationId'));

    const response = await fetch(`${this.baseUrl}/acceptance/payment_keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: payload.amountCents,
        expiration: 3600,
        order_id: payload.paymobOrderId,
        billing_data: {
          apartment: 'NA',
          email: 'NA',
          floor: 'NA',
          first_name: 'NA',
          street: 'NA',
          building: 'NA',
          phone_number: 'NA',
          shipping_method: 'NA',
          postal_code: 'NA',
          city: 'NA',
          country: 'NA',
          last_name: 'NA',
          state: 'NA',
        },
        currency: 'EGP',
        integration_id: integrationId,
      }),
    });

    if (!response.ok) {
      throw new InternalServerErrorException('Failed to generate Paymob payment key');
    }

    const data = (await response.json()) as { token: string };
    return data.token;
  }

  // This is the only method the controller really needs: it builds the final iframe checkout URL.
  async createPaymentSession(payload: {
    amountCents: number;
    items: Array<{ name: string; amount_cents: number; quantity: number }>;
  }): Promise<{ paymobOrderId: string; checkoutUrl: string }> {
    const authToken = await this.getAuthToken();
    const paymobOrderId = await this.createOrder(authToken, payload);
    const paymentKey = await this.generatePaymentKey(authToken, {
      amountCents: payload.amountCents,
      paymobOrderId,
    });

    const iframeId = this.configService.getOrThrow<string>('paymob.iframeId');
    const checkoutUrl = `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentKey}`;

    return { paymobOrderId, checkoutUrl };
  }

  // Basic webhook verification only. This is intentionally minimal, not full production security.
  verifyWebhook(payload: Record<string, unknown>, receivedHmac?: string): boolean {
    const hmacSecret = this.configService.get<string>('paymob.hmacSecret');
    if (!hmacSecret || !receivedHmac) {
      return true;
    }

    const digest = createHmac('sha512', hmacSecret)
      .update(JSON.stringify(payload))
      .digest('hex');

    return digest === receivedHmac;
  }
}
