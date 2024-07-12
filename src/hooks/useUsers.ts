import { useInfiniteQuery } from '@tanstack/react-query';

const fetchUsers = async ({ pageParam = 1, queryKey }: any) => {
    const [, sortOrder] = queryKey;
    const response = await fetch(`/api/users?page=${pageParam}&sortOrder=${sortOrder}`);
    return response.json();
};


const useUsers = (sortOrder: 'asc' | 'desc') => {
    return useInfiniteQuery({
        queryKey: ['users', sortOrder],
        queryFn: fetchUsers,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? lastPage.nextPage : undefined;
        },
    });
};
export default useUsers;