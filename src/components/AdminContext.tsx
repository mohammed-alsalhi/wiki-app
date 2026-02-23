"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AdminContext = createContext(false);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((data) => setIsAdmin(data.admin))
      .catch(() => setIsAdmin(false));
  }, []);

  return (
    <AdminContext.Provider value={isAdmin}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
