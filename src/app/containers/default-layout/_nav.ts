import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
 
  {
    name: 'Opciones',
    title: true
  },
  {
    name: 'Usuarios',
    url: '/user',
    iconComponent: { name: 'cil-user' },
  },
  {
    name: 'Productos',
    url: '/product',
    iconComponent: { name: 'cil-puzzle' },
  },
  {
    name: 'Proveedores',
    url: '/proveedores',
    iconComponent: { name: 'cil-puzzle' },
  },
  {
    name: 'Clientes y Estaciones',
    url: '/clientes',
    iconComponent: { name: 'cil-puzzle' },
  },
  {
    name: 'Inventarios',
    url: '/product',
    iconComponent: { name: 'cil-puzzle' },
  },
  {
    name: 'Ventas',
    url: '/product',
    iconComponent: { name: 'cil-puzzle' },
  },
  {
    name: 'Historial de Ventas',
    url: '/product',
    iconComponent: { name: 'cil-puzzle' },
  },
  {
    name: 'Compras',
    url: '/product',
    iconComponent: { name: 'cil-puzzle' },
  },
  {
    name: 'Historial de Compras',
    url: '/product',
    iconComponent: { name: 'cil-puzzle' },
  },
  {
    name: 'Remisiones',
    url: '/product',
    iconComponent: { name: 'cil-puzzle' },
  },
  {
    name: 'Transformación',
    url: '/product',
    iconComponent: { name: 'cil-puzzle' },
  },
  {
    name: 'Devoluciones',
    url: '/product',
    iconComponent: { name: 'cil-puzzle' },
  },
  {
    name: 'Empaques y dotaciones',
    url: '/product',
    iconComponent: { name: 'cil-puzzle' },
  },
  {
    name: 'Estadística',
    url: '/product',
    iconComponent: { name: 'cil-puzzle' },
  },
  /*{
    name: 'Buttons',
    url: '/buttons',
    iconComponent: { name: 'cil-cursor' },
    children: [
      {
        name: 'Buttons',
        url: '/buttons/buttons'
      },
      {
        name: 'Button groups',
        url: '/buttons/button-groups'
      },
      {
        name: 'Dropdowns',
        url: '/buttons/dropdowns'
      },
    ]
  },*/
 
];
