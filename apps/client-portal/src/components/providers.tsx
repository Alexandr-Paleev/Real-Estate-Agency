'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Автоматически обновлять при возврате на вкладку
            refetchOnWindowFocus: true,
            // Данные считаются свежими 10 секунд
            staleTime: 10 * 1000,
            // Повторные попытки при ошибке
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
