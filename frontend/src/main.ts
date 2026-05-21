import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { NativeService } from './app/services/native.service';

bootstrapApplication(AppComponent, appConfig)
  .then((appRef) => {
    const native = appRef.injector.get(NativeService);
    native.init();
  })
  .catch((err) => console.error(err));
