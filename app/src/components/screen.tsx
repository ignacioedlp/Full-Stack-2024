import { SafeAreaView } from 'react-native';
import { styled } from 'nativewind';
import { cn } from '@/libs/utils';
import { Platform } from 'react-native';
import React from 'react';

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
        'dark:bg-black mx-8 flex-1',
        `${Platform.OS === 'android' ? 'pt-10 pb-4' : 'pt-0'}`,
        className,
      )}
    >
      {children}
    </StyledView>
  );
};

export default ThemeView;
