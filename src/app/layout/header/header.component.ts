import { DOCUMENT, NgClass } from '@angular/common';
import { CommonModule } from '@angular/common';

import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConfigService } from '@config';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { InConfiguration, AuthService, LanguageService } from '@core';
import { NgScrollbar } from 'ngx-scrollbar';
import { MatMenuModule } from '@angular/material/menu';
import { FeatherIconsComponent } from '../../shared/components/feather-icons/feather-icons.component';
import { MatButtonModule } from '@angular/material/button';
import { TokenStorageService } from '@core/authentication/token-storage.service';
import { HasRolesDirective } from '../has-roles.directive';

interface Notifications {
  message: string;
  time: string;
  icon: string;
  color: string;
  status: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    FeatherIconsComponent,
    MatMenuModule,
    RouterLink,
    NgClass,
    NgScrollbar,
    HasRolesDirective,
    CommonModule,
  ],
  // providers: [LanguageService],
})
export class HeaderComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {

  public config!: InConfiguration;
  userImg?: string;
  homePage?: string;
  isNavbarCollapsed = true;
  flagvalue: string | string[] | undefined;
  countryName: string | string[] = [];
  langStoreValue?: string;
  defaultFlag?: string;
  isOpenSidebar?: boolean;
  docElement?: HTMLElement;
  isFullScreen = false;

  credencial_user: any;
  roles_user: any[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private configService: ConfigService,
    private authService: AuthService,
    private router: Router,
    protected tokenStorage: TokenStorageService
    // public languageService: LanguageService
  ) {
    super();
  }
  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
    { text: 'German', flag: 'assets/images/flags/germany.jpg', lang: 'de' },
  ];
  notifications: Notifications[] = [
    {
      message: 'Please check your mail',
      time: '14 mins ago',
      icon: 'mail',
      color: 'nfc-green',
      status: 'msg-unread',
    },
    {
      message: 'New Employee Added..',
      time: '22 mins ago',
      icon: 'person_add',
      color: 'nfc-blue',
      status: 'msg-read',
    },
    {
      message: 'Your leave is approved!! ',
      time: '3 hours ago',
      icon: 'event_available',
      color: 'nfc-orange',
      status: 'msg-read',
    },
    {
      message: 'Lets break for lunch...',
      time: '5 hours ago',
      icon: 'lunch_dining',
      color: 'nfc-blue',
      status: 'msg-read',
    },
    {
      message: 'Employee report generated',
      time: '14 mins ago',
      icon: 'description',
      color: 'nfc-green',
      status: 'msg-read',
    },
    {
      message: 'Please check your mail',
      time: '22 mins ago',
      icon: 'mail',
      color: 'nfc-red',
      status: 'msg-read',
    },
    {
      message: 'Salary credited...',
      time: '3 hours ago',
      icon: 'paid',
      color: 'nfc-purple',
      status: 'msg-read',
    },
  ];
  ngOnInit() {

    this.credencial_user = this.tokenStorage.getUser();
    this.roles_user = this.tokenStorage.getUser().roles;
    console.log("ROLES: ", this.roles_user);

    this.config = this.configService.configData;
    this.userImg = 'assets/images/user/' + this.authService.currentUserValue.img;
    this.docElement = document.documentElement;

    this.homePage = 'dashboard/dashboard1';

    this.langStoreValue = localStorage.getItem('lang') as string;
    const val = this.listLang.filter((x) => x.lang === this.langStoreValue);
    this.countryName = val.map((element) => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) {
        this.defaultFlag = 'assets/images/flags/us.jpg';
      }
    } else {
      this.flagvalue = val.map((element) => element.flag);
    }
  }

  callFullscreen() {
    if (!this.isFullScreen) {
      if (this.docElement?.requestFullscreen != null) {
        this.docElement?.requestFullscreen();
      }
    } else {
      document.exitFullscreen();
    }
    this.isFullScreen = !this.isFullScreen;
  }
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.langStoreValue = lang;
  }
  mobileMenuSidebarOpen(event: Event, className: string) {
    const hasClass = (event.target as HTMLInputElement).classList.contains(
      className
    );
    if (hasClass) {
      this.renderer.removeClass(this.document.body, className);
    } else {
      this.renderer.addClass(this.document.body, className);
    }

    const hasClass2 = this.document.body.classList.contains('side-closed');
    if (hasClass2) {
      // this.renderer.removeClass(this.document.body, "side-closed");
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    } else {
      // this.renderer.addClass(this.document.body, "side-closed");
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }
  callSidemenuCollapse() {
    const hasClass = this.document.body.classList.contains('side-closed');
    if (hasClass) {
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
      localStorage.setItem('collapsed_menu', 'false');
    } else {
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
      localStorage.setItem('collapsed_menu', 'true');
    }
  }

  cambiarRol(rol_seleccionado: any) {
    console.log("ROL SELECCIONADO: ", rol_seleccionado);

    this.credencial_user.rol = {
      id: rol_seleccionado.id,
      display_name: rol_seleccionado.display_name,
      name: rol_seleccionado.name
    };

    this.credencial_user.rol_id = rol_seleccionado.id;

    console.log("CREDENCIAL ACTUALIZADO: ", this.credencial_user);

    this.tokenStorage.saveUser(this.credencial_user);

    const user = this.tokenStorage.getUser();

    if (user) {
      this.cargarRutaRolSeleccionado(user)
    }
  }

  cargarRutaRolSeleccionado(user: any) {
    switch (user?.rol?.name) {
      case 'administrador':
        this.router.navigate(['/dashboard/dashboard1']).then(() => {
          window.location.reload();
        });
        break;
      case 'vendedor':
        this.router.navigate(['/dashboard/pedidos/listar']).then(() => {
          window.location.reload();
        });
        break;
      case 'distribuidor':
        this.router.navigate(['/dashboard/distribuciones/listar']).then(() => {
          window.location.reload();
        });
        break;
      case 'almacen':
        this.router.navigate(['/dashboard/ingresos/listar']).then(() => {
          window.location.reload();
        });
        break;
      case 'carga':
        this.router.navigate(['/dashboard/distribuciones/listar']).then(() => {
          window.location.reload();
        });
        break;
      default:
        this.tokenStorage.clear()
        this.router.navigate(['/authentication/signin']);
        break;
    }
  }

  logout() {
    this.subs.sink = this.authService.logout().subscribe((res) => {
      if (!res.success) {
        this.router.navigate(['/authentication/signin']);
      }
    });
  }
  perfil() {
    // this.subs.sink = this.authService.logout().subscribe((res) => {
    //   if (!res.success) {
    this.router.navigate(['/extra-pages/profile']);
    //   }
    // });
  }
}
