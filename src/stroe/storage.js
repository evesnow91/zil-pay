import zilConf from '../config/zil'

import { MTypesInternal } from '../lib/messages/messageTypes'
import { Message } from '../lib/messages/messageCall'

import {
  jazzicon,
  walletCreate,
  unLock,
  logOut,
  balanceUpdate,
  createAccount,
  changeNetwork,
  configUpdate,
  changeAccountName
} from './actions/walletStatus'
import { exportSeed, exportPrivKey } from './actions/export'
import {
  transactionsUpdate,
  nonContractSendTransaction,
  rejectConfirmTx,
  confirmTx,
  clearHistory
} from './actions/transactions'
import { importByPrivateKey } from './actions/import'


export default {
  namespaced: true,
  state: {
    isReady: false,
    isEnable: false,
    isConnected: true,
    wallet: {
      selectedAddress: null, // index
      identities: [/*{address: 0x..., index: 0, publicKey: 0x, balance: 30}*/]
    },
    transactions: { },
    selectednet: Object.keys(zilConf)[0],
    config: zilConf,
    confirmationTx: []
  },
  mutations: {
    setNet(state, selectednet) {
      state.selectednet = selectednet;
    },
    setWallet(state, wallet) {
      const type = MTypesInternal.CHANGE_ACCOUNT;
      const payload = { wallet };

      new Message({ type, payload }).send();
      
      state.wallet = wallet;
    },
    config(state, object) {
      state.config = object;
    },
    mutateIsReady(state, isReady) {
      state.isReady = isReady;
    },
    isEnable(state, isEnable) {
      state.isEnable = isEnable;
    },
    transactions(state, data) {
      state.transactions = data;
    },
    confirmationTx(state, data) {
      if ((typeof data !== 'object') || (!data || data.length < 1)) {
        state.confirmationTx = [];
      } else {
        state.confirmationTx = data.filter(tx => Object.keys(tx).length > 0);
      }
    },
    mutateIsConnected(state, status) {
      state.isConnected = status;
    }
  },
  actions: {
    jazzicon,
    walletCreate,
    unLock,
    logOut,
    balanceUpdate,
    createAccount,
    changeNetwork,
    configUpdate,
    changeAccountName,

    importByPrivateKey,

    exportSeed,
    exportPrivKey,

    transactionsUpdate,
    nonContractSendTransaction,
    rejectConfirmTx,
    confirmTx,
    clearHistory,

    initPopup: () => Message.signal(MTypesInternal.INIT).send(),
    randomSeed: () => Message.signal(MTypesInternal.GET_DECRYPT_SEED).send()
  },
  getters: {    
    CONFIRM_TX(state) {
      if (state.confirmationTx.length < 1) {
        return {};
      }
      let type = 'Send Zil.';
      let method = '';
      const txs = state.confirmationTx;
      const length = txs.length;
      const {
        toAddr,
        gasPrice,
        gasLimit,
        amount,
        code,
        data,
        domain
      } = txs[length - 1];
      if (code && data) {
        type = 'Contract creation.';
      } else if (data) {
        method = JSON.parse(data)._tag;
        type = 'Contract call method: ';
      }
      return {
        length,
        toAddr,
        gasPrice,
        gasLimit,
        amount,
        type,
        method,
        domain
      };
    }
  }
}
