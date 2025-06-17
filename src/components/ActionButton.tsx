import React from 'react';
import { TouchableOpacity } from 'react-native';

type ActionButtonProps = TouchableOpacity['props'] & {
  onTap?: () => void;
};

const SwipeButton = React.memo(({ onTap, style, children, ...rest }: ActionButtonProps) => {
  return (
    <TouchableOpacity onPress={onTap} {...rest} style={style}>
      {children}
    </TouchableOpacity>
  );
});

export default SwipeButton;
