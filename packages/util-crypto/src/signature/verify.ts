// Copyright 2017-2020 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { KeypairType, VerifyResult } from '../types';

import { assert, u8aToU8a } from '@polkadot/util';

import { decodeAddress } from '../address/decode';
import { naclVerify } from '../nacl/verify';
import { schnorrkelVerify } from '../schnorrkel/verify';
import { secp256k1Verify } from '../secp256k1/verify';

interface VerifyInput {
  message: Uint8Array | string;
  publicKey: Uint8Array;
  signature: Uint8Array;
}

type Verifier = [KeypairType, (message: Uint8Array | string, signature: Uint8Array, publicKey: Uint8Array, isExpanded?: boolean) => boolean];

const secp256k1VerifyHasher = (hashType: 'blake2' | 'keccak') =>
  (message: Uint8Array | string, signature: Uint8Array, publicKey: Uint8Array, isExpanded?: boolean) =>
    secp256k1Verify(message, signature, publicKey, { hashType, isExpanded });

const VERIFIERS_ECDSA: Verifier[] = [
  ['ecdsa', secp256k1VerifyHasher('blake2')],
  ['ethereum', secp256k1VerifyHasher('keccak')]
];

const VERIFIERS: Verifier[] = [
  ['ed25519', naclVerify],
  ['sr25519', schnorrkelVerify],
  ...VERIFIERS_ECDSA
];

const CRYPTO_TYPES: ('ed25519' | 'sr25519' | 'ecdsa')[] = ['ed25519', 'sr25519', 'ecdsa'];

function verifyDetect (result: VerifyResult, { message, publicKey, signature }: VerifyInput, isExpanded?: boolean, verifiers = VERIFIERS): VerifyResult {
  result.isValid = verifiers.some(([crypto, verify]): boolean => {
    try {
      if (verify(message, signature, publicKey, isExpanded)) {
        result.crypto = crypto;

        return true;
      }
    } catch (error) {
      // do nothing, result.isValid still set to false
    }

    return false;
  });

  return result;
}

function verifyMultisig (result: VerifyResult, { message, publicKey, signature }: VerifyInput, isExpanded?: boolean): VerifyResult {
  assert([0, 1, 2].includes(signature[0]), `Unknown crypto type, expected signature prefix [0..2], found ${signature[0]}`);

  const type = CRYPTO_TYPES[signature[0]] || 'none';

  result.crypto = type;

  try {
    result.isValid = {
      ecdsa: () => verifyDetect(result, { message, publicKey, signature: signature.subarray(1) }, isExpanded, VERIFIERS_ECDSA).isValid,
      ed25519: () => naclVerify(message, signature.subarray(1), publicKey),
      none: () => { throw Error('no verify for `none` crypto type'); },
      sr25519: () => schnorrkelVerify(message, signature.subarray(1), publicKey)
    }[type]();
  } catch (error) {
    // ignore, result.isValid still set to false
  }

  return result;
}

export function signatureVerify (message: Uint8Array | string, signature: Uint8Array | string, addressOrPublicKey: Uint8Array | string, isExpanded?: boolean): VerifyResult {
  const signatureU8a = u8aToU8a(signature);

  assert([64, 65, 66].includes(signatureU8a.length), `Invalid signature length, expected [64..66] bytes, found ${signatureU8a.length}`);

  const result: VerifyResult = { crypto: 'none', isValid: false };
  const publicKey = decodeAddress(addressOrPublicKey);
  const input = { message, publicKey, signature: signatureU8a };

  return [0, 1, 2].includes(signatureU8a[0]) && [65, 66].includes(signatureU8a.length)
    ? verifyMultisig(result, input, isExpanded)
    : verifyDetect(result, input, isExpanded);
}
