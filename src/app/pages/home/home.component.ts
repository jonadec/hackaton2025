import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, NgModule } from '@angular/core';
import { MediapipeService } from 'app/services/mediapipe.service';

const FACE_GESTURES = [
  { tipo: 'rostro', nombre: 'Sonríe', shape: 'mouthSmileLeft', umbral: 0.4 },
  { tipo: 'rostro', nombre: 'Levanta las cejas', shape: 'browOuterUpLeft', umbral: 0.5 },
  { tipo: 'rostro', nombre: 'Frunce el ceño', shape: 'browDownLeft', umbral: 0.5 },
  { tipo: 'rostro', nombre: 'Cierra el ojo izquierdo', shape: 'eyeBlinkLeft', umbral: 0.5 },
  { tipo: 'rostro', nombre: 'Cierra el ojo derecho', shape: 'eyeBlinkRight', umbral: 0.5 },
  { tipo: 'rostro', nombre: 'Abre la boca', shape: 'jawOpen', umbral: 0.5 }
];

const HAND_GESTURES = [
  { tipo: 'mano', nombre: 'Haz un pulgar arriba', shape: 'Thumb_Up' },
  { tipo: 'mano', nombre: 'Haz la seña de victoria', shape: 'Victory' },
  { tipo: 'mano', nombre: 'Haz la palma abierta', shape: 'Open_Palm' },
  { tipo: 'mano', nombre: 'Haz el signo del rock 🤟', shape: 'ILoveYou' }

];

const GESTURES = [...FACE_GESTURES, ...HAND_GESTURES];

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  cambiarGesto() {
    const nuevaLista = GESTURES.filter(g => g.shape !== this.gesture.shape);
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
        const shape = blendShapes.find((s: any) => s.categoryName === this.gesture.shape);
        this.cumple = shape && 'umbral' in this.gesture && shape.score >= (this.gesture as any).umbral;

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
            // Descargar la imagen para depuración
            const downloadLink = document.createElement('a');
            const imageUrl = URL.createObjectURL(blob);
            downloadLink.href = imageUrl;
            downloadLink.download = 'captura.jpg';
            downloadLink.click();
            URL.revokeObjectURL(imageUrl); // Liberar memoria

            // Crear un objeto FormData
            const formData = new FormData();
            formData.append('imagen', blob, 'captura.jpg');
            formData.append('gesto', this.gesture.nombre);
            formData.append('cumple', this.cumple.toString());

            try {
                // Enviar la solicitud a la API
                const response = await fetch('http://175.1.63.253:3000/api/pruebas/con-imagen', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    alert('Datos enviados correctamente.');
                } else {
                    alert('Error al enviar los datos.');
                }
            } catch (error) {
                console.error('Error al enviar la solicitud:', error);
                alert('Error al enviar los datos.');
            }
        } else {
            alert('Error al generar la imagen.');
        }
    }, 'image/jpeg'); // Especificar el formato como JPEG
}
}


