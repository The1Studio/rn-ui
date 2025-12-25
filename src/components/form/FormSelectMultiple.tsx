import React from 'react';
import {
  Controller,
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { SelectMultiple, SelectMultipleProps } from './SelectMultiple';

export interface FormSelectMultipleProps<
  T extends FieldValues,
  V = string | number,
> extends Omit<SelectMultipleProps<V>, 'value' | 'onChange'> {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T, Path<T>>;
}

export function FormSelectMultiple<T extends FieldValues, V = string | number>({
  control,
  name,
  rules,
  ...props
}: FormSelectMultipleProps<T, V>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <SelectMultiple<V>
          value={value || []}
          onChange={onChange}
          error={error?.message}
          {...props}
        />
      )}
    />
  );
}
