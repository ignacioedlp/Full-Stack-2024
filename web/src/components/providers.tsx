import { ReactNode } from "react";
import { ThemeProvider } from "@/contexts/theme-provider";
import AuthProvider from "@/contexts/auth-provider";
import { SidebarProvider } from "@/contexts/sidebar-admin-provider";
import { LocaleProvider } from "@/contexts/locale-provider";

interface Props {
  children: ReactNode;
}

const Providers = ({ children }: Props) => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <LocaleProvider>
        <AuthProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
};

export default Providers;
