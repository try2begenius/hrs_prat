import { useState, useEffect } from "react";

interface AGGridWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AGGridWrapper({ children, fallback }: AGGridWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return fallback || (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading table...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}