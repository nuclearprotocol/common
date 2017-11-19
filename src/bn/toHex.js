// ISC, Copyright 2017 Jaco Greeff
// @flow

const BN = require('bn.js');

const hexAddPrefix = require('../hex/addPrefix');
const isBN = require('../is/bn');

const ZERO_STR = '0x';

module.exports = function toHex (value?: BN): string {
  if (!value) {
    return ZERO_STR;
  }

  if (!isBN(value)) {
    throw new Error(`Cannot convert from non-BN value '${value}' to hex`);
  }

  return hexAddPrefix(value.toString(16));
};