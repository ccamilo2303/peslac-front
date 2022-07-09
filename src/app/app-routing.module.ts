import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { Page404Component } from './views/pages/page404/page404.component';
import { Page500Component } from './views/pages/page500/page500.component';
import { LoginComponent } from './views/pages/login/login.component';
import { RegisterComponent } from './views/pages/register/register.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'theme',
        loadChildren: () =>
          import('./views/theme/theme.module').then((m) => m.ThemeModule)
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./views/user/user.module').then((m) => m.UserModule)
      },
      {
        path: 'product',
        loadChildren: () =>
          import('./views/products/product.module').then((m) => m.ProductModule)
      },
      {
        path: 'proveedores',
        loadChildren: () =>
          import('./views/proveedores/proveedores.module').then((m) => m.ProveedoresModule)
      },
      {
        path: 'clientes',
        loadChildren: () =>
        import('./views/clientes/clientes.module').then((m) => m.ClientesModule)
      },
      {
        path: 'inventario',
        loadChildren: () =>
        import('./views/inventario/inventario.module').then((m) => m.InventarioModule)
      },
      {
        path: 'historial/ventas',
        loadChildren: () =>
        import('./views/historial-ventas/historial-ventas.module').then((m) => m.HistorialVentasModule)
      },
      {
        path: 'historial/ventas/anulados',
        loadChildren: () =>
        import('./views/historial-ventas/components/historial-anulados/historial-anulados.module').then((m) => m.HistorialAnuladosModule)
      },
      {
        path: 'historial/ventas/informe',
        loadChildren: () =>
        import('./views/historial-ventas/components/informe-ventas/informe-ventas.module').then((m) => m.InformeVentasModule)
      },
      {
        path: 'historial/compras',
        loadChildren: () =>
        import('./views/historial-compras/historial-compras.module').then((m) => m.HistorialComprasModule)
      },
      {
        path: 'remisiones',
        loadChildren: () =>
        import('./views/historial-compras/historial-compras.module').then((m) => m.HistorialComprasModule)
      },
      {
        path: 'transformacion',
        loadChildren: () =>
        import('./views/transformacion/transformacion.module').then((m) => m.TransformacionModule)
      },
      {
        path: 'buttons',
        loadChildren: () =>
          import('./views/buttons/buttons.module').then((m) => m.ButtonsModule)
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./views/forms/forms.module').then((m) => m.CoreUIFormsModule)
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./views/charts/charts.module').then((m) => m.ChartsModule)
      },
      {
        path: 'icons',
        loadChildren: () =>
          import('./views/icons/icons.module').then((m) => m.IconsModule)
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./views/notifications/notifications.module').then((m) => m.NotificationsModule)
      },
      {
        path: 'widgets',
        loadChildren: () =>
          import('./views/widgets/widgets.module').then((m) => m.WidgetsModule)
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./views/pages/pages.module').then((m) => m.PagesModule)
      },
    ]
  },
  {
    path: '404',
    component: Page404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: Page500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {path: '**', redirectTo: 'dashboard'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking'
      // relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
