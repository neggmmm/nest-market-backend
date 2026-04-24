export class PaymobWebhookDto {
  hmac?: string;
  obj: {
    success: boolean;
    order: {
      id: number | string;
    };
  };
}
