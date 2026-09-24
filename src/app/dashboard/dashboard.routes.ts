import { Route } from "@angular/router";
import { RoleGuard } from "@core/guard/role.guard";
import { Page404Component } from "../authentication/page404/page404.component";
import { Dashboard1Component } from "./dashboard1/dashboard1.component";
import { Dashboard2Component } from "./dashboard2/dashboard2.component";
import { Page403Component } from "./page403/page403.component";

export const DASHBOARD_ROUTE: Route[] = [
  {
    path: "",
    redirectTo: "dashboard1",
    pathMatch: "full",
  },
  {
    path: "dashboard1",
    component: Dashboard1Component,
    canActivate: [RoleGuard],
    data: { roles: ['administrador'] }
  },
  {
    path: "dashboard2",
    component: Dashboard2Component,
  },
  { path: 'usuarios',
    loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule),
    canActivate: [RoleGuard],
    data: { roles: ['administrador'] }
  },
  {
    path: 'movilidades',
    loadChildren: () => import('./movilidades/movilidades.module').then(m => m.MovilidadesModule),
    canActivate: [RoleGuard],
    data: { roles: ['administrador'] }
  },
  {
    path: 'distribuidores',
    loadChildren: () => import('./distribuidores/distribuidores.module').then(m => m.DistribuidoresModule),
    canActivate: [RoleGuard],
    data: { roles: ['administrador'] }
  },
  {
    path: 'categorias',
    loadChildren: () => import('./categorias/categorias.module').then(m => m.CategoriasModule),
    canActivate: [RoleGuard],
    data: { roles: ['administrador', 'almacen'] }
  },
  {
    path: 'proveedores',
    loadChildren: () => import('./proveedores/proveedores.module').then(m => m.ProveedoresModule),
    canActivate: [RoleGuard],
    data: { roles: ['administrador', 'almacen'] }
  },
  {
    path: 'suministros',
    loadChildren: () => import('./suministros/suministros.module').then(m => m.SuministrosModule),
    canActivate: [RoleGuard],
    data: { roles: ['administrador', 'almacen'] }
  },
  {
    path: 'tipo-pagos',
    loadChildren: () => import('./tipo-pagos/tipo-pagos.module').then(m => m.TipoPagosModule),
    canActivate: [RoleGuard],
    data: { roles: ['administrador'] }
  },
  {
    path: 'ingresos',
    loadChildren: () => import('./ingresos/ingresos.module').then(m => m.IngresosModule),
    canActivate: [RoleGuard],
    data: { roles: ['administrador', 'almacen'] }
  },{
    path: 'clientes',
    loadChildren: () => import('./clientes/clientes.module').then(m => m.ClientesModule),
    canActivate: [RoleGuard],
    data: { roles: ['administrador', 'vendedor'] }
  },
  {
    path: 'pedidos',
    loadChildren: () => import('./pedidos/pedidos.module').then(m => m.PedidosModule),
    canActivate: [RoleGuard],
    data: { roles: ['administrador', 'vendedor', 'distribuidor', 'almacen'] }
  },
  {
    path: 'distribuciones',
    loadChildren: () => import('./distribuciones/distribuciones.module').then(m => m.DistribucionesModule),
    canActivate: [RoleGuard],
    data: { roles: ['administrador', 'distribuidor', 'almacen'] }
  },
  {
    path: 'pagos',
    loadChildren: () => import('./pagos/pagos.module').then(m => m.PagosModule),
    canActivate: [RoleGuard],
    data: { roles: ['administrador', 'vendedor', 'distribuidor'] }
  },
  {
    path: 'reportes',
    loadChildren: () => import('./reportes/reportes.module').then(m => m.ReportesModule),
    canActivate: [RoleGuard],
    data: { roles: ['administrador', 'almacen', 'distribuidor'] }
  },
  {
    path: '403',
    component: Page403Component
  },
  { path: "**", component: Page404Component },
];

