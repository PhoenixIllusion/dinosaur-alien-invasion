import JoystickController from "joystick-controller";
import { input } from ".";

new JoystickController({level: 10.0, dynamicPosition: true}, (data) => {
  input.direction.x = data.leveledX/10.0;
  input.direction.z = -data.leveledY/10.0;
  if(input.direction.length() < 0.1) {
    input.jump = true;
  } else {
    input.jump = false;
  }
});