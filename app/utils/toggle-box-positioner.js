import defaultCalculatePosition from 'ember-basic-dropdown/utils/calculate-position';

export default function calculatePosition(trigger, content, _destination, ref) {
  // Get initial settings from the default positioner
  let obj = defaultCalculatePosition(...arguments)

  let {
    left: triggerLeft,
    width: triggerWidth,
  } = trigger.getBoundingClientRect();

  let {
    width: contentWidth,
  } = content.getBoundingClientRect();
  let viewportWidth = document.body.clientWidth || window.innerWidth;

  let { verticalPosition/*, horizontalPosition*/ } = obj;
  let bottomOffset = (verticalPosition == 'above' ? -10 : 10);

  // Set these attributes on the dropdown object so we can put the tab in the right spot
  content.setAttribute('data-v-pos', verticalPosition);
  //content.setAttribute('data-h-pos', horizontalPosition);

  obj['style']['top'] = obj['style']['top'] + bottomOffset;
 
  let idealCenter = triggerLeft + triggerWidth / 2;
  let idealRight = viewportWidth - (idealCenter + contentWidth / 2);
  let viewportMargin = 12; // space between popup and edge of screen

  var right = idealRight;
  if (right < viewportMargin) {
    // push to the left
    right = viewportMargin;
  }

  let leftOverflow = right + contentWidth + viewportMargin;
  if (leftOverflow > viewportWidth) {
    obj['style']['left'] = viewportMargin;
    obj['horizontalPosition'] = "left";
    delete obj['style']['right'];
  } else {
    obj['style']['right'] = right;
    obj['horizontalPosition'] = "right";
    delete obj['style']['left'];
  }

  // Apply ember-basic-dropdown's repositioning
  ref.dropdown.applyReposition(trigger, content, obj)

  return obj;
}
