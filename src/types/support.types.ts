export interface SupportType {
  canView: boolean;
  canRead: boolean;
  canMutate: boolean;
  hasBuildInfo: boolean;
  hasSourceCode: boolean;
  hasEndpoints: boolean;
  hasReadEndpoints: boolean;
  hasWriteEndpoints: boolean;
  hasEvents: boolean;
  hasTypes: boolean;
  hasConstructor: boolean;
}
