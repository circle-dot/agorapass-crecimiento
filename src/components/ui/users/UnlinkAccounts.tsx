import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { usePrivy } from '@privy-io/react-auth';
import { User } from '@privy-io/react-auth';

const MySwal = withReactContent(Swal);

interface UnlinkAccountsProps {
    user?: User | null | undefined;
    unlinkTwitter: (subject: string) => Promise<User>;
    unlinkFarcaster: (fid: number) => Promise<User>;
    setDialogOpen: (isOpen: boolean) => void;  // Add this line
}

const UnlinkAccounts: React.FC<UnlinkAccountsProps> = ({ user, unlinkTwitter, unlinkFarcaster, setDialogOpen }) => {
    const { getAccessToken } = usePrivy();

    const updateAccountDisplay = async (platform: string) => {
        try {
            Swal.showLoading();
            const token = await getAccessToken();

            const requestData = {
                twitter: platform === 'Twitter' ? '' : undefined,
                farcaster: platform === 'Farcaster' ? '' : undefined,
            };

            const response = await fetch('/api/user/linkAccount', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(requestData),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to update display status');
            }
            return result;
        } catch (error) {
            console.error('Error updating account display:', error);
            MySwal.fire('Error!', (error as Error).message, 'error');
        }
    };

    const handleUnlink = (platform: string) => {
        if (!user) return;

        MySwal.fire({
            title: `Are you sure you want to unlink ${platform}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, unlink it!',
        }).then((result) => {
            if (result.isConfirmed) {
                if (platform === 'Twitter') {
                    if (!user.twitter || !user.twitter.subject) {
                        MySwal.fire('Error!', 'Twitter username is missing.', 'error');
                        return;
                    }
                    unlinkTwitter(user.twitter.subject)
                        .then(() => updateAccountDisplay('Twitter'))
                        .then(() => {
                            MySwal.fire('Unlinked!', 'Your Twitter account has been unlinked.', 'success');
                            setDialogOpen(false);  // Close the dialog
                        })
                        .catch((error: Error) => {
                            MySwal.fire('Error!', error.message, 'error');
                        });
                } else if (platform === 'Farcaster') {
                    if (!user.farcaster || user.farcaster.fid === null) {
                        MySwal.fire('Error!', 'Farcaster ID is missing.', 'error');
                        return;
                    }
                    unlinkFarcaster(user.farcaster.fid)
                        .then(() => updateAccountDisplay('Farcaster'))
                        .then(() => {
                            MySwal.fire('Unlinked!', 'Your Farcaster account has been unlinked.', 'success');
                            setDialogOpen(false);  // Close the dialog
                        })
                        .catch((error: Error) => {
                            MySwal.fire('Error!', error.message, 'error');
                        });
                }
            }
        });
    };

    return (
        (user?.twitter || user?.farcaster) && (
            <div className='flex flex-col gap-y-2 md:flex-row md:gap-x-2 mb-2'>
                {user?.twitter && (
                    <button
                        onClick={() => handleUnlink('Twitter')}
                        className='w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-red-700 transition-colors'
                    >
                        Unlink Twitter
                    </button>
                )}
                {user?.farcaster && (
                    <button
                        onClick={() => handleUnlink('Farcaster')}
                        className='w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
                    >
                        Unlink Farcaster
                    </button>
                )}
            </div>
        )
    );
};

export default UnlinkAccounts;
