declare module 'joystick-controller' {
    /**
   * Options for the joystick
   * @property maxRange - Maximum range of the joystick dot (number of pixels)
   * @property level - Number of level of the joystick (eg 10 would return integers between -10 and 10)
   * @property radius - Radius of the joystick container (number of pixels)
   * @property joystickRadius - Radius of the joystick inner dot (number of pixels)
   * @property opacity - Opacity of the joystick
   * @property containerClass - Class for the joystick container for adding additional styles (outer container)
   * @property controllerClass - Class for the joystick controller for adding additional styles (inner container)
   * @property joystickClass - Class for the joystick dot for adding additional styles
   * @property leftToRight - Left to right adjustment (x position from left)
   * @property bottomToUp - Bottom to up adjustment (y position from bottom)
   * @property x - x position of the joystick controller on screen (equal to left/right of css)
   * @property y - y position of the joystick controller on screen (equal to bottom/top of css)
   * @property distortion - if true, the joystick will be distorted when the dot is moved to the edge of the joystick
   * @property dynamicPositionTarget - Shows the joystick when the user touch/click on the screen at the position where it was clicked/touched
   * @property dynamicPositionTarget - If dynamicPosition true, uses this target to set the event listener on (if not provided use document)
   * @property mouseClickButton - click button to show the joystick (if not provided, shows on all clicks)(Values: ALL, LEFT, MIDDLE, RIGHT, or button numbers (-1 to 4. -1 for all))
   * @property hideContextMenu - if true, hides the context menu on right click
   */
  export interface JoystickOptions {
    maxRange: number;
    level: number;
    radius: number;
    joystickRadius: number;
    opacity: number;
    containerClass: string;
    controllerClass: string;
    joystickClass: string;
    leftToRight: boolean;
    bottomToUp: boolean;
    x: string;
    y: string;
    distortion: boolean;
    dynamicPosition: boolean;
    dynamicPositionTarget: HTMLElement;
    mouseClickButton: string | number;
    hideContextMenu: boolean;
  };

  /**
  * Joystick onMove Callback
  * @property x - x position of the joystick relative to the center of it
  * @property y - y position of the joystick relative to the center of it
  * @property leveledX - x position scaled and rounded to be a step between -level to level (level comes from options)
  * @property leveledY - y position scaled and rounded to be a step between -level to level (level comes from options)
  * @property angle - angle of the line between center of the joystick and position of the dot in radians
  * @property distance - distance of the dot from the center joystick
  */
  export interface JoystickOnMove {
    x: number;
    y: number;
    leveledX: number;
    leveledY: number;
    angle: number;
    distance: number;
  };

  /**
  * A JavaScript library for creating a virtual joystick.
  */
  export const MOUSE_CLICK_BUTTONS = {
    ALL: -1,
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2,
  };

  /**
  * @param options - Options for the joystick
  */
  export default class JoystickController {
    constructor(options: Partial<JoystickOptions>, onMove: (coordinates: JoystickOnMove) => void);
    /**
     * To remove the joystick from the DOM and clear all the listeners
     */
    destroy(): void;
  }


}