import { Component } from '@angular/core';
import { LogService } from './services/log.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  
  constructor(private logger: LogService) {  }

  logMsg() {
    this.logger.error('Log the first msg', 'Eftakhar', 'Ali' , 1, 2);
  }
}
