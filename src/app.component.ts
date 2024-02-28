import { ElementRef, NgModule, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ImageEditorModule } from '@syncfusion/ej2-angular-image-editor';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
/**
 * Default Sample
 */
import { Component } from '@angular/core';
import { Browser, getComponent } from '@syncfusion/ej2-base';
import { ImageEditorComponent } from '@syncfusion/ej2-angular-image-editor';

@Component({
  standalone: true,
  imports: [DialogModule, CommonModule, ImageEditorModule],
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent {
  public created = (): void => {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const imageEditor: any = getComponent(
      document.getElementById('image-editor'),
      'image-editor'
    );
    if (Browser.isDevice) {
      imageEditor.open('./assets/image-editor/images/flower.png');
    } else {
      imageEditor.open('./assets/image-editor/images/default.png');
    }
    if (imageEditor.theme && window.location.href.split('#')[1]) {
      imageEditor.theme = window.location.href.split('#')[1].split('/')[1];
    }
    // console.log(imageEditor.getImageData());
  };

  @ViewChild('camera') cameraInput: Element;
  public pic: any = 'test';
  // public myInput = document.getElementById('camera');

  ngOnInit() {
    if (document.getElementById('right-pane')) {
      document
        .getElementById('right-pane')
        .addEventListener('scroll', this.onScroll.bind(this));
    }
  }

  ngAfterViewInit() {
    var myInput = document.getElementById('camera');
    myInput.addEventListener('change', (e: any) => {
      console.log(e.target.files);
      const imageEditor: any = getComponent(
        document.getElementById('image-editor'),
        'image-editor'
      );
      imageEditor.open(URL.createObjectURL(e.target.files[0]));
      const file = e.target.files[0];
      this.encodeFileToBase64(file, async (base64String) => {
        const prefixIndex = base64String.indexOf(',') + 1;
        const imageData = base64String.substring(prefixIndex);
        console.log(file.name + ': data: ' + imageData);
      });
    });
  }

  // Handler used to reposition the tooltip on page scroll
  onScroll(): void {
    if (document.getElementById('image-editor_sliderWrapper')) {
      let slider: any = getComponent(
        document.getElementById('image-editor_sliderWrapper'),
        'slider'
      );
      slider.refreshTooltip(slider.tooltipTarget);
    }
  }

  encodeFileToBase64(file: File, callback: (result: string) => void) {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  }

  setPic(event) {
    console.log(event);
    event.cancel = true;
    const imageEditor: any = getComponent(
      document.getElementById('image-editor'),
      'image-editor'
    );
    // console.log(imageEditor.getImageData());
    const img: ImageData = imageEditor.getImageData();
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext('2d');
    ctx.putImageData(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL('image/png');
    const imgFile = this.dataURLtoFile(dataURL, 'testFileName');
    console.log(imgFile);
    this.encodeFileToBase64(imgFile, async (base64String) => {
      const prefixIndex = base64String.indexOf(',') + 1;
      const imageData = base64String.substring(prefixIndex);
      console.log(imgFile.name + ': data: ' + imageData);
    });
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
}
