import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';

import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { SubirImgService } from '../uploadImg/subir-img.service';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor( public http: HttpClient,
               public router: Router,
               public _subirImgService: SubirImgService) {
    this.cargarStorage();
  }

  estaLogueado() {
      return ( this.token.length > 5 ) ? true : false;
  }

  cargarStorage() {

    if ( localStorage.getItem('token') ) {
        this.token = localStorage.getItem('token');
        this.usuario = JSON.parse( localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  logOut() {
      this.usuario = null;
      this.token = '';

      localStorage.removeItem('token');
      localStorage.removeItem('usuario');

      this.router.navigate(['/login']);
  }


  guardarStorage(  id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id' , id);
    localStorage.setItem('token' , token);
    localStorage.setItem('usuario' , JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }

  login( usuario: Usuario, remember: boolean = false ) {

      if ( remember ) {
                        localStorage.setItem('email', usuario.email);
      }else {
                        localStorage.removeItem('email');
      }


    const url = URL_SERVICIOS + '/login';
    return this.http.post( url, usuario )
                                          .map( (resp: any) => {
                                            this.guardarStorage(resp.id, resp.token, resp.usuario);
                                            return resp;
                                          });
  }

  crearUsuario( usuario: Usuario ) {
      const url = URL_SERVICIOS + '/usuario';

      return this.http.post( url, usuario ).map( (resp: any) => {
      swal('Usuario Creado', usuario.email, 'success');
      return resp.usuario;
    });
  }

  actualizarUsuario( usuario: Usuario ) {
      const url = URL_SERVICIOS + '/usuario/' + usuario._id + '?token=' + this.token;

     return this.http.put( url, usuario )
                   .map( (resp: any) => {

                    if (usuario._id === this.usuario._id) {
                      const usuarioDB: Usuario = resp.usuario;
                     this.guardarStorage( usuarioDB._id, this.token, usuarioDB );
                    }
                     swal('Usuario Actualizado Correctamente', usuario.nombre, 'success');

                     return true;
                   });
  }


  cambiarImagen( archivo: File, id: string ) {
      this._subirImgService.subirArchivo( archivo, 'usuario', id )
                .then( (resp: any) => {
                  this.usuario.img = resp.usuario.img;
                  swal( 'Imagen Actualizada', this.usuario.nombre, 'success' );
                  this.guardarStorage( id, this.token, this.usuario);
                })
                .catch( resp => {
                  console.log( resp );
                });
  }

  cargarUsuarios( desde: number = 0 ) {
    const url = URL_SERVICIOS + '/usuario?desde=' + desde;

    return this.http.get( url );
  }

  buscarUsuarios( termino: string ) {
      const url = URL_SERVICIOS + '/busqueda/todo/' + termino;
      return this.http.get( url )
                .map(( resp: any ) => resp.usuario);
  }

  borrarUsuario( id: string ) {
    const url = URL_SERVICIOS + '/usuario/' + id + '?token=' + this.token;
    return this.http.delete( url )
    .map( resp =>  {
      swal('Usuario Eliminado', 'El usuario a sido eliminado correcatamente!', 'success');
      return true;
    });

  }

}
