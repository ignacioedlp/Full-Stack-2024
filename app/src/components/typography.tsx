import { styled } from "nativewind";
import React from "react";
import { Text, View } from "react-native";

import { cn } from "@/libs/utils";
const StyledText = styled(Text);

const TypographyH1 = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <StyledText
      className={cn(
        "text-4xl font-extrabold tracking-tight scroll-m-20 lg:text-5xl dark:text-white",
        className,
      )}
    >
      {text}
    </StyledText>
  );
};

const TypographyH2 = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <StyledText
      className={cn(
        "pb-2 text-3xl font-semibold tracking-tight border-b scroll-m-20 first:mt-0 dark:text-white",
        className,
      )}
    >
      {text}
    </StyledText>
  );
};

const TypographyH3 = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <StyledText
      className={cn(
        "text-2xl font-semibold tracking-tight scroll-m-20 dark:text-white",
        className,
      )}
    >
      {text}
    </StyledText>
  );
};

const TypographyH4 = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <StyledText
      className={cn(
        "text-xl font-semibold tracking-tight scroll-m-20 dark:text-white",
        className,
      )}
    >
      {text}
    </StyledText>
  );
};

const TypographyP = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <StyledText
      className={cn(
        "leading-7 [&:not(:first-child)]:mt-6 dark:text-white",
        className,
      )}
    >
      {text}
    </StyledText>
  );
};

const Typography = ({
  variant,
  text,
  className,
}: {
  text: string;
  variant: "h1" | "h2" | "h3" | "h4" | "p";
  className?: string;
}) => {
  return (
    <View>
      {variant === "h1" && <TypographyH1 text={text} className={className} />}
      {variant === "h2" && <TypographyH2 text={text} className={className} />}
      {variant === "h3" && <TypographyH3 text={text} className={className} />}
      {variant === "h4" && <TypographyH4 text={text} className={className} />}
      {variant === "p" && <TypographyP text={text} className={className} />}
    </View>
  );
};

export default Typography;
