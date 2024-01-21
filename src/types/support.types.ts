export interface SupportType {
  hasBuildInfo: boolean;
  hasSourceCode: boolean;
  hasEndpoints: boolean;
  hasReadEndpoints: boolean;
  hasWriteEndpoints: boolean;
  hasEvents: boolean;
  hasTypes: boolean;
  hasConstructor: boolean;
  hasContractDetails: boolean;
  canUpgrade: boolean;
  canDeploy: boolean;
  canLoadAbi: boolean;
  canMutate: boolean;
  canView: boolean;
  canRead: boolean;
  canDisplayContractDetails: boolean;
}
