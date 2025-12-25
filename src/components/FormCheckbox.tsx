import React from 'react';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { Checkbox, CheckboxProps } from './Checkbox';

export interface FormCheckboxProps<T extends FieldValues>
  extends Omit<CheckboxProps, 'checked' | 'onChange' | 'error'> {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T, Path<T>>;
}

export function FormCheckbox<T extends FieldValues>({
  control,
  name,
  rules,
  ...checkboxProps
}: FormCheckboxProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Checkbox
          {...checkboxProps}
          checked={Boolean(value)}
          onChange={onChange}
          error={error?.message}
        />
      )}
    />
  );
}
