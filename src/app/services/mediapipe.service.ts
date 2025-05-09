import { Injectable } from '@angular/core';
import {
  FaceLandmarker,
  GestureRecognizer,
  FilesetResolver
} from '@mediapipe/tasks-vision';

@Injectable({ providedIn: 'root' })
export class MediapipeService {
  private faceLandmarker: any;
  private gestureRecognizer: any;
  private runningMode: 'IMAGE' | 'VIDEO' = 'VIDEO';

  async init() {
    const filesetResolver = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
    );

    this.faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        delegate: 'GPU'
      },
      outputFaceBlendshapes: true,
      runningMode: this.runningMode,
      numFaces: 1
    });

    this.gestureRecognizer = await GestureRecognizer.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
        delegate: 'GPU'
      },
      runningMode: this.runningMode
    });
  }

  async detectFace(video: HTMLVideoElement) {
    if (!this.faceLandmarker) return null;
    const results = await this.faceLandmarker.detectForVideo(video, performance.now());
    return results?.faceBlendshapes?.[0]?.categories || [];
  }

  async detectGesture(video: HTMLVideoElement) {
    if (!this.gestureRecognizer) return null;
    const results = await this.gestureRecognizer.recognizeForVideo(video, performance.now());
    return results?.gestures?.[0]?.[0]?.categoryName || '';
  }
}