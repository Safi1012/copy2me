import * as firebase from 'firebase';

import { Injectable } from '@angular/core';
import { DatabaseService } from '../../services/database/database.service';
import { User } from '../../models/user.model';
import { Push } from '../../models/push.model';

@Injectable()
export class PushService {

  public isSubscribed = false;

  constructor(private databaseService: DatabaseService) {}

  public loadSubscriptionState(): Promise<{}> {
    return new Promise((resolve, reject) => {
      if (this.isPushSupported()) {

        this.checkPushSubscription().then(pushSubscription => {
          if (!pushSubscription) {
            this.isSubscribed = false;
            resolve();
          } else {
            // is needed because a user can delete all caches (IndexedDB)
            this.storeSubscriptionData(pushSubscription);
            this.isSubscribed = true;
            resolve();
          }
        });
      }
    });
  }

  public subscribeToPush(): Promise<{}> {
    return new Promise((resolve, reject) => {
      this.subscribeToPushService().then(() => {
        this.isSubscribed = true;
        resolve();
      }).catch(() => {
        this.isSubscribed = false;
        reject();
      });
    });
  }

  public unsubsribeFromPush(): Promise<{}> {
    return new Promise((resolve, reject) => {
      this.unsubscribeFromPushService().then(() => {
        this.isSubscribed = false;
        resolve();
      }).catch(() => {
        this.isSubscribed = true;
        resolve();
      });
    });
  }

  public isPushSupported() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      return true;
    }
    return false;
  }

  private storeSubscriptionData(pushSubscription: PushSubscription) {
    let push = new Push(
      pushSubscription.endpoint,
      (pushSubscription as any).toJSON().keys.auth,
      (pushSubscription as any).toJSON().keys.p256dh
    );
    this.databaseService.setUserSubscriptionData(push);
  }

  private checkPushSubscription() {
    return navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
      return serviceWorkerRegistration.pushManager.getSubscription();
    });
  }

  private subscribeToPushService(): Promise<ServiceWorkerRegistration | void> { // here FCM
    return navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
      return serviceWorkerRegistration.pushManager.subscribe({ userVisibleOnly: true })
        .then(pushSubscription => {
          this.storeSubscription(pushSubscription);

        }).catch(err => {
          console.log('[push] could not subscribe to FCM: ' + err);

        });
    });
  }

  private unsubscribeFromPushService(): Promise<ServiceWorkerRegistration | void> {
    return navigator.serviceWorker.ready.then(serviceWorkerRegistration => {

      return serviceWorkerRegistration.pushManager.getSubscription().then(pushSubscription => {
        if (pushSubscription) {
          (pushSubscription as any).unsubscribe().then(() => {
            console.log('[push] successfully unsubscribed');
          });
          this.removeSubscriptionFromFirebase();
        }
      }).catch(err => {
        console.log('[push] failed to unsubscribe');
      });
    });
  }

  private storeSubscription(pushSubscription: PushSubscription) {
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
            this.databaseService.setUserSubscriptionData(push);
          })
          .catch(err => {
            this.unsubscribeFromPushService(); // revert subsription if not succesfully transfered to FB
            console.log(err);
          });
      });
  }

  private removeSubscriptionFromFirebase() {
    this.databaseService.getUser()
      .then(user => {
        firebase.database().ref('links/' + user.uid + '/push-subscriptions/' + user.push.auth).set(null);
      });
  }
}
