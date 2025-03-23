import api from "../lib/axios";
import type { FormData, InspeccionServiceExport, Trabajador } from "../types/formTypes";
import type { FormDataExport } from "../types/formTypes";

import type { VerificarTagData, FormularioInspeccion, DatosMes, Mes } from "../types/formTypes";

export const inspeccionService = {
  async crear(data: FormData) {
    const response = await api.post<FormData>("/inspecciones", data);
    return response.data;
  },
  async obtenerPorId(id: string): Promise<FormData> {
    const response = await api.get<FormData>(`/inspecciones/${id}`);
    return response.data;
  },

  async obtenerTodas() {
    const response = await api.get<FormDataExport[]>("/inspecciones")
    return response.data
  },

  async listar(page = 1, limit = 10) {
    const response = await api.get(`/inspecciones?page=${page}&limit=${limit}`)
    return response.data
  },

  async actualizar(id: string, data: FormData): Promise<FormDataExport> {
    const response = await api.put<FormDataExport>(`/inspecciones/${id}`, data)
    return response.data
  },

  async eliminar(id: string) {
    await api.delete(`/inspecciones/${id}`)
  },

  async descargarPdf(id: string) {
    try {
      const response = await api.get(`/inspecciones/${id}/pdf`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `inspeccion-${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el PDF:", error);
      throw error;
    }
  },

  async descargarExcel(id: string) {
    try {
      const response = await api.get(`/inspecciones/${id}/excel`, {
        responseType: "blob",
      })
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `inspeccion-${id}.xlsx`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error al descargar el Excel:", error)
      throw error
    }
  },


  verificarTag: async (datos: VerificarTagData) => {
    try {
      const response = await api.post(`/inspecciones-emergencia/verificar-tag`, datos);
      return response.data; // Asume que el backend devuelve { existe: true/false, formulario: {} }
    } catch (error) {
      throw error;
    }
  },

  // Crear un nuevo formulario
  crearFormSistemasEmergencia: async (data: FormularioInspeccion) => {
    try {
      const response = await api.post(`/inspecciones-emergencia/crear-formulario`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar un mes específico en un formulario existente
  actualizarMesPorTag: async (tag: string, mes: Mes, datosMes: DatosMes) => {
    try {
      const response = await api.put(`/inspecciones-emergencia/actualizar-mes/${tag}`, {
        mes,
        datosMes,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //para devolver todas de las inspecciones de sistemas de emergencia 

  async sistemasEmergenciaReport() {
    const response = await api.get<InspeccionServiceExport[]>("/inspecciones-emergencia")
    return response.data
  },

  // Buscar trabajadores por nombre
  async buscarTrabajadores(query: string): Promise<Trabajador[]> {
    const response = await api.get<Trabajador[]>("/trabajadores/buscar", {
      params: { query },
    });
    return response.data;
  },

  async descargarExcelInspeccionesEmergencia(id: string) {
    try {
      const response = await api.get(`/inspecciones-emergencia/${id}/excel`, {
        responseType: "blob",
      })
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `inspeccion-${id}.xlsx`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error al descargar el Excel:", error)
      throw error
    }
  },
  async buscarAreas(query: string): Promise<string[]> {
    try {
      const response = await api.get<string[]>("/area/buscar", {
        params: { query },
      });
      return response.data;
    } catch (error) {
      console.error("Error al buscar áreas:", error);
      throw error;
    }
  },


  async obtenerAreas(): Promise<string[]> {
    try {
      const response = await api.get<string[]>("/area");
      return response.data;
    } catch (error) {
      console.error("Error al obtener áreas:", error);
      throw error;
    }
  },

  
};
