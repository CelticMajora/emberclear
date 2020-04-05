import Model, { attr } from '@ember-data/model';
import { toHex } from 'emberclear/utils/string-encoding';

export interface PublicKey {
  publicKey: Uint8Array;
  publicSigningKey: Uint8Array;
}

export default class Identity extends Model implements Partial<PublicKey> {
  @attr() name!: string;
  @attr() publicKey!: Uint8Array;
  @attr() publicSigningKey!: Uint8Array;

  get publicKeyAsHex() {
    return toHex(this.publicKey);
  }

  get uid() {
    return this.publicKeyAsHex;
  }

  get displayName() {
    const name = this.name;
    const shortKey = this.publicKeyAsHex.substring(0, 8);

    return `${name} (${shortKey})`;
  }

  // @hasMany('message', { async: false }) messages!: unknown[];
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    identity: Identity;
  }
}
