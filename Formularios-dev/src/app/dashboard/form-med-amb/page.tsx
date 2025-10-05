// app/inspecciones/llenar/page.tsx
"use client";

import { FormFiller } from '@/components/herra_equipos/FormRenderer';
import { getTemplatesHerraEquipos } from '@/lib/actions/template-herra-equipos';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button, CircularProgress, Alert, Grid } from '@mui/material';

interface FormTemplate {
  _id: string;
  name: string;
  code: string;
  revision: string;
  type: "interna" | "externa";
  verificationFields: any[];
  sections: any[];
  createdAt: Date;
  updatedAt: Date;
}

export default function Page() {
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    setError(null);
    
    const result = await getTemplatesHerraEquipos();
    
    if (result.success) {
      const templatesWithDates = result.data.map((template) => ({
        ...template,
        createdAt: new Date(template.createdAt),
        updatedAt: new Date(template.updatedAt),
      }));
      setTemplates(templatesWithDates);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleSave = (data: any) => {
    console.log("Borrador guardado:", data);
    // Aquí implementarás la lógica para guardar en el backend
  };

  const handleSubmit = (data: any) => {
    console.log("Formulario enviado:", data);
    // Aquí implementarás la lógica para enviar al backend
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Box>
    );
  }

  // Si hay un template seleccionado, mostrar el formulario
  if (selectedTemplate) {
    return (
      <Box>
        <Button
          variant="outlined"
          onClick={() => setSelectedTemplate(null)}
          sx={{ m: 2 }}
        >
          ← Volver a la lista
        </Button>
        <FormFiller
          template={selectedTemplate}
          onSave={handleSave}
          onSubmit={handleSubmit}
        />
      </Box>
    );
  }

  // Mostrar lista de templates para seleccionar
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Formularios de Inspección - Herramientas y Equipos
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Selecciona un template para comenzar una nueva inspección
      </Typography>

      {templates.length === 0 ? (
        <Alert severity="info">
          No hay templates disponibles. Primero debes crear templates en la gestión de templates.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {templates.map((template) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={template._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {template.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Código:</strong> {template.code}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Revisión:</strong> {template.revision}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Tipo:</strong> {template.type === 'interna' ? 'Inspección Interna' : 'Inspección Externa'}
                  </Typography>
                </CardContent>
                <Box p={2} pt={0}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => setSelectedTemplate(template)}
                  >
                    Llenar Formulario
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
