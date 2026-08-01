import { Component } from '@angular/core';
import { Logo } from './logo/logo';
import { Links } from './links/links';

@Component({
  selector: 'app-header',
  imports: [
      Logo, 
      Links 
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

}
