import React from 'react';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { RadioGroup, RadioGroupProps } from './RadioButton';

export interface FormRadioGroupProps<T extends FieldValues, V = string>
  extends Omit<RadioGroupProps<V>, 'value' | 'onChange' | 'error'> {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T, Path<T>>;
}

export function FormRadioGroup<T extends FieldValues, V = string>({
  control,
  name,
  rules,
  ...radioGroupProps
}: FormRadioGroupProps<T, V>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <RadioGroup<V>
          {...radioGroupProps}
          value={value}
          onChange={onChange}
          error={error?.message}
        />
      )}
    />
  );
}
