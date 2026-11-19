export interface ProductoAnalisis {
  id: number;
  nombre: string;
  unidades_vendidas: number;
  ventas_bs: number;
  mes_mayor_venta: number | null;
  stock: number;
  pronostico_30: number;
  modelo_30: number;
  referencia_30: number;
  sugerencia_compra: number;
  historial_mensual: { mes: string; unidades: number }[];
}
export interface ClienteAnalisis {
  id: number;
  nombre: string;
  probabilidad: number;
  nivel: string;
  dias_sin_compra: number;
  pedidos_30: number;
  intervalo_dias: number;
  producto_preferido: string;
  proxima_compra_dias?: number | null;
  proxima_compra_fecha?: string | null;
  estimacion_disponible?: boolean;
  motivo_estimacion?: string;
}
export interface ReporteAnalisis {
  entrenado_en: string;
  fuente: string;
  datos_simulados: boolean;
  desde: string;
  hasta: string;
  pronostico_desde: string;
  pronostico_hasta: string;
  corte_entrenamiento: string;
  resumen: { productos: number; clientes: number; pedidos: number; ventas_bs: number };
  demanda: {
    algoritmo: string;
    metodo_utilizado: string;
    mae_modelo: number;
    mae_referencia: number;
    modelo_supera_referencia: boolean;
    variables: string[];
  };
  recompra: {
    algoritmo: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    f1_referencia: number;
    f1_macro: number;
    f1_macro_referencia: number;
    muestras_entrenamiento: number;
    muestras_prueba: number;
    positivos_prueba: number;
    negativos_prueba: number;
  };
  productos_cliente?: {
    disponible: boolean;
    f1_macro: number | null;
    f1_macro_referencia: number | null;
    muestras_entrenamiento: number;
    muestras_prueba: number;
  };
  tiempo_recompra?: {
    disponible: boolean;
    mae_dias: number | null;
    mae_referencia_dias: number | null;
    modelo_supera_referencia: boolean | null;
    muestras_entrenamiento: number;
    muestras_prueba: number;
    casos_sin_fecha_observada: number;
  };
  mensual: { mes: string; ventas_bs: number; pedidos: number }[];
  productos: ProductoAnalisis[];
  clientes: ClienteAnalisis[];
  notas: string[];
}

export interface ProductoCliente {
  suministro_id: number;
  nombre: string;
  probabilidad_producto: number | null;
  cantidad_habitual: number;
  unidades_historicas: number;
  fechas_compra: number;
  ultima_compra: string;
  precio: number;
  stock_disponible: number;
  habilitado: boolean;
}
export interface PedidoGenerado {
  id: number;
  fecha: string;
  estado: string;
  total: number;
  tipo_pago_id: number;
  observacion: string;
  editable: boolean;
  detalle: { suministro_id: number; cantidad: number; precio: number }[];
}
export interface ConsultaCliente {
  cliente: { id: number; razon_social: string; contacto: string; sucursal_id: number };
  analisis: ClienteAnalisis;
  productos: ProductoCliente[];
  tipo_pagos: { id: number; nombre: string; descuento: number }[];
  pedidos: PedidoGenerado[];
  referencia: string;
  mensaje?: string;
}
export interface GuardarPedidoPredictivo {
  clave: string;
  referencia: string;
  tipo_pago_id: number;
  observacion: string;
  detalle: { suministro_id: number; cantidad: number }[];
}
