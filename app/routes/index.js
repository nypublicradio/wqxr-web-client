import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import PlayParamMixin from 'wqxr-web-client/mixins/play-param';
import DS from 'ember-data';
import RSVP from 'rsvp';

// const STREAM_BG = '/assets/img/backgrounds/main-player/background-main-player.svg';
const STREAM_BG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI5NCIgaGVpZ2h0PSIzNDQiIHZpZXdCb3g9IjAgMCAxMjk0IDM0NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxyZWN0IHdpZHRoPSIxMjk0IiBoZWlnaHQ9IjM0NCIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iLTAuNzEwOTM4IiB5PSItMTE0LjQ0IiB3aWR0aD0iMTI5Ny4wMyIgaGVpZ2h0PSI2NzAuNDI5IiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXIpIi8+CjxnIG9wYWNpdHk9IjAuMSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMzU1LjY4NCAxNDIuNTU5VjU1NS45OUgzNTkuMzI3VjE0Mi41NTlIMzU1LjY4NFpNMzczLjkwMSAyODYuNTkzVjU1NS45OUgzNzcuNTQ1VjI4Ni41OTNIMzczLjkwMVpNMzkzLjk0MSA1NTUuOTlWMTQyLjU1OUgzOTcuNTg1VjU1NS45OUgzOTMuOTQxWk00MTIuMTU5IDIzNC43NzJWNTU1Ljk5SDQxNS44MDNWMjM0Ljc3Mkg0MTIuMTU5Wk00MzAuMzc3IDU1NS45OVYxOTguMTkySDQzNC4wMlY1NTUuOTlINDMwLjM3N1pNNDUwLjQxNyAxOTAuOTUyVjU1NS45OUg0NTQuMDZWMTkwLjk1Mkg0NTAuNDE3Wk00NjguNjM0IDU1NS45OVYyODYuNTkzSDQ3Mi4yNzhWNTU1Ljk5SDQ2OC42MzRaTTQ4Ni44NTIgMjE1LjcxOVY1NTUuOTlINDkwLjQ5NlYyMTUuNzE5SDQ4Ni44NTJaTTUwNi44OTIgNTU1Ljk5VjI4Ni41OTNINTEwLjUzNlY1NTUuOTlINTA2Ljg5MlpNNTI1LjExIDM4Ni4wNDVWNTU1Ljk5SDUyOC43NTNWMzg2LjA0NUg1MjUuMTFaTTU0My4zMjggNTU1Ljk5VjM0OS4wODRINTQ2Ljk3MVY1NTUuOTlINTQzLjMyOFpNNTYzLjM2NyA0NDEuMjk3VjU1NS45OUg1NjcuMDExVjQ0MS4yOTdINTYzLjM2N1pNNTgxLjU4NSA1NTUuOTlWMzM0Ljk4Nkg1ODUuMjI5VjU1NS45OUg1ODEuNTg1Wk01OTkuODAzIDE5MC45NTJWNTU1Ljk5SDYwMy40NDdWMTkwLjk1Mkg1OTkuODAzWk02MTkuODQzIDU1NS45OVYyNTAuMDEzSDYyMy40ODZWNTU1Ljk5SDYxOS44NDNaTTYzOC4wNjEgMzIyLjAzVjU1NS45OUg2NDEuNzA0VjMyMi4wM0g2MzguMDYxWk02NTYuMjc5IDU1NS45OVYzNzIuNzA5SDY1OS45MjJWNTU1Ljk5SDY1Ni4yNzlaTTY3Ni4zMTggNDIxLjQ4MlY1NTUuOTlINjc5Ljk2MlY0MjEuNDgySDY3Ni4zMThaTTY5NC41MzYgNTU1Ljk5VjM1OC42MUg2OTguMThWNTU1Ljk5SDY5NC41MzZaIiBmaWxsPSIjNDgyNzlBIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNzEzLjM3OSA4NC45NzEyVjU1NS45OUg3MTcuMDIzVjg0Ljk3MTJINzEzLjM3OVpNNzMxLjU5NyAyNDkuMjE4VjU1NS45OUg3MzUuMjRWMjQ5LjIxOEg3MzEuNTk3Wk03NTEuNjM2IDU1NS45OVY4NC45NzEySDc1NS4yOFY1NTUuOTlINzUxLjYzNlpNNzY5Ljg1NCAxOTAuMTVWNTU1Ljk5SDc3My40OThWMTkwLjE1SDc2OS44NTRaTTc4OC4wNzIgNTU1Ljk5VjE0OC4yMzFINzkxLjcxNlY1NTUuOTlINzg4LjA3MlpNODA4LjExMiAxNDAuMjI4VjU1NS45OUg4MTEuNzU1VjE0MC4yMjhIODA4LjExMlpNODI2LjMzIDU1NS45OVYyNDkuMjE4SDgyOS45NzNWNTU1Ljk5SDgyNi4zM1pNODQ0LjU0OCAxNjguNDI4VjU1NS45OUg4NDguMTkxVjE2OC40MjhIODQ0LjU0OFpNODY0LjU4NyA1NTUuOTlWMjQ5LjIxOEg4NjguMjMxVjU1NS45OUg4NjQuNTg3Wk04ODIuODA1IDM2Mi40VjU1NS45OUg4ODYuNDQ5VjM2Mi40SDg4Mi44MDVaTTkwMS4wMjMgNTU1Ljk5VjMyMC4xSDkwNC42NjdWNTU1Ljk5SDkwMS4wMjNaTTkyMS4wNjMgNDI1LjI3OVY1NTUuOTlIOTI0LjcwNlY0MjUuMjc5SDkyMS4wNjNaTTkzOS4yODEgNTU1Ljk5VjMwNC4wOTRIOTQyLjkyNFY1NTUuOTlIOTM5LjI4MVpNOTU3LjQ5OSAxNDAuMjI4VjU1NS45OUg5NjEuMTQyVjE0MC4yMjhIOTU3LjQ5OVpNOTc3LjUzOCA1NTUuOTlWMjA3LjI5OUg5ODEuMTgyVjU1NS45OUg5NzcuNTM4Wk05OTUuNzU2IDI4OS42MTNWNTU1Ljk5SDk5OS40VjI4OS42MTNIOTk1Ljc1NlpNMTAxMy45NyA1NTUuOTlWMzQ3LjE1N0gxMDE3LjYyVjU1NS45OUgxMDEzLjk3Wk0xMDM0LjAxIDQwMi43OTVWNTU1Ljk5SDEwMzcuNjZWNDAyLjc5NUgxMDM0LjAxWk0xMDUyLjIzIDU1NS45OVYzMzEuMTUxSDEwNTUuODhWNTU1Ljk5SDEwNTIuMjNaIiBmaWxsPSIjNDgyNzlBIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTA2Ni4wMSAyMDkuNjAyVjU1NS45OUgxMDY5LjY2VjIwOS42MDJIMTA2Ni4wMVpNMTA4NC4yNiAzMzAuNFY1NTUuOTlIMTA4Ny45MVYzMzAuNEgxMDg0LjI2Wk0xMTA0LjM0IDU1NS45OVYyMDkuNjAySDExMDhWNTU1Ljk5SDExMDQuMzRaTTExMjIuNiAyODYuOTU4VjU1NS45OUgxMTI2LjI1VjI4Ni45NThIMTEyMi42Wk0xMTQwLjg2IDU1NS45OVYyNTYuMDkySDExNDQuNTFWNTU1Ljk5SDExNDAuODZaTTExNjAuOTQgMjUwLjM3NlY1NTUuOTlIMTE2NC41OVYyNTAuMzc2SDExNjAuOTRaTTExNzkuMTkgNTU1Ljk5VjMzMC40SDExODIuODRWNTU1Ljk5SDExNzkuMTlaTTExOTcuNDUgMjcwLjk1NFY1NTUuOTlIMTIwMS4xVjI3MC45NTRIMTE5Ny40NVpNMTIxNy41MyA1NTUuOTlWMzMwLjRIMTIyMS4xOFY1NTUuOTlIMTIxNy41M1pNMTIzNS43OCA0MTMuNDcyVjU1NS45OUgxMjM5LjQ0VjQxMy40NzJIMTIzNS43OFpNMTI1NC4wNCA1NTUuOTlWMzgyLjYwNkgxMjU3LjY5VjU1NS45OUgxMjU0LjA0Wk0xMjc0LjEyIDQ1OS45NjJWNTU1Ljk5SDEyNzcuNzdWNDU5Ljk2MkgxMjc0LjEyWk0xMjkyLjM4IDU1NS45OVYzNzAuNzkzSDEyOTYuMDNWNTU1Ljk5SDEyOTIuMzhaIiBmaWxsPSIjNDgyNzlBIi8+CjwvZz4KPC9nPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyIiB4MT0iMTczOC4yNCIgeTE9IjQzMi44NzkiIHgyPSIxNTgzLjQ5IiB5Mj0iLTk2LjUxMjUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzEyOENGNCIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMTYyQUIiLz4KPC9saW5lYXJHcmFkaWVudD4KPGNsaXBQYXRoIGlkPSJjbGlwMCI+CjxyZWN0IHdpZHRoPSIxMjk0IiBoZWlnaHQ9IjM0NCIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K'

export default Route.extend(PlayParamMixin, {
  googleAds:  service(),
  classNames: ['home'],
  dj: service(),
  fastboot: service(),
  metadata: service(),

  model() {
    get(this, 'googleAds').doTargeting();
    let hash = {
      wqxrHome: this.store.findRecord('bucket', 'wqxr-home').then(b => {
        return {
          featuredItems: b.get('bucketItems').slice(0, 9),
          otherItems: b.get('bucketItems').slice(9)
        };
      }),
    };
    // django pages don't work w/ FastBoot, and these chunks are rendered with
    // the django page component, so don't load these until the browser environment
    if (!this.get('fastboot.isFastBoot')) {
      hash.wartopChunk = this.store.findRecord('chunk', 'wqxr-wartop-home').catch(()=>'');
      hash.liveChunk = this.store.findRecord('chunk', 'wqxr-live-home').catch(()=>'');
      hash.membershipChunk = this.store.findRecord('chunk', 'wqxr-membership-home').catch(() => '');
    }
    return RSVP.hash(hash);
  },
  afterModel() {
    this.get('metadata').setHeadData({
      path: '',
    });
  },
  setupController(controller) {
    this._super(...arguments);
    let streams = DS.PromiseArray.create({
      promise: this.store.findAll('stream', {reload: true}).then(s => {
        return s.filterBy('liveWQXR').sortBy('sitePriority')
          .concat(s.filterBy('liveWNYC').sortBy('sitePriority')).uniq();
      })
    });
    controller.set('streams', streams);
    controller.set('background', STREAM_BG);

  }
});
