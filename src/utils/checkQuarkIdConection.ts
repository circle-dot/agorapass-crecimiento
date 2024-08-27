export default async function checkQuark(token: string): Promise<number | undefined> {
    try {
        const response = await fetch('/api/quarkid/checkUser', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 404) {
            return 404;
        }

        // Handle other status codes as needed
        return response.status;
    } catch (error) {
        console.error('Error checking QuarkId connection:', error);
        return undefined; // Or a specific error code
    }
}
