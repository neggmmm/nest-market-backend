export const AUDIT_LOG = Symbol();

export interface AuditLogPort {
 log(data:{
   action:string;
   entity:string;
   entityId:string | number;
   performedBy:number;
 }): Promise<void>;
}