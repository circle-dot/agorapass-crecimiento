import React from 'react';
import UserCard from '@/components/ui/users/UserCard';

function page() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            <UserCard />
            <UserCard />
            <UserCard />
            <UserCard />
        </div>
    );
}

export default page;
