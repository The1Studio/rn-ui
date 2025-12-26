import React, { useEffect, useRef } from 'react';
import {
  Animated,
  DimensionValue,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { colors } from '@repo/core';

export interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
}

// Pre-configured skeleton variants
export interface SkeletonTextProps {
  lines?: number;
  lineHeight?: number;
  spacing?: number;
  lastLineWidth?: DimensionValue;
  style?: ViewStyle;
}

export function SkeletonText({
  lines = 3,
  lineHeight = 14,
  spacing = 10,
  lastLineWidth = '60%',
  style,
}: SkeletonTextProps) {
  return (
    <View style={style}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height={lineHeight}
          width={index === lines - 1 ? lastLineWidth : '100%'}
          borderRadius={4}
          style={index < lines - 1 ? { marginBottom: spacing } : undefined}
        />
      ))}
    </View>
  );
}

export interface SkeletonAvatarProps {
  size?: number;
  style?: ViewStyle;
}

export function SkeletonAvatar({ size = 48, style }: SkeletonAvatarProps) {
  return (
    <Skeleton
      width={size}
      height={size}
      borderRadius={size / 2}
      style={style}
    />
  );
}

export interface SkeletonCardProps {
  style?: ViewStyle;
}

export function SkeletonCard({ style }: SkeletonCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.cardHeader}>
        <SkeletonAvatar size={40} />
        <View style={styles.cardHeaderText}>
          <Skeleton width="50%" height={14} borderRadius={4} />
          <Skeleton
            width="30%"
            height={12}
            borderRadius={4}
            style={{ marginTop: 6 }}
          />
        </View>
      </View>
      <SkeletonText lines={3} style={{ marginTop: 16 }} />
    </View>
  );
}

export interface SkeletonListItemProps {
  hasAvatar?: boolean;
  style?: ViewStyle;
}

export function SkeletonListItem({
  hasAvatar = true,
  style,
}: SkeletonListItemProps) {
  return (
    <View style={[styles.listItem, style]}>
      {hasAvatar && <SkeletonAvatar size={44} style={{ marginRight: 12 }} />}
      <View style={styles.listItemContent}>
        <Skeleton width="70%" height={14} borderRadius={4} />
        <Skeleton
          width="40%"
          height={12}
          borderRadius={4}
          style={{ marginTop: 8 }}
        />
      </View>
    </View>
  );
}

export interface SkeletonListProps {
  count?: number;
  hasAvatar?: boolean;
  style?: ViewStyle;
}

export function SkeletonList({
  count = 5,
  hasAvatar = true,
  style,
}: SkeletonListProps) {
  return (
    <View style={style}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonListItem
          key={index}
          hasAvatar={hasAvatar}
          style={index < count - 1 ? { marginBottom: 16 } : undefined}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.border,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  cardHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  listItemContent: {
    flex: 1,
  },
});
