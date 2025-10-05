"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

interface SessionValidatorProps {
  children: React.ReactNode;
}

export function SessionValidator({ children }: SessionValidatorProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isValidating, setIsValidating] = useState(false);
  const lastValidation = useRef<number>(0);
  const validationInProgress = useRef<boolean>(false);

  useEffect(() => {
    // No validar en estas páginas
    const publicRoutes = ['/', '/auth/error'];
    if (publicRoutes.includes(pathname) || status === "loading") {
      return;
    }

    // Si no hay sesión en rutas protegidas, redirigir
    if (status === "unauthenticated") {
      router.push('/');
      return;
    }

    // Solo validar si hay sesión y ha pasado tiempo suficiente
    const now = Date.now();
    const shouldValidate = session?.accessToken && 
                          !validationInProgress.current && 
                          (now - lastValidation.current) > 60000; // 1 minuto

    if (!shouldValidate) return;

    const validateSession = async () => {
      if (validationInProgress.current) return;
      
      validationInProgress.current = true;
      setIsValidating(true);
      lastValidation.current = now;

      try {
        const response = await fetch('/api/auth/validate-session');
        
        if (!response.ok) {
          console.log('Session validation failed, redirecting to home');
          router.push('/');
          return;
        }

        const result = await response.json();
        if (!result.valid) {
          console.log('Invalid session, redirecting to home');
          router.push('/');
        }
      } catch (error) {
        console.error('Session validation error:', error);
        // No redirigir en caso de error de red
      } finally {
        validationInProgress.current = false;
        setIsValidating(false);
      }
    };

    // Ejecutar validación
    validateSession();
  }, [session, status, pathname, router]);

  // Mostrar loading solo si realmente está validando
  if (status === "loading" || (isValidating && !session)) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div>Cargando...</div>
      </div>
    );
  }

  return <>{children}</>;
}