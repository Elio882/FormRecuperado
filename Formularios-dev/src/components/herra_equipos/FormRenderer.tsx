// components/form-filler/FormFiller.tsx
"use client";

import React, { useState } from "react";
import { useForm, Controller, FieldErrors, Control, FieldPath } from "react-hook-form";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Alert,
  Grid,
  Paper,
  Chip,
  FormHelperText,
} from "@mui/material";
import {
  ExpandMore,
  Save,
  Send,
  CheckCircle,
} from "@mui/icons-material";
import AutocompleteCustom from "../molecules/autocomplete-custom/AutocompleteCustom";
import { DataSourceType } from "@/lib/actions/dataSourceService";

// ==================== TIPOS ====================
interface ResponseOption {
  label: string;
  value: string | number | boolean;
  color?: string;
}

interface ResponseConfig {
  type: string;
  options?: ResponseOption[];
  placeholder?: string;
  min?: number;
  max?: number;
}

interface Question {
  _id?: string;
  text: string;
  obligatorio: boolean;
  responseConfig: ResponseConfig;
  order?: number;
  image?: {
    url: string;
    caption: string;
  };
}

interface SectionImage {
  _id?: string;
  url: string;
  caption: string;
  order?: number;
}

interface Section {
  _id?: string;
  title: string;
  description?: string;
  images?: SectionImage[];
  questions: Question[];
  order?: number;
  isParent?: boolean;
  parentId?: string | null;
  subsections?: Section[];
}

interface VerificationField {
  label: string;
  type: string;
  options?: string[];
  dataSource?: string;
}

interface FormTemplate {
  _id: string;
  name: string;
  code: string;
  revision: string;
  type: "interna" | "externa";
  verificationFields: VerificationField[];
  sections: Section[];
  createdAt: Date;
  updatedAt: Date;
}

interface QuestionResponse {
  value: string | number | boolean;
  observacion?: string;
}
// Cambio clave: usar [key: string] para permitir rutas dinámicas
interface FormData {
  verification: Record<string, string | number>;
  responses: Record<string, Record<string, QuestionResponse>>; // Cambio aquí
}

interface FormResponse {
  templateId: string;
  verificationData: Record<string, string | number>;
  responses: Record<string, Record<string, QuestionResponse>>; // Cambio aquí
  submittedAt: Date;
  status: "draft" | "completed";
}

// Helper mejorado para obtener errores anidados
const getNestedError = (
  errors: FieldErrors<FormData>,
  path: string
): { message?: string } | undefined => {
  const parts = path.split(".");
  let current: unknown = errors;

  for (const part of parts) {
    if (!current || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }

  return current as { message?: string } | undefined;
};

// ==================== COMPONENTES ====================

interface QuestionRendererProps {
  question: Question;
  sectionPath: string;
  questionIndex: number;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  sectionPath,
  questionIndex,
  control,
  errors,
}) => {
  // Usar FieldPath genérico para rutas dinámicas
  const fieldName = `${sectionPath}.q${questionIndex}` as FieldPath<FormData>;
  const error = getNestedError(errors, fieldName);

  const renderInput = () => {
    const { type, options, placeholder, min, max } = question.responseConfig;
    const observacionFieldName = `${sectionPath}.q${questionIndex}.observacion` as FieldPath<FormData>;
    const observacionError = getNestedError(errors, observacionFieldName);
    const error = getNestedError(errors, fieldName);

    switch (type) {
      case "si_no_na":
        return (
        <>
          <Controller
            name={fieldName}
            control={control}
            rules={{ required: question.obligatorio ? "Este campo es obligatorio" : false }}
            render={({ field }) => (
              <FormControl error={!!error} fullWidth>
                <RadioGroup 
                  value={field.value || ""} 
                  onChange={field.onChange}
                  row
                >
                  {options?.map((option) => (
                    <FormControlLabel
                      key={String(option.value)}
                      value={option.value}
                      control={<Radio />}
                      label={
                        <Chip
                          label={option.label}
                          size="small"
                          sx={{
                            backgroundColor: option.color || "default",
                            color: "white",
                          }}
                        />
                      }
                    />
                  ))}
                </RadioGroup>
                {error && <FormHelperText>{error.message}</FormHelperText>}
              </FormControl>
            )}
          />

          <Box mt={2}>
              <Controller
                name={observacionFieldName}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value || ""}
                    fullWidth
                    size="small"
                    label="Observaciones (opcional)"
                    placeholder="Ingrese observaciones adicionales..."
                    multiline
                    rows={2}
                    error={!!observacionError}
                    helperText={observacionError?.message}
                  />
                )}
              />
            </Box>
          </>
        );

      case "text":
        return (
          <>
            <Controller
              name={fieldName}
              control={control}
              rules={{ required: question.obligatorio ? "Este campo es obligatorio" : false }}
              render={({ field }) => (
                <TextField
                  value={field.value || ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  fullWidth
                  size="small"
                  placeholder={placeholder || "Ingrese su respuesta"}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Box mt={2}>
              <Controller
                name={observacionFieldName}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value || ""}
                    fullWidth
                    size="small"
                    label="Observaciones (opcional)"
                    placeholder="Ingrese observaciones adicionales..."
                    multiline
                    rows={2}
                  />
                )}
              />
            </Box>
          </>
        );

      case "textarea":
        return (
          <>
            <Controller
              name={fieldName}
              control={control}
              rules={{ required: question.obligatorio ? "Este campo es obligatorio" : false }}
              render={({ field }) => (
                <TextField
                  value={field.value || ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  fullWidth
                  multiline
                  rows={4}
                  size="small"
                  placeholder={placeholder || "Ingrese su respuesta"}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Box mt={2}>
              <Controller
                name={observacionFieldName}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value || ""}
                    fullWidth
                    size="small"
                    label="Observaciones adicionales (opcional)"
                    placeholder="Ingrese observaciones complementarias..."
                    multiline
                    rows={2}
                  />
                )}
              />
            </Box>
          </>
        );

      case "number":
        return (
          <>
            <Controller
              name={fieldName}
              control={control}
              rules={{
                required: question.obligatorio ? "Este campo es obligatorio" : false,
                min: min ? { value: min, message: `Mínimo: ${min}` } : undefined,
                max: max ? { value: max, message: `Máximo: ${max}` } : undefined,
              }}
              render={({ field }) => (
                <TextField
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
                  onBlur={field.onBlur}
                  type="number"
                  size="small"
                  placeholder={placeholder || "0"}
                  inputProps={{ min, max }}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Box mt={2}>
              <Controller
                name={observacionFieldName}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value || ""}
                    fullWidth
                    size="small"
                    label="Observaciones (opcional)"
                    placeholder="Ingrese observaciones adicionales..."
                    multiline
                    rows={2}
                  />
                )}
              />
            </Box>
          </>
        );

      case "boolean":
        return (
          <>
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={!!field.value} 
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Sí"
                />
              )}
            />
            <Box mt={2}>
              <Controller
                name={observacionFieldName}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value || ""}
                    fullWidth
                    size="small"
                    label="Observaciones (opcional)"
                    placeholder="Ingrese observaciones adicionales..."
                    multiline
                    rows={2}
                  />
                )}
              />
            </Box>
          </>
        );

      case "date":
        return (
          <>
            <Controller
              name={fieldName}
              control={control}
              rules={{ required: question.obligatorio ? "Este campo es obligatorio" : false }}
              render={({ field }) => (
                <TextField
                  value={field.value || ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  type="date"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Box mt={2}>
              <Controller
                name={observacionFieldName}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value || ""}
                    fullWidth
                    size="small"
                    label="Observaciones (opcional)"
                    placeholder="Ingrese observaciones adicionales..."
                    multiline
                    rows={2}
                  />
                )}
              />
            </Box>
          </>
        );

      default:
        return <Typography color="error">Tipo de pregunta no soportado</Typography>;
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2, backgroundColor: "#fafafa" }}>
      <Box display="flex" gap={2}>
        {question.image && (
          <Box
            sx={{
              flexShrink: 0,
              width: 120,
              height: 120,
              borderRadius: 1,
              overflow: "hidden",
              border: "1px solid #ddd",
            }}
          >
            <Box
              component="img"
              src={question.image.url}
              alt={question.image.caption}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        )}
        <Box flex={1}>
          <FormLabel component="legend" sx={{ mb: 1 }}>
            <Typography variant="body1" fontWeight="medium">
              {question.text}
              {question.obligatorio && (
                <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                  *
                </Typography>
              )}
            </Typography>
          </FormLabel>
          {question.image?.caption && (
            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
              {question.image.caption}
            </Typography>
          )}
          {renderInput()}
        </Box>
      </Box>
    </Paper>
  );
};

interface SectionRendererProps {
  section: Section;
  sectionPath: string;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  level?: number;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({
  section,
  sectionPath,
  control,
  errors,
  level = 0,
}) => {
  return (
    <Accordion defaultExpanded={level < 2} sx={{ mb: 2, ml: level * 2 }}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box>
          <Typography variant="h6" fontWeight="medium">
            {section.isParent ? "📁" : "📄"} {section.title}
          </Typography>
          {section.description && (
            <Typography variant="caption" color="text.secondary">
              {section.description}
            </Typography>
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {section.images && section.images.length > 0 && (
          <Box mb={3}>
            <Typography variant="subtitle2" gutterBottom>
              Imágenes de referencia
            </Typography>
            <Grid container spacing={2}>
              {section.images.map((img, idx) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={img._id || idx}>
                  <Card variant="outlined">
                    <Box
                      component="img"
                      src={img.url}
                      alt={img.caption}
                      sx={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                      }}
                    />
                    <CardContent>
                      <Typography variant="caption">{img.caption}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ my: 2 }} />
          </Box>
        )}

        {!section.isParent && section.questions.length > 0 && (
          <Box mb={2}>
            {section.questions.map((question, qIdx) => (
              <QuestionRenderer
                key={question._id || qIdx}
                question={question}
                sectionPath={sectionPath}
                questionIndex={qIdx}
                control={control}
                errors={errors}
              />
            ))}
          </Box>
        )}

        {section.subsections && section.subsections.length > 0 && (
          <Box>
            {section.subsections.map((subsection, subIdx) => (
              <SectionRenderer
                key={subsection._id || subIdx}
                section={subsection}
                sectionPath={`${sectionPath}.sub${subIdx}`}
                control={control}
                errors={errors}
                level={level + 1}
              />
            ))}
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

interface FormFillerProps {
  template: FormTemplate;
  onSave?: (data: FormResponse) => void;
  onSubmit?: (data: FormResponse) => void;
}

export const FormFiller: React.FC<FormFillerProps> = ({ template, onSave, onSubmit }) => {
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      verification: {},
      responses: {},
    },
  });

  const handleSaveDraft = (data: FormData) => {
    const formResponse: FormResponse = {
      templateId: template._id,
      verificationData: data.verification,
      responses: data.responses,
      submittedAt: new Date(),
      status: "draft",
    };

    console.log("Guardando borrador:", formResponse);
    setSaveMessage("Borrador guardado exitosamente");
    setTimeout(() => setSaveMessage(null), 3000);

    if (onSave) {
      onSave(formResponse);
    }
  };

  const handleFinalSubmit = (data: FormData) => {
    const formResponse: FormResponse = {
      templateId: template._id,
      verificationData: data.verification,
      responses: data.responses,
      submittedAt: new Date(),
      status: "completed",
    };

    console.log("Enviando formulario:", formResponse);
    setSaveMessage("Formulario enviado exitosamente");

    if (onSubmit) {
      onSubmit(formResponse);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Card sx={{ mb: 3, backgroundColor: "#1976d2", color: "white" }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {template.name}
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Chip label={`Código: ${template.code}`} sx={{ backgroundColor: "white" }} />
            <Chip label={template.revision} sx={{ backgroundColor: "white" }} />
            <Chip
              label={template.type === "interna" ? "Inspección Interna" : "Inspección Externa"}
              sx={{ backgroundColor: "white" }}
            />
          </Box>
        </CardContent>
      </Card>

      {saveMessage && (
        <Alert severity="success" sx={{ mb: 3 }} icon={<CheckCircle />}>
          {saveMessage}
        </Alert>
      )}

      // En FormFiller.tsx, dentro del render
<Card sx={{ mb: 3 }}>
  <CardContent>
    <Typography variant="h6" gutterBottom>
      Datos de Verificación
    </Typography>
    <Grid container spacing={2}>
      {template.verificationFields.map((field, idx) => {
        const fieldKey = `verification.${field.label}` as FieldPath<FormData>;
        const fieldError = errors.verification?.[field.label];
        
        return (
          <Grid size={{ xs: 12, sm: 6 }} key={idx}>
            {field.type === "autocomplete" && field.dataSource ? (
              <Controller
                name={fieldKey}
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                render={({ field: formField }) => (
                  <AutocompleteCustom
                    dataSource={field.dataSource as DataSourceType}
                    label={field.label}
                    value={formField.value as string || null}
                    onChange={formField.onChange}
                    onBlur={formField.onBlur}
                    error={!!fieldError}
                    helperText={fieldError?.message}
                    required
                  />
                )}
              />
            ) : (
              <Controller
                name={fieldKey}
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                render={({ field: formField }) => (
                  <TextField
                    value={formField.value || ""}
                    onChange={formField.onChange}
                    onBlur={formField.onBlur}
                    fullWidth
                    label={field.label}
                    type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                    InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
                    error={!!fieldError}
                    helperText={fieldError?.message}
                  />
                )}
              />
            )}
          </Grid>
        );
      })}
    </Grid>
  </CardContent>
</Card>

      <Box mb={3}>
        {template.sections.map((section, sIdx) => (
          <SectionRenderer
            key={section._id || sIdx}
            section={section}
            sectionPath={`responses.s${sIdx}`}
            control={control}
            errors={errors}
          />
        ))}
      </Box>

      <Box display="flex" gap={2} justifyContent="flex-end">
        <Button
          variant="outlined"
          startIcon={<Save />}
          onClick={handleSubmit(handleSaveDraft)}
        >
          Guardar Borrador
        </Button>
        <Button
          variant="contained"
          startIcon={<Send />}
          onClick={handleSubmit(handleFinalSubmit)}
        >
          Enviar Formulario
        </Button>
      </Box>
    </Box>
  );
};