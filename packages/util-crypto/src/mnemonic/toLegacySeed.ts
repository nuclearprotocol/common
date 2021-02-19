// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { assert } from '@polkadot/util';
import { bip39ToSeed, isReady } from '@polkadot/wasm-crypto';

import { mnemonicToSeedSync } from './bip39';
import { mnemonicValidate } from './validate';

/**
 * @name toSeed
 * @summary Creates a valid Ethereum/Bitcoin-compatible seed from a mnemonic input
 * @example
 * <BR>
 *
 * ```javascript
 * import { mnemonicGenerate, mnemonicToBip39, mnemonicValidate } from '@polkadot/util-crypto';
 *
 * const mnemonic = mnemonicGenerate(); // => string
 * const isValidMnemonic = mnemonicValidate(mnemonic); // => boolean
 *
 * if (isValidMnemonic) {
 *   console.log(`Seed generated from mnemonic: ${mnemonicToBip39(mnemonic)}`); => u8a
 * }
 * ```
 */
export function mnemonicToLegacySeed (mnemonic: string, password = '', onlyJs = false, byteLength?: number): Uint8Array {
  assert(mnemonicValidate(mnemonic), 'Invalid bip39 mnemonic specified');

  if (byteLength && byteLength === 32) {
    return isReady() && !onlyJs
      ? bip39ToSeed(mnemonic, password)
      : mnemonicToSeedSync(mnemonic, password).subarray(0, 32);
  } else if (!byteLength || (byteLength && byteLength === 64)) {
    return mnemonicToSeedSync(mnemonic, password);
  } else {
    throw new Error('wrong byte length for mnemonicToLegacySeed');
  }
}
