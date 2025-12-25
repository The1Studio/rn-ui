import React, { useState, useCallback } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { colors, formatDate, DateFormats } from '@repo/core';
import CalendarIcon from '../icons/CalendarIcon';

export interface DatePickerProps {
  /** Selected date value */
  value?: Date | null;
  /** Callback when date is selected */
  onChange?: (date: Date | null) => void;
  /** Label text */
  label?: string;
  /** Placeholder text when no date selected */
  placeholder?: string;
  /** Date format for display */
  displayFormat?: string;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Whether to show time picker */
  timePicker?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Whether the field can be cleared */
  clearable?: boolean;
  /** Error message */
  error?: string;
  /** Container style */
  containerStyle?: ViewStyle;
  /** Title for the modal */
  modalTitle?: string;
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = 'Select date',
  displayFormat = DateFormats.DATE_MEDIUM,
  minDate,
  maxDate,
  timePicker = false,
  disabled = false,
  clearable = true,
  error,
  containerStyle,
  modalTitle = 'Select Date',
}: DatePickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempDate, setTempDate] = useState<DateType>(
    value ? dayjs(value) : dayjs()
  );

  const openModal = useCallback(() => {
    if (!disabled) {
      setTempDate(value ? dayjs(value) : dayjs());
      setModalVisible(true);
    }
  }, [disabled, value]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleDateChange = useCallback(
    (params: { date: DateType }) => {
      setTempDate(params.date);
    },
    []
  );

  const handleConfirm = useCallback(() => {
    if (tempDate) {
      const dateValue = dayjs(tempDate).toDate();
      onChange?.(dateValue);
    }
    closeModal();
  }, [tempDate, onChange, closeModal]);

  const handleClear = useCallback(() => {
    onChange?.(null);
  }, [onChange]);

  const displayValue = value
    ? formatDate(value, timePicker ? DateFormats.DATETIME_MEDIUM : displayFormat)
    : '';

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[
          styles.field,
          disabled && styles.fieldDisabled,
          error && styles.fieldError,
        ]}
        onPress={openModal}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <CalendarIcon
          size={20}
          color={disabled ? colors.textSecondary : colors.text}
        />
        <Text
          style={[
            styles.fieldText,
            !value && styles.placeholder,
            disabled && styles.textDisabled,
          ]}
          numberOfLines={1}
        >
          {displayValue || placeholder}
        </Text>
        {clearable && value && !disabled && (
          <TouchableOpacity
            onPress={handleClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.clearButton}>✕</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.backdrop}>
          <Pressable style={styles.backdropPressable} onPress={closeModal} />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>

            <DateTimePicker
              mode="single"
              date={tempDate}
              onChange={handleDateChange}
              minDate={minDate ? dayjs(minDate) : undefined}
              maxDate={maxDate ? dayjs(maxDate) : undefined}
              timePicker={timePicker}
              styles={{
                header: {
                  backgroundColor: colors.surface,
                },
                month_selector_label: {
                  color: colors.text,
                  fontWeight: '600',
                },
                year_selector_label: {
                  color: colors.text,
                  fontWeight: '600',
                },
                button_next: {
                  tintColor: colors.primary,
                },
                button_prev: {
                  tintColor: colors.primary,
                },
                selected: {
                  backgroundColor: colors.primary,
                },
                selected_label: {
                  color: '#ffffff',
                },
                today: {
                  borderColor: colors.primary,
                  borderWidth: 1,
                },
                today_label: {
                  color: colors.primary,
                },
                day_label: {
                  color: colors.text,
                },
                weekday_label: {
                  color: colors.textSecondary,
                },
                outside_label: {
                  color: colors.border,
                },
              }}
            />

            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.footerButton, styles.footerButtonCancel]}
                onPress={closeModal}
              >
                <Text style={styles.footerButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.footerButton}
                onPress={handleConfirm}
              >
                <Text style={styles.footerButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Form-integrated DatePicker
import { Controller, Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';

export interface FormDatePickerProps<T extends FieldValues>
  extends Omit<DatePickerProps, 'value' | 'onChange' | 'error'> {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T, Path<T>>;
}

export function FormDatePicker<T extends FieldValues>({
  control,
  name,
  rules,
  ...props
}: FormDatePickerProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <DatePicker
          {...props}
          value={value}
          onChange={onChange}
          error={error?.message}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 10,
  },
  fieldDisabled: {
    backgroundColor: colors.border,
    opacity: 0.6,
  },
  fieldError: {
    borderColor: colors.error,
  },
  fieldText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  placeholder: {
    color: colors.textSecondary,
  },
  textDisabled: {
    color: colors.textSecondary,
  },
  clearButton: {
    fontSize: 16,
    color: colors.textSecondary,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backdropPressable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 12,
  },
  footerButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  footerButtonCancel: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  footerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  footerButtonTextCancel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});
