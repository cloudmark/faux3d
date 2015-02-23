module faux3d {
  export module events {
    export enum Direction {
      up, down, left, right
    }

    export class KeyboardPressedEvent {
      constructor(public direction:Direction, public distance:number) {
      }
    }
  }
}
