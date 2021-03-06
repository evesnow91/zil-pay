import { extension } from 'extensionizer';
import { Loger } from '../../lib/logger';
import Config from '../../config/api'


const log = new Loger(Config.PAY_NAME + '.Inject');

export class Inject {

  constructor(name) {
    this._name = name;
    this._injectscript();
  }

  _injectscript () {
    const container = (document.head || document.documentElement);
    const scriptTag = document.createElement('script');
    const src = this._getUrlExtension();
    scriptTag.setAttribute('async', false);
    scriptTag.src = src;
    container.insertBefore(scriptTag, container.children[0]);
    container.removeChild(scriptTag);
  }

  _getUrlExtension() {
    try {
      return extension.getURL(`/${this._name}`);
    } catch(err) {
      log.error('URL extension Error', err);
      return null;
    }
  }

  _injectToHtml(container, injectionSite) {
    try {
      injectionSite.insertBefore(container, injectionSite.children[0]);
    } catch(err) {
      log.error('Script injection failed', err);
    }
  }
}