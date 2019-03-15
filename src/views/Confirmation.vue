<template>
  <div v-if="isObject" class="container">
    <div class="row justify-content-center">
      <div class="jumbotron text-ightindigo text-left p-3">
        <h5 class="text-lightviolet">
          Confirmation! <b class="text-warning">{{CONFIRM_TX.length}}</b>
        </h5>
        <p class="text-indigo">
          Type: <b class="text-ightindigo">{{CONFIRM_TX.type}}</b>
          <br>
          Amount: 
          <b class="text-ightindigo">
            {{CONFIRM_TX.amount | fromZil}}
          </b>
          <span class="text-warning">
            {{currencyController.nativeCurrency}}
          </span>
          <small v-if="amounMsg"
                 class="form-text text-danger">
            {{amounMsg}}
          </small>
          <br>
          Amount: 
          <b class="text-ightindigo">
            {{CONFIRM_TX.amount | toUSD(currencyController.conversionRate)}}
          </b>
          <span class="text-warning">
            {{currencyController.currentCurrency}}
          </span>
          <br>
          <b v-if="data && data.title">
            app: <b class="text-ightindigo">{{data.title}}</b>
          </b>
        </p>
        
        <hr class="my-4">

        <div v-if="data && data.favIconUrl"
             class="d-flex justify-content-center">
          <img  :src="data.favIconUrl" height="50">
        </div>

        <div class="row m-2 text-center justify-content-center">
          <div>
            <a class="text-truncate text-ightindigo"
               :href="exploreAddress(from)" target="_blanck">
              Account 1
            </a>
          </div>

          <b class="ml-5 text-pink">&#62;</b>

          <div class="ml-5">
            <a class="text-truncate text-warning"
               :href="exploreAddress(CONFIRM_TX.toAddr)" target="_blanck">
              {{CONFIRM_TX.toAddr | trimAddress}}
            </a>
          </div>
        </div>

        <form class="col">
          <div class="form-group">
            <label for="gas">Gas Price (ZILs)</label>
            <input type="text"
                   class="form-control bg-null"
                   id="gas"
                   v-model="gas"
                   :value="CONFIRM_TX.gasPrice | fromZil">
            <small class="form-text text-danger"
                   v-if="!$v.gas.sameAs">{{gasMsg}}</small>
          </div>
          <div class="form-group">
            <label for="gas">Gas Limit (ZILs)</label>
            <input type="number"
                   step="1"
                   class="form-control bg-null"
                   min="1"
                   v-model="gasLimit"
                   :value="CONFIRM_TX.gasLimit">
          </div>

          <div class="p-2">
            <button v-btn="'success btn-lg mr-2'"
                    :disabled="!!amounMsg || !!gasMsg || gasLimit < 1"
                    @click="confirm">CONFIRM</button>
            <button v-btn="'danger btn-lg ml-2'"
                    @click="rejectConfirmTx">REJECT</button>
          </div>
      </form>

      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import trimAddress from '../filters/trimAddress'
import { validationMixin } from 'vuelidate'
import { sameAs, required } from 'vuelidate/lib/validators'
import { fromZil, toUSD, toZil } from '../filters/zil'
import explorer from '../mixins/explorer'
import { ERRORCODE } from '../lib/errors/code'
import btn from '../directives/btn'


export default {
  name: 'Confirmation',
  filters: { trimAddress, fromZil, toUSD },
  directives: { btn },
  mixins: [explorer, validationMixin],
  data() {
    return {
      data: window.data,
      gas: 0, gasMsg: null,
      gasLimit: 1, gasLimitMsg: null
    };
  },
  validations: {
    gas: {
      sameAs: sameAs(vue => {
        if (vue.gas <= 0 || isNaN(vue.gas) || vue.gas == '') {
          vue.gasMsg = ERRORCODE[0];
          return true;
        } else if (vue.gas > +fromZil(vue.account.balance)) {
          vue.gasMsg = ERRORCODE[1];
          return true;
        }

        vue.gasMsg = null;

        return false;
      })
    },
    gasLimit: {
      required
    }
  },
  computed: {
    ...mapState([
      'currencyController'
    ]),
    ...mapState('storage', [
      'wallet',
      'confirmationTx'
    ]),
    ...mapGetters('storage', [
      'CONFIRM_TX'
    ]),

    from() {
      return this.account.address;
    },
    isObject() {
      if (Object.keys(this.CONFIRM_TX).length > 0) {
        return true;
      } else {
        if (window.data) {
          window.close();
        } else {
          this.$router.push({ name: 'home' });
        }        
        return false;
      }
    },
    account() {
      return this.wallet.identities[
        this.wallet.selectedAddress
      ];
    },
    amounMsg() {
      if (+this.CONFIRM_TX.amount > +this.account.balance) {
        return ERRORCODE[1];
      }

      return null;
    }
  },
  methods: {
    ...mapMutations(['spiner']),
    ...mapActions('storage', [
      'getConfirmationTx',
      'rejectConfirmTx',
      'confirmTx'
    ]),

    async confirm() {
      this.spiner();
      await this.confirmTx({
        gasPrice: toZil(this.gas),
        gasLimit: this.gasLimit
      });
      this.spiner();
    }
  },
  mounted() {
    this.gas = fromZil(this.CONFIRM_TX.gasPrice);
    this.gasLimit = this.CONFIRM_TX.gasLimit;
  }
}
</script>

<style lang="scss">
.jumbotron {
  min-width: 310px;
  font-size: 14px;
}
</style>