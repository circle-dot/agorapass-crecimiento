import { useInfiniteQuery } from '@tanstack/react-query';

const fetchUsers = async ({ pageParam = 1, queryKey }: any) => {
    const [, sortOrder, searchQuery] = queryKey;
    const queryString = new URLSearchParams({ page: String(pageParam), sortOrder, searchQuery }).toString();
    const response = await fetch(`/api/users?${queryString}`);
    return response.json();
};

const useUsers = (sortOrder: 'asc' | 'desc', searchQuery: string) => {
    return useInfiniteQuery({
        queryKey: ['users', sortOrder, searchQuery],
        queryFn: fetchUsers,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? lastPage.nextPage : undefined;
        },
    });
};

export default useUsers;
