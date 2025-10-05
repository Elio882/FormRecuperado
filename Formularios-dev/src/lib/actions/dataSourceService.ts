"use server"
export type DataSourceType = 
  | "area" 
  | "superintendencia" 
  | "trabajador" 
  | "gerencia" 
  | "cargo" 
  | "equipo";

// Simulación de datos - reemplaza con llamadas reales a tu API
const MOCK_DATA_SOURCES: Record<DataSourceType, string[]> = {
  area: ['Producción', 'Mantenimiento', 'Seguridad', 'Administración', 'Logística'],
  superintendencia: ['Superintendencia Operaciones', 'Superintendencia Mantto', 'Superintendencia SSOMA'],
  trabajador: ['probando1','probando 2', 'probando 3', 'probando 4', 'probando 5'], // Se cargará dinámicamente desde BD
  gerencia: ['Gerencia General', 'Gerencia Operaciones', 'Gerencia Administración'],
  cargo: ['Operador', 'Supervisor', 'Jefe de Area', 'Gerente', 'Técnico'],
  equipo: ['Excavadora CAT-001', 'Camión Volvo-002', 'Grúa Liebherr-003']
};

export const fetchDataBySource = async (dataSource: DataSourceType): Promise<string[]> => {
  // Simula delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Aquí deberías hacer la llamada real a tu API
  // Por ejemplo: return await fetch(`/api/data-sources/${dataSource}`).then(r => r.json());
  
  return MOCK_DATA_SOURCES[dataSource] || [];
};