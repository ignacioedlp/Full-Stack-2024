import { TouchableOpacity, Text } from 'react-native';
import { styled } from 'nativewind';
import { cn } from '@/libs/utils';
import React from 'react';

const StyledButton = styled(TouchableOpacity);

const ThemeSecondaryButton = ({
  onPress,
  className,
  text,
}: {
  onPress: () => void;
  className?: string;
  text: string;
}) => {
  return (
    <StyledButton
      className={cn(
        'dark:bg-black bg-white flex items-center justify-center w-full py-2 rounded-lg border border-input',
        className,
      )}
      onPress={onPress}
    >
      <Text
        className={cn(
          'leading-7 [&:not(:first-child)]:mt-6 dark:text-white text-black',
          className,
        )}
      >
        {text}
      </Text>
    </StyledButton>
  );
};

export default ThemeSecondaryButton;
