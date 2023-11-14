export interface SupportType {
  canUpgrade: boolean;
  canDeploy: boolean;
  canLoadAbi: boolean;
  canMutate: boolean;
  canView: boolean;
  canRead: boolean;
  hasBuildInfo: boolean;
  hasSourceCode: boolean;
  hasEndpoints: boolean;
  hasReadEndpoints: boolean;
  hasWriteEndpoints: boolean;
  hasEvents: boolean;
  hasTypes: boolean;
  hasConstructor: boolean;
}
