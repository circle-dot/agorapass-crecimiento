import { useQuery } from '@tanstack/react-query';
import { usePrivy } from '@privy-io/react-auth';

const fetchUser = async (getAccessToken: () => Promise<string | null>) => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
        throw new Error('User is not authenticated');
    }

    const response = await fetch('/api/user', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch user data: ${errorText}`);
    }

    return response.json();
};

export const useFetchUser = () => {
    const { getAccessToken } = usePrivy();
    return useQuery({
        queryKey: ['user'],
        queryFn: () => fetchUser(getAccessToken),
    });
};
