import { input } from "./input-interface";

function onDocumentKeyDown(event: KeyboardEvent) {
  var keyCode = event.which;
  if (keyCode == 87) {
    input.direction.z = -1;
  } else if (keyCode == 83) {
    input.direction.z = 1;
  } else if (keyCode == 65) {
    input.direction.x = -1;
  } else if (keyCode == 68) {
    input.direction.x = 1;
  } else if (keyCode == 32) {
    input.jump = true;
  }
};
function onDocumentKeyUp(event: KeyboardEvent) {
  var keyCode = event.which;
  if (keyCode == 87) {
    input.direction.z = 0;
  } else if (keyCode == 83) {
    input.direction.z = 0;
  } else if (keyCode == 65) {
    input.direction.x = 0;
  } else if (keyCode == 68) {
    input.direction.x = 0;
  } else if (keyCode == 32) {
    input.jump = false;
  }
};

document.addEventListener("keydown", onDocumentKeyDown, false);
document.addEventListener("keyup", onDocumentKeyUp, false);