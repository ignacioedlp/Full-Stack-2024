import { createContext, useContext, useState, FC, ReactNode } from "react";

interface SidebarAdminContextType {
  currentPage: string;
  handlePageChange: (pageName: string) => void;
}

const SidebarAdminContext = createContext<SidebarAdminContextType>({
  currentPage: "dashboard",
  handlePageChange: () => {},
});

export const useSidebar = (): SidebarAdminContextType => {
  const context = useContext(SidebarAdminContext);
  if (!context) {
    throw new Error("useSidebar debe ser usado dentro de un SidebarProvider");
  }
  return context;
};

export const SidebarProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<string>("dashboard");

  const handlePageChange = (pageName: string) => {
    setCurrentPage(pageName);
  };

  return (
    <SidebarAdminContext.Provider value={{ currentPage, handlePageChange }}>
      {children}
    </SidebarAdminContext.Provider>
  );
};
