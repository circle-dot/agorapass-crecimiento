// app/profile/page.tsx
"use client";
import { useEffect, useState } from "react";
import { usePrivy } from '@privy-io/react-auth';
import { DateTime } from "luxon";
import { useFetchUser } from '@/hooks/useFetchUser';
import { ProfileCard } from "@/components/ui/users/ProfileCard";
import { VouchesList } from "@/components/ui/users/VouchesList";
import { z } from "zod";
import { FormSchema } from "@/components/ui/users/ProfileCard";
import Link from "next/link";
const vouches = [
  { attesterWallet: '0x123...abc', vouchId: '1', date: '2024-07-01T00:00:00.000Z' },
  { attesterWallet: '0x456...def', vouchId: '2', date: '2024-07-05T00:00:00.000Z' },
  { attesterWallet: '0x123...abc', vouchId: '1', date: '2024-07-01T00:00:00.000Z' },
];

export default function Page() {
  const { getAccessToken } = usePrivy();
  const [remainingTime, setRemainingTime] = useState('');
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const { data, isLoading, error } = useFetchUser(updateTrigger);

  useEffect(() => {
    if (!data?.vouchReset) return;

    const vouchResetDate = DateTime.fromISO(data.vouchReset);

    const updateRemainingTime = () => {
      const now = DateTime.now();
      if (now > vouchResetDate) {
        setRemainingTime("00:00:00");
        return;
      }

      const duration = vouchResetDate.diff(now, ['days', 'hours', 'minutes', 'seconds']).toObject();
      const days = duration.days ?? 0;
      const hours = duration.hours ?? 0;
      const minutes = duration.minutes ?? 0;
      const seconds = duration.seconds ?? 0;

      setRemainingTime(
        `${Math.floor(days * 24 + hours).toString().padStart(2, '0')}:${Math.floor(minutes).toString().padStart(2, '0')}:${Math.floor(seconds).toString().padStart(2, '0')}`
      );
    };

    updateRemainingTime();
    const intervalId = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(intervalId);
  }, [data?.vouchReset]);

  function onSubmit(formData: z.infer<typeof FormSchema>) {
    const { username, bio } = formData;

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

    updateUser();
  }

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile</p>;

  return (
    <div className="p-6 bg-gray-100 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <ProfileCard
            data={data}
            onSubmit={onSubmit}
          />
        </div>
        <div className="md:col-span-2 space-y-4">
          <VouchesList vouches={vouches} />

          <div className="mt-4">
            <Link href={'/agora/address/' + data?.wallet} className="w-full flex ">
              <button className="px-4 py-2 w-full font-bold rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
                Check all your vouches
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

}
