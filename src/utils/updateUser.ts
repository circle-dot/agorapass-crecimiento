const updateUser = async () => {
    const token = await getAccessToken();

    if (!token) {
        console.error('Authorization token is missing');
        return;
    }

    try {
        const response = await fetch('/api/user', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify({ name: username, bio: bio }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error updating user:', errorData);
        } else {
            const updatedUser = await response.json();
            console.log('User updated successfully:', updatedUser);
            setUpdateTrigger(prev => !prev);  // Update the trigger to refetch data
        }
    } catch (error) {
        console.error('Error updating user:', error);
    }
};

export default updateUser