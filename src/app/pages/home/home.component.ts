import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgModule,
} from '@angular/core';
import { MediapipeService } from 'app/services/mediapipe.service';

const FACE_GESTURES = [
  { tipo: 'rostro', nombre: 'Sonríe', shape: 'mouthSmileLeft', umbral: 0.4 },
  {
    tipo: 'rostro',
    nombre: 'Levanta las cejas',
    shape: 'browOuterUpLeft',
    umbral: 0.5,
  },
  {
    tipo: 'rostro',
    nombre: 'Frunce el ceño',
    shape: 'browDownLeft',
    umbral: 0.5,
  },
  {
    tipo: 'rostro',
    nombre: 'Cierra el ojo izquierdo',
    shape: 'eyeBlinkLeft',
    umbral: 0.5,
  },
  {
    tipo: 'rostro',
    nombre: 'Cierra el ojo derecho',
    shape: 'eyeBlinkRight',
    umbral: 0.5,
  },
  { tipo: 'rostro', nombre: 'Abre la boca', shape: 'jawOpen', umbral: 0.5 },
];

const HAND_GESTURES = [
  { tipo: 'mano', nombre: 'Haz un pulgar arriba 👍', shape: 'Thumb_Up' },
  { tipo: 'mano', nombre: 'Haz la seña de victoria ✌️', shape: 'Victory' },
  { tipo: 'mano', nombre: 'Haz la palma abierta 🖐️', shape: 'Open_Palm' },
  { tipo: 'mano', nombre: 'Haz el signo del rock 🤟', shape: 'ILoveYou' },
];

const GESTURES = [...FACE_GESTURES, ...HAND_GESTURES];

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  cambiarGesto() {
    const nuevaLista = GESTURES.filter((g) => g.shape !== this.gesture.shape);
    this.gesture = nuevaLista[Math.floor(Math.random() * nuevaLista.length)];
    this.cumple = false; // Reinicia el estado
  }

  @ViewChild('video') videoRef!: ElementRef;
  gesture = GESTURES[Math.floor(Math.random() * GESTURES.length)];
  cumple = false;

  constructor(private mpService: MediapipeService) {}

  async ngOnInit() {
    await this.mpService.init();
    const video = this.videoRef.nativeElement;
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.onloadeddata = () => {
      video.play();
      this.loop();
    };
  }

  async loop() {
    const video = this.videoRef.nativeElement;

    if (this.gesture.tipo === 'rostro') {
      const blendShapes = await this.mpService.detectFace(video);
      if (blendShapes) {
        const shape = blendShapes.find(
          (s: any) => s.categoryName === this.gesture.shape
        );
        this.cumple =
          shape &&
          'umbral' in this.gesture &&
          shape.score >= (this.gesture as any).umbral;
      }
    } else {
      const detectedGesture = await this.mpService.detectGesture(video);
      this.cumple = detectedGesture === this.gesture.shape;
    }

    requestAnimationFrame(() => this.loop());
  }

  enviar() {
    const canvas = document.createElement('canvas');
    const video = this.videoRef.nativeElement;
  
    // Configurar el tamaño del canvas según el video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
  
    // Convertir el canvas a Blob (imagen JPG)
    canvas.toBlob(async (blob) => {
      if (blob) {
        // Crear un objeto FormData
        const formData = new FormData();
        formData.append('imagen', blob, 'captura.jpg');
        formData.append('gesto', this.gesture.nombre);
        formData.append('cumple', this.cumple.toString());
        formData.append('usuario', localStorage.getItem('id') || '');
  
        try {
          // Enviar la solicitud a la API
          const response = await fetch(
            'http://localhost:3000/api/prueba/con-imagen',
            {
              method: 'POST',
              body: formData,
            }
          );
  
          if (response.ok) {
            Swal.fire({
              icon: 'success',
              title: '¡Prueba enviada!',
              text: 'Los datos se enviaron correctamente.',
              confirmButtonText: 'Aceptar',
            });
          } else {
            const errorText = await response.text();
            Swal.fire({
              icon: 'error',
              title: 'Error al enviar',
              text: `No se pudo enviar la prueba. ${errorText}`,
              confirmButtonText: 'Aceptar',
            });
          }
        } catch (error) {
          console.error('Error al enviar la solicitud:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'Ocurrió un error al intentar enviar los datos.',
            confirmButtonText: 'Aceptar',
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al generar la imagen',
          text: 'No se pudo generar la imagen para la prueba.',
          confirmButtonText: 'Aceptar',
        });
      }
    }, 'image/jpeg'); // Especificar el formato como JPEG
  }
}