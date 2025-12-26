import React, { useRef, ReactNode, createContext, useContext } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import ReanimatedSwipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { SharedValue } from 'react-native-reanimated';
import { colors } from '@repo/core';

// Context to manage only one open swipeable at a time (using refs to avoid re-renders)
interface SwipeableContextType {
  openSwipeableRef: React.RefObject<SwipeableMethods | null>;
}

const SwipeableContext = createContext<SwipeableContextType | null>(null);

// Provider to wrap a list of SwipeableCards
export interface SwipeableCardProviderProps {
  children: ReactNode;
}

export function SwipeableCardProvider({ children }: SwipeableCardProviderProps) {
  // Use ref to store the currently open swipeable - no re-renders!
  const openSwipeableRef = useRef<SwipeableMethods | null>(null);

  return (
    <SwipeableContext.Provider value={{ openSwipeableRef }}>
      {children}
    </SwipeableContext.Provider>
  );
}

// Hook to use swipeable context
export function useSwipeableContext() {
  return useContext(SwipeableContext);
}

// Props for SwipeableCard
export interface SwipeableCardProps {
  /** Content of the card */
  children: ReactNode;
  /** Render function for left actions (swipe right to reveal) */
  renderLeftActions?: (
    progress: SharedValue<number>,
    drag: SharedValue<number>,
    close: () => void
  ) => ReactNode;
  /** Render function for right actions (swipe left to reveal) */
  renderRightActions?: (
    progress: SharedValue<number>,
    drag: SharedValue<number>,
    close: () => void
  ) => ReactNode;
  /** Called when swipeable is opened */
  onOpen?: (direction: 'left' | 'right') => void;
  /** Called when swipeable is closed */
  onClose?: () => void;
  /** Container style */
  containerStyle?: ViewStyle;
  /** Content container style */
  contentStyle?: ViewStyle;
  /** Whether to allow overshoot on left side */
  overshootLeft?: boolean;
  /** Whether to allow overshoot on right side */
  overshootRight?: boolean;
  /** Friction for swipe gesture */
  friction?: number;
  /** Whether swipe is enabled */
  enabled?: boolean;
}

export function SwipeableCard({
  children,
  renderLeftActions,
  renderRightActions,
  onOpen,
  onClose,
  containerStyle,
  contentStyle,
  overshootLeft = false,
  overshootRight = false,
  friction = 2,
  enabled = true,
}: SwipeableCardProps) {
  const swipeableRef = useRef<SwipeableMethods>(null);
  const context = useSwipeableContext();

  const close = () => {
    swipeableRef.current?.close();
  };

  const handleWillOpen = (_direction: 'left' | 'right') => {
    // Close the previously open swipeable immediately
    if (context) {
      const previousSwipeable = context.openSwipeableRef.current;
      if (previousSwipeable && previousSwipeable !== swipeableRef.current) {
        previousSwipeable.close();
      }
      // Update the ref to current swipeable (no re-render!)
      context.openSwipeableRef.current = swipeableRef.current;
    }
  };

  const handleOpen = (direction: 'left' | 'right') => {
    onOpen?.(direction);
  };

  const handleClose = () => {
    // Clear the ref if this was the open swipeable
    if (context && context.openSwipeableRef.current === swipeableRef.current) {
      context.openSwipeableRef.current = null;
    }
    onClose?.();
  };

  const handleRenderLeftActions = renderLeftActions
    ? (progress: SharedValue<number>, drag: SharedValue<number>) =>
        renderLeftActions(progress, drag, close)
    : undefined;

  const handleRenderRightActions = renderRightActions
    ? (progress: SharedValue<number>, drag: SharedValue<number>) =>
        renderRightActions(progress, drag, close)
    : undefined;

  return (
    <View style={[styles.container, containerStyle]}>
      <ReanimatedSwipeable
        ref={swipeableRef}
        renderLeftActions={handleRenderLeftActions}
        renderRightActions={handleRenderRightActions}
        onSwipeableWillOpen={handleWillOpen}
        onSwipeableOpen={handleOpen}
        onSwipeableClose={handleClose}
        overshootLeft={overshootLeft}
        overshootRight={overshootRight}
        friction={friction}
        enabled={enabled}
      >
        <View style={[styles.content, contentStyle]}>{children}</View>
      </ReanimatedSwipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  content: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
});
