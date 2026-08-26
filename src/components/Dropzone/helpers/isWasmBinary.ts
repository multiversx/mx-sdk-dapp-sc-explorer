import { WASM_FILE_HEADER } from 'constants/general';

// validate WASM
export const isWasmBinary = (arrayBuffer: ArrayBuffer) => {
  if (arrayBuffer.byteLength < WASM_FILE_HEADER.length) {
    return false;
  }

  const header = new Uint8Array(arrayBuffer, 0, WASM_FILE_HEADER.length);

  return WASM_FILE_HEADER.every((byte, index) => header[index] === byte);
};
