import { AuditLog, UserRole } from '../types';

const inMemoryAuditLogs: AuditLog[] = [];

export const logAuditEvent = (
  userId: string,
  userRole: UserRole,
  action: string,
  entity: string,
  entityId: string,
  ipAddress: string,
  beforeValue?: any,
  afterValue?: any
): AuditLog => {
  const log: AuditLog = {
    id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId,
    userRole,
    action,
    entity,
    entityId,
    timestamp: new Date().toISOString(),
    ipAddress,
    beforeValue,
    afterValue
  };

  inMemoryAuditLogs.unshift(log);
  if (inMemoryAuditLogs.length > 500) {
    inMemoryAuditLogs.pop();
  }

  return log;
};

export const getAuditLogs = (): AuditLog[] => {
  return inMemoryAuditLogs;
};
