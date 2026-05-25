import { Injectable } from '@nestjs/common';
import { AuditService } from '../../../audit/audit.service';
import { AuditLogPort } from '../../application/ports/audit-log.port';

@Injectable()
export class AuditLogAdapter implements AuditLogPort {
  constructor(private readonly auditService: AuditService) {}

  async log(data: {
    action: string;
    entity: string;
    entityId: number;
    performedBy: number;
  }): Promise<void> {
    await this.auditService.create(data);
  }
}
