import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import CurrentUserService from 'emberclear/services/current-user';

export default class SettingsRoute extends Route {
  @service currentUser!: CurrentUserService;

  async beforeModel() {
    const exists = await this.currentUser.exists();

    if (!exists) {
      this.transitionTo('setup');

      return;
    }
  }
}
