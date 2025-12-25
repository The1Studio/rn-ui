import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import CloseIcon from '../icons/CloseIcon';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const ANIMATION_DURATION = 300;

interface IBottomSheetModalProps {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  title: string;
  renderContent: () => React.ReactNode;
  renderCloseButton?: () => React.ReactNode;
}

const BottomSheetModal = ({
  modalVisible,
  setModalVisible,
  title,
  renderContent,
  renderCloseButton,
}: IBottomSheetModalProps) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(modalVisible);

  const animateIn = useCallback(() => {
    setIsVisible(true);
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY, backdropOpacity]);

  const animateOut = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: ANIMATION_DURATION,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
    });
  }, [translateY, backdropOpacity]);

  useEffect(() => {
    if (modalVisible) {
      animateIn();
    } else if (isVisible) {
      animateOut();
    }
  }, [modalVisible, animateIn, animateOut, isVisible]);

  const handleClose = useCallback(() => {
    setModalVisible(false);
  }, [setModalVisible]);

  return (
    <Modal visible={isVisible} transparent statusBarTranslucent>
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              opacity: backdropOpacity,
            }}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          style={{
            position: 'absolute',
            alignItems: 'center',
            bottom: 0,
            width: '100%',
            backgroundColor: 'white',
            borderTopEndRadius: 16,
            borderTopStartRadius: 16,
            paddingBottom: 20,
            transform: [{ translateY }],
          }}
        >
          <View
            style={{
              width: 40,
              height: 4,
              backgroundColor: '#E0E0E0',
              borderRadius: 2,
              marginTop: 8,
              marginBottom: 4,
            }}
          />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            padding: 16,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              {title}
            </Text>
          </View>
          {renderCloseButton ? (
            renderCloseButton()
          ) : (
            <TouchableOpacity hitSlop={10} onPress={handleClose}>
              <CloseIcon color="#000" />
            </TouchableOpacity>
          )}
        </View>
          {renderContent()}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default BottomSheetModal;
