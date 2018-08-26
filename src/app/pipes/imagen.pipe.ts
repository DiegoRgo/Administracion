import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: string = 'usuario'): any {

      const url = URL_SERVICIOS + '/img';

      if (!img) {
        return url + '/usuario/xxx';
      }

      if ( tipo === 'usuario' ) {
        return url + '/usuario/' + img;
      }

    return url;
  }

}
