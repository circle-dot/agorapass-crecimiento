import { useInfiniteQuery } from '@tanstack/react-query';

const fetchUsers = async ({ pageParam = 1 }) => {
    const response = await fetch(`/api/users?page=${pageParam}`);
    return response.json();
};

const useUsers = () => {
    return useInfiniteQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            console.log("Last Page in getNextPageParam:", lastPage);
            return lastPage.hasMore ? lastPage.nextPage : undefined;
        },
    });
};
export default useUsers;