import { helper } from '@ember/component/helper';

export function inExperimentalGroup([group]/*, hash*/) {
  if (window.cxApi) {
    return group === window.cxApi.chooseVariation();
  }
  return group === 0;
}

export default helper(inExperimentalGroup);
