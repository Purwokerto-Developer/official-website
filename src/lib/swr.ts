import useSWR from 'swr';
import { getCategories } from '@/action/event-action';
import { getUsers } from '@/action/user-action';

export const fetcher = async (key: string, fetchFn: () => Promise<any>) => {
  try {
    const result = await fetchFn();
    return result.success ? result.data : [];
  } catch (error) {
    console.error(`SWR Error for key ${key}:`, error);
    return [];
  }
};

export const useCategories = () => {
  const { data, error, isLoading, mutate } = useSWR(
    'categories',
    () => fetcher('categories', getCategories),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
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
    dedupingInterval: 60000,
  });

  return {
    users: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
};

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
