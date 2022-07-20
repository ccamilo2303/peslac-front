import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
 
  {
    name: 'Opciones',
    title: true
  },
  {
    name: 'Usuarios',
    url: '/home/user',
    iconComponent: { name: 'cil-people' },
  },
  {
    name: 'Productos',
    url: '/home/product',
    iconComponent: { name: 'cil-layers' },
  },
  {
    name: 'Proveedores',
    url: '/home/proveedores',
    iconComponent: { name: 'cil-layers' },
  },
  {
    name: 'Clientes y Estaciones',
    url: '/home/clientes',
    iconComponent: { name: 'cil-puzzle' },
  },
  {
    name: 'Inventario',
    url: '/home/inventario',
    iconComponent: { name: 'cil-layers' },
  },
  {
    name: 'Ventas',
    url: '/home/ventas',
    iconComponent: { name: 'cil-puzzle' },
  },
  {
    name: 'Historial de Ventas',
    url: '/home/historial/ventas',
    iconComponent: { name: 'cil-puzzle' },
  },
  {
    name: 'Compras',
    url: '/home/compras',
    iconComponent: { name: 'cil-puzzle' },
  },
  {
    name: 'Historial de Compras',
    url: '/home/historial/compras',
    iconComponent: { name: 'cil-puzzle' },
  },
  {
    name: 'Remisiones',
    url: '/home/remisiones',
    iconComponent: { name: 'cil-puzzle' },
  },
  {
    name: 'Transformación',
    url: '/home/transformacion',
    iconComponent: { name: 'cil-puzzle' },
  },
  {
    name: 'Devoluciones',
    url: '/home/devoluciones',
    iconComponent: { name: 'cil-puzzle' },
  },
  {
    name: 'Empaques y dotaciones',
    url: '/home/empaques-dotaciones',
    iconComponent: { name: 'cil-puzzle' },
  },
  {
    name: 'Estadística',
    url: '/home/estadistica',
    iconComponent: { name: 'cil-puzzle' },
  },
  /*{
    name: 'Buttons',
    url: '/home/buttons',
    iconComponent: { name: 'cil-cursor' },
    children: [
      {
        name: 'Buttons',
        url: '/home/buttons/buttons'
      },
      {
        name: 'Button groups',
        url: '/home/buttons/button-groups'
      },
      {
        name: 'Dropdowns',
        url: '/home/buttons/dropdowns'
      },
    ]
  },*/
 
];
