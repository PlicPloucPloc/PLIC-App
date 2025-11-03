import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

const SwipeButton = React.memo(
  ({ onPress, disabled, style, children, ...rest }: TouchableOpacityProps) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[style, { opacity: disabled ? 0.5 : 1 }]}
        disabled={disabled}
        {...rest}>
        {children}
      </TouchableOpacity>
    );
  },
);

SwipeButton.displayName = 'SwipeButton';

export default SwipeButton;
