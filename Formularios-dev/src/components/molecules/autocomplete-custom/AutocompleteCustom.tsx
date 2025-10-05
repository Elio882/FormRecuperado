// components/common/AutocompleteCustom.tsx
import React, { useEffect, useState } from 'react';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';
import { DataSourceType, fetchDataBySource } from '@/lib/actions/dataSourceService';

interface AutocompleteCustomProps {
  dataSource?: DataSourceType;
  label?: string;
  placeholder?: string;
  value?: string | null;
  onChange?: (value: string | null) => void;
  onBlur?: () => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
}

const AutocompleteCustom: React.FC<AutocompleteCustomProps> = ({
  dataSource,
  label = 'Seleccione o agregue un valor',
  placeholder,
  value = null,
  onChange,
  onBlur,
  error = false,
  helperText,
  disabled = false,
  required = false
}) => {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dataSource) {
      setOptions([]);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchDataBySource(dataSource);
        setOptions(data);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dataSource]);

  const handleChange = (_event: any, newValue: string | null) => {
    onChange?.(newValue);
  };

  return (
    <Autocomplete
      freeSolo
      options={options}
      value={value}
      onChange={handleChange}
      onBlur={onBlur}
      loading={loading}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          required={required}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default AutocompleteCustom;
