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

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface DateRangePickerProps {
  /** Selected date range value */
  value?: DateRange | null;
  /** Callback when date range is selected */
  onChange?: (range: DateRange | null) => void;
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

export function DateRangePicker({
  value,
  onChange,
  label,
  placeholder = 'Select date range',
  displayFormat = DateFormats.DATE_MEDIUM,
  minDate,
  maxDate,
  disabled = false,
  clearable = true,
  error,
  containerStyle,
  modalTitle = 'Select Date Range',
}: DateRangePickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<DateType>(
    value?.startDate ? dayjs(value.startDate) : undefined
  );
  const [tempEndDate, setTempEndDate] = useState<DateType>(
    value?.endDate ? dayjs(value.endDate) : undefined
  );

  const openModal = useCallback(() => {
    if (!disabled) {
      setTempStartDate(value?.startDate ? dayjs(value.startDate) : undefined);
      setTempEndDate(value?.endDate ? dayjs(value.endDate) : undefined);
      setModalVisible(true);
    }
  }, [disabled, value]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleDateChange = useCallback(
    (params: { startDate: DateType; endDate: DateType }) => {
      setTempStartDate(params.startDate);
      setTempEndDate(params.endDate);
    },
    []
  );

  const handleConfirm = useCallback(() => {
    const startDate = tempStartDate ? dayjs(tempStartDate).toDate() : null;
    const endDate = tempEndDate ? dayjs(tempEndDate).toDate() : null;
    onChange?.({ startDate, endDate });
    closeModal();
  }, [tempStartDate, tempEndDate, onChange, closeModal]);

  const handleClear = useCallback(() => {
    onChange?.(null);
  }, [onChange]);

  const getDisplayValue = () => {
    if (!value?.startDate) return '';
    const startStr = formatDate(value.startDate, displayFormat);
    if (!value.endDate) return startStr;
    const endStr = formatDate(value.endDate, displayFormat);
    return `${startStr} - ${endStr}`;
  };

  const displayValue = getDisplayValue();

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
            !value?.startDate && styles.placeholder,
            disabled && styles.textDisabled,
          ]}
          numberOfLines={1}
        >
          {displayValue || placeholder}
        </Text>
        {clearable && value?.startDate && !disabled && (
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
              mode="range"
              startDate={tempStartDate}
              endDate={tempEndDate}
              onChange={handleDateChange}
              minDate={minDate ? dayjs(minDate) : undefined}
              maxDate={maxDate ? dayjs(maxDate) : undefined}
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
                range_middle: {
                  backgroundColor: colors.primary + '20',
                },
                range_middle_label: {
                  color: colors.text,
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

// Form-integrated DateRangePicker
import { Controller, Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';

export interface FormDateRangePickerProps<T extends FieldValues>
  extends Omit<DateRangePickerProps, 'value' | 'onChange' | 'error'> {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T, Path<T>>;
}

export function FormDateRangePicker<T extends FieldValues>({
  control,
  name,
  rules,
  ...props
}: FormDateRangePickerProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <DateRangePicker
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
