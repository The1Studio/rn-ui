import React from 'react';
import {
  Controller,
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { SelectField, SelectFieldProps } from './SelectField';

export interface FormSelectFieldProps<
  T extends FieldValues,
  V = string | number,
> extends Omit<SelectFieldProps<V>, 'value' | 'onChange'> {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T, Path<T>>;
}

export function FormSelectField<T extends FieldValues, V = string | number>({
  control,
  name,
  rules,
  ...props
}: FormSelectFieldProps<T, V>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <SelectField<V>
          value={value}
          onChange={onChange}
          error={error?.message}
          {...props}
        />
      )}
    />
  );
}
