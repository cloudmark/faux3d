module faux3d {
  export module utils {
    export class MathUtils {
      static degreesToRadians(degree:number) {
        return (degree % 360) * (Math.PI / 180.0);
      }
    }
  }

}
