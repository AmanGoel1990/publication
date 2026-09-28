import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
  input,
} from '@angular/core';

@Component({
  selector: 'app-pdf-cover',
  template: '<canvas #coverCanvas [attr.aria-label]="title() + \' cover page\'"></canvas>',
  styleUrl: './pdf-cover.css',
})
export class PdfCover implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('coverCanvas') private canvasRef?: ElementRef<HTMLCanvasElement>;

  readonly pdfUrl = input.required<string>();
  readonly title = input('Book');
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private viewReady = false;
  private renderVersion = 0;
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.isBrowser && this.canvasRef) {
      this.resizeObserver = new ResizeObserver(() => void this.renderCover());
      this.resizeObserver.observe(this.canvasRef.nativeElement.parentElement ?? this.canvasRef.nativeElement);
    }
    void this.renderCover();
  }

  ngOnChanges(): void {
    if (this.viewReady) {
      void this.renderCover();
    }
  }

  ngOnDestroy(): void {
    this.renderVersion++;
    this.resizeObserver?.disconnect();
  }

  private async renderCover(): Promise<void> {
    const canvas = this.canvasRef?.nativeElement;
    if (!this.isBrowser || !canvas || !this.pdfUrl()) {
      return;
    }

    const renderVersion = ++this.renderVersion;
    const frame = canvas.parentElement;
    const frameWidth = frame?.clientWidth ?? 0;
    const frameHeight = frame?.clientHeight ?? 0;
    if (!frameWidth || !frameHeight) {
      return;
    }

    try {
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = '/assets/pdfjs/pdf.worker.min.mjs';
      const loadingTask = pdfjs.getDocument({ url: this.pdfUrl() });
      try {
        const document = await loadingTask.promise;
        const page = await document.getPage(1);
        if (renderVersion !== this.renderVersion) {
          return;
        }

        const pageViewport = page.getViewport({ scale: 1 });
        const fitScale = Math.min(frameWidth / pageViewport.width, frameHeight / pageViewport.height);
        const pixelScale = fitScale * Math.min(window.devicePixelRatio || 1, 2);
        const viewport = page.getViewport({ scale: pixelScale });

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        canvas.style.width = `${pageViewport.width * fitScale}px`;
        canvas.style.height = `${pageViewport.height * fitScale}px`;

        const context = canvas.getContext('2d');
        if (context) {
          await page.render({ canvas, canvasContext: context, viewport }).promise;
        }
      } finally {
        await loadingTask.destroy();
      }
    } catch {
      canvas.width = 0;
      canvas.height = 0;
    }
  }
}