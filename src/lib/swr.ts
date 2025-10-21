import useSWR from 'swr';
import { getCategories } from '@/action/event-action';
import { getUsers } from '@/action/user-action';

// Generic fetcher function for SWR
export const fetcher = async (key: string, fetchFn: () => Promise<any>) => {
  try {
    const result = await fetchFn();
    return result.success ? result.data : [];
  } catch (error) {
    console.error(`SWR Error for key ${key}:`, error);
    return [];
  }
};

// Custom hooks for specific data fetching
export const useCategories = () => {
  const { data, error, isLoading, mutate } = useSWR(
    'categories',
    () => fetcher('categories', getCategories),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // Cache for 1 minute
    },
  );

  return {
    categories: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
};

export const useUsers = () => {
  const { data, error, isLoading, mutate } = useSWR('users', () => fetcher('users', getUsers), {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // Cache for 1 minute
  });

  return {
    users: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
};

// Combined hook for form options
export const useFormOptions = () => {
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    refresh: refreshCategories,
  } = useCategories();
  const { users, isLoading: usersLoading, error: usersError, refresh: refreshUsers } = useUsers();

  const categoryOptions = categories.map((c: any) => ({ label: c.name, value: c.id }));
  const userOptions = users.map((u: any) => ({ label: u.name, value: u.id }));

  const refreshAll = () => {
    refreshCategories();
    refreshUsers();
  };

  return {
    categoryOptions,
    userOptions,
    isLoading: categoriesLoading || usersLoading,
    error: categoriesError || usersError,
    refresh: refreshAll,
  };
};
