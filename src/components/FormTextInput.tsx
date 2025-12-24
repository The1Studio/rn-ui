import React from 'react';
import {
  Controller,
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { TextInput, TextInputProps } from './TextInput';

export interface FormTextInputProps<T extends FieldValues>
  extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T, Path<T>>;
}

export function FormTextInput<T extends FieldValues>({
  control,
  name,
  rules,
  ...props
}: FormTextInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <TextInput
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          error={error?.message}
          {...props}
        />
      )}
    />
  );
}
