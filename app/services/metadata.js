import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';
import config from '../config/environment';

export default Service.extend({
  headData: service(),
  setHeadData(metadata={}) {
    const defaultMetadata = {
      type: 'website',
      twitterCard: 'summary',
      path: '',
      keywords: 'npr, new york, WQXR, WNYC, arts, culture, classical, music, news, public, radio',
      description: 'WQXR - New York Public Radio',
      image: {
        url: `${config.mediaRoot}/i/300/300/c/80/1/wqxr_square_logo.png`,
        w: '300',
        h: '300',
      },
      feeds: [],
    };

    // filter out keys with undefined values, so they get replaced
    // by defaults when we merge.
    let filteredData = Object.keys(metadata).filter(key => {
      return typeof metadata[key] !== 'undefined';
    }).reduce((filteredObject, key) => {
      filteredObject[key] = metadata[key];
      return filteredObject;
    }, {});
    let mergedData = Object.assign({}, defaultMetadata, filteredData);
    mergedData.description = mergedData.description.replace(/(<([^>]+)>)/g, "");
    set(this, 'headData.type', mergedData.type);
    set(this, 'headData.twitterCard', mergedData.twitterCard);
    set(this, 'headData.url', `https:${config.webRoot}${mergedData.path}`);
    set(this, 'headData.keywords', mergedData.keywords);
    set(this, 'headData.description', mergedData.description);
    set(this, 'headData.image', mergedData.image);
    set(this, 'headData.feeds', mergedData.feeds);
    set(this, 'headData.mediaRoot', config.mediaRoot);
  }
});
