import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { ColorTheme } from '@app/Colors';

interface PasswordInputProps extends TextInputProps {
  inputStyle?: object;
  style?: object;
}

const PasswordInput = React.forwardRef<TextInput, PasswordInputProps>((props, ref) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <View style={[styles.inputWrapper, props.style]}>
      <TextInput
        {...props}
        ref={ref}
        style={[styles.passwordInput, props.inputStyle]}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="password"
        textContentType="password"
        secureTextEntry={!showPassword}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {isFocused && props.value && props.value.length > 0 && (
        <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)} style={styles.eyeIcon}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      )}
    </View>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    inputWrapper: {
      width: '100%',
      position: 'relative',
      justifyContent: 'center',
    },
    passwordInput: {
      width: '100%',
      padding: 12,
      paddingRight: 40,
      borderWidth: 1,
      borderColor: colors.contrast,
      borderRadius: 10,
      fontSize: 16,
    },
    eyeIcon: {
      position: 'absolute',
      right: 10,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
