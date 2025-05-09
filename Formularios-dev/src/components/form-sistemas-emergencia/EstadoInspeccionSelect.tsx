import { FormControl, Select, MenuItem, type SelectChangeEvent } from "@mui/material"
import type { EstadoInspeccion } from "../../types/formTypes"

interface EstadoInspeccionSelectProps {
  value: EstadoInspeccion
  onChange: (event: SelectChangeEvent) => void
  disabled?: boolean
}

const EstadoInspeccionSelect = ({ value, onChange, disabled = false }: EstadoInspeccionSelectProps) => (
  <FormControl fullWidth size="small">
    <Select value={value || ""} onChange={onChange} disabled={disabled} displayEmpty>
      <MenuItem value="">Seleccionar</MenuItem>
      <MenuItem value="✓">✓</MenuItem>
      <MenuItem value="X">X</MenuItem>
      <MenuItem value="N/A">N/A</MenuItem>
    </Select>
  </FormControl>
)

export default EstadoInspeccionSelect
