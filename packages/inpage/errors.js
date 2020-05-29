/*
 * Project: ZilPay-wallet
 * Author: Rinat(lich666dead)
 * -----
 * Modified By: the developer formerly known as Rinat(lich666dead) at <lich666black@gmail.com>
 * -----
 * Copyright (c) 2019 ZilPay
 */
export const ERROR_MSGS = {
  REQUIRED: 'is required',
  INIT_PARAMS: 'Cannot deploy without code or initialisation parameters.',
  CONNECT: 'User is\'t connections.',
  DISABLE_DMETHOD: 'this method not allowed in ZIlPay',
  DISABLED: 'ZilPay is disabled.',
  CONTRACT_HASN_TDEPLOYED: 'Contract has not been deployed!'
}

export class InstanceError extends Error {

  constructor(varName, object, msg) {
    super(`${varName} should be: ${object} ${msg}`)
  }
}

export class ArgumentError extends Error {

  constructor(argName, msg) {
    super(`${argName} ${msg}`)
  }
}

export class ShouldArrayError extends TypeError {

  constructor(varName, msg) {
    super(`${varName} should be array ${msg}`)
  }
}

export class FormatError extends TypeError {

  constructor(varName, msg) {
    super(`${varName} incorrect format ${msg}`)
  }
}

export class AccessError extends Error {

  constructor(msg) {
    super(msg)
  }
}

export class RPCError extends Error {

  constructor(msg) {
    super(msg)
  }
}
