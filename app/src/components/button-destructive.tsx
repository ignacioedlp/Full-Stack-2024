import { styled } from "nativewind";
import React from "react";
import { TouchableOpacity, Text } from "react-native";

import { cn } from "@/libs/utils";

const StyledButton = styled(TouchableOpacity);

const ThemeButtonDestructive = ({
  onPress,
  className,
  text,
  disabled,
}: {
  onPress: () => void;
  className?: string;
  text: string;
  disabled?: boolean;
}) => {
  return (
    <StyledButton
      className={cn(
        "bg-red-800 flex items-center justify-center w-full py-2 rounded-lg",
        `${disabled ? "opacity-50" : ""}`,
        className,
      )}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        className={cn(
          "leading-7 [&:not(:first-child)]:mt-6  text-white",
          className,
        )}
      >
        {text}
      </Text>
    </StyledButton>
  );
};

export default ThemeButtonDestructive;
