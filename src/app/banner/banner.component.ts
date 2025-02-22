import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements AfterViewInit {
  @ViewChild('bgVideo') video!: ElementRef;

  ngAfterViewInit() {
    if (this.video) {
      const videoElement = this.video.nativeElement;
      videoElement.src = './assets/banner-video.mp4';
      videoElement.load();
      videoElement.muted = true; // Assicura la riproduzione su alcuni browser
      videoElement.play().catch((err: any) => {
        console.error("Errore nella riproduzione del video:", err);
      });
    } else {
      console.error("Elemento video non trovato!");
    }
  }
}
