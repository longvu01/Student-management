import { TextField } from '@mui/material';
import { InputHTMLAttributes } from 'react';
import { Control, useController } from 'react-hook-form';

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  control: Control<any>;
  label?: string;
}

export function InputField({ name, control, label, ...inputProps }: InputFieldProps) {
  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  });

  return (
    <TextField
      fullWidth
      margin="normal"
      variant="outlined"
      size="small"
      //
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      inputRef={ref}
      //
      name={name}
      label={label}
      inputProps={inputProps}
      //
      error={invalid}
      helperText={error?.message}
    />
  );
}
