import { styled } from "nativewind";
import React from "react";
import { SafeAreaView, Platform } from "react-native";

import { cn } from "@/libs/utils";

const StyledView = styled(SafeAreaView);

const ThemeView = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <StyledView
      className={cn(
        "dark:bg-black mx-8 flex-1",
        `${Platform.OS === "android" ? "pt-10 pb-4" : "pt-0"}`,
        className,
      )}
    >
      {children}
    </StyledView>
  );
};

export default ThemeView;
