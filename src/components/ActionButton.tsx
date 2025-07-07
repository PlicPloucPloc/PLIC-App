import React from 'react';
import { TouchableOpacity } from 'react-native';

type ActionButtonProps = TouchableOpacity['props'];

const SwipeButton = React.memo(
  ({ onPress, disabled, style, children, ...rest }: ActionButtonProps) => {
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

export default SwipeButton;
