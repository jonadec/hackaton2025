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
  selector: 'app-gesture',
  imports: [CommonModule],
  templateUrl: './gesture.component.html',
  styleUrl: './gesture.component.css'
})
export class GestureComponent implements OnInit {
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
}