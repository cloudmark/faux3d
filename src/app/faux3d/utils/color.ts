module faux3d {
  export module utils {
    export class ColorUtils {
      static BLACK:string = '#000000';
      static WHITE:string = '#FFFFFF';
      static RED:string = '#FF0000';
      static GREEN:string = '#00FF00';
      static BLUE:string = '#0000FF';

      function

      static hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      }

    }


  }
}
