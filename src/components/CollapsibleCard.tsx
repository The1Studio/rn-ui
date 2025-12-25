import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '@repo/core';
import CloseIcon from './icons/CloseIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface CollapsibleCardProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  contentStyle?: ViewStyle;
  renderHeaderRight?: () => React.ReactNode;
}

export function CollapsibleCard({
  title,
  children,
  defaultExpanded = false,
  onToggle,
  disabled = false,
  containerStyle,
  headerStyle,
  titleStyle,
  contentStyle,
  renderHeaderRight,
}: CollapsibleCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const rotateAnim = useRef(
    new Animated.Value(defaultExpanded ? 1 : 0)
  ).current;

  const toggleExpand = useCallback(() => {
    if (disabled) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const newExpanded = !expanded;
    setExpanded(newExpanded);
    onToggle?.(newExpanded);

    Animated.timing(rotateAnim, {
      toValue: newExpanded ? 1 : 0,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [expanded, disabled, onToggle, rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View
      style={[
        styles.container,
        disabled && styles.containerDisabled,
        containerStyle,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggleExpand}
        disabled={disabled}
        style={[styles.header, headerStyle]}
      >
        <Text
          style={[styles.title, disabled && styles.titleDisabled, titleStyle]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <View style={styles.headerRight}>
          {renderHeaderRight?.()}
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <ChevronIcon
              color={disabled ? colors.textSecondary : colors.text}
            />
          </Animated.View>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={[styles.content, contentStyle]}>{children}</View>
      )}
    </View>
  );
}

// Simple Chevron Icon
function ChevronIcon({ color = colors.text }: { color?: string }) {
  return (
    <View style={styles.chevronContainer}>
      <ArrowDownIcon color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  containerDisabled: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 12,
  },
  titleDisabled: {
    color: colors.textSecondary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  chevronContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    fontSize: 12,
  },
});
