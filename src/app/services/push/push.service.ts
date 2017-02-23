import * as firebase from 'firebase';

import { Injectable } from '@angular/core';
import { DatabaseService } from '../../services/database/database.service';
import { User } from '../../models/user.model';
import { Push } from '../../models/push.model';

@Injectable()
export class PushService {

  constructor(private databaseService: DatabaseService) {

    if (this.isPushSupported()) {
      this.checkPushSubscription().then(pushSubscription => {
        if (!pushSubscription) {
          this.subscribeToPushService();
        } else {
          console.log('[push] is subscribed');
        }
      });
    }
  }

  public isPushSupported() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      return true;
    }
    return false;
  }

  private checkPushSubscription() {
    return navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
      return serviceWorkerRegistration.pushManager.getSubscription();
    });
  }

  private subscribeToPushService() { // here FCM
    navigator.serviceWorker.ready.then(serviceWorkerRegistration => {

      serviceWorkerRegistration.pushManager.subscribe({ userVisibleOnly: true })
        .then(pushSubscription => {
          this.storeSubscriptionInFirebase(pushSubscription);

        }).catch(err => {
          console.log('[push] could not subscribe to FCM: ' + err);

        });
    });
  }

  private unsubscribeFromPushService() {
    navigator.serviceWorker.ready.then(serviceWorkerRegistration => {

      serviceWorkerRegistration.pushManager.getSubscription().then(pushSubscription => {
        if (pushSubscription) {
          (pushSubscription as any).unsubscribe().then(() => {
            console.log('[push] successfully unsubscribed');
          });
        }
      }).catch(err => {
        console.log('[push] failed to unsubscribe');
      });
    });

    // ToDo: remove push key from firebase
  }

  private storeSubscriptionInFirebase(pushSubscription: PushSubscription) {
    let push = new Push(
      pushSubscription.endpoint,
      (pushSubscription as any).toJSON().keys.auth,
      (pushSubscription as any).toJSON().keys.p256dh
    );

    // maybe store also to User IndexedDB -> prevents sending push to same device
    this.databaseService.getUser()
      .then(user => {
        firebase.database().ref('links/' + user.uid + '/push-subscriptions/' + push.auth)
          .set({
            endpoint: push.endpoint,
            auth: push.auth,
            p256dh: push.p256dh
          })
          .then(() => {
            console.log('[push] successfully subscribed');
            this.databaseService.updateUser(new User(user.uid, user.token, push));
          })
          .catch(err => {
            this.unsubscribeFromPushService(); // only allow subsriptions if transfered to FB
            console.log(err);
          });
      });
  }
}
