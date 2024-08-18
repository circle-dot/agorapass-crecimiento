export const handleQuark = async () => {
    try {
        const URL = 'placeholder'

        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        return data; // Assuming the data contains the deeplink you want to use
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};
