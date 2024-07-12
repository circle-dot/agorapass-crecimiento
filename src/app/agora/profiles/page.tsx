"use client"
import React from 'react';
import { useInView } from 'react-intersection-observer';
import useUsers from '@/hooks/useUsers';
import UserCard from '@/components/ui/users/UserCard';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import SearchBar from "@/components/ui/users/searchBar";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import Image from 'next/image';
import voteLogo from '@/../../public/vote.svg'
const filters = [
    {
        valueFilter: "Filter1",
        label: "Order by: Des",
    },
    {
        valueFilter: "Filter2",
        label: "Order by: Asc",
    },
]


function Page() {
    const [openFilter, setOpenFilter] = React.useState(false)
    const [valueFilter, setValueFilter] = React.useState("")
    const [openSort, setOpenSort] = React.useState(false)
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useUsers();
    const { ref, inView } = useInView();

    React.useEffect(() => {
        const handleFetchNextPage = () => {
            if (inView && hasNextPage) {
                console.log('Fetching next page...');
                fetchNextPage();
            }
        };

        // Debounce function to avoid rapid calls
        const debounceFetch = debounce(handleFetchNextPage, 300);
        debounceFetch();

        return () => {
            debounceFetch.cancel();
        };
    }, [inView, fetchNextPage, hasNextPage]);

    return (
        <div className='flex flex-col w-full p-4'>
            <div className='flex flex-col md:flex-row md:justify-center md:items-center gap-4 p-4'>

                <div className="relative">
                    <SearchBar />
                </div>


                <Popover open={openFilter} onOpenChange={setOpenFilter}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openFilter}
                            className="w-[200px] justify-between"
                        >
                            {valueFilter
                                ? filters.find((filter) => filter.valueFilter === valueFilter)?.label
                                : "Order by:"}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            {/* <CommandInput placeholder="Order by..." className="h-9" /> */}
                            <CommandList>
                                {/* <CommandEmpty>No filter found.</CommandEmpty> */}
                                <CommandGroup>
                                    {filters.map((filter) => (
                                        <CommandItem
                                            key={filter.valueFilter}
                                            value={filter.valueFilter}
                                            onSelect={(currentvalueFilter) => {
                                                setValueFilter(currentvalueFilter === valueFilter ? "" : currentvalueFilter)
                                                setOpenFilter(false)
                                            }}
                                        >
                                            {filter.label}
                                            <CheckIcon
                                                className={cn(
                                                    "ml-auto h-4 w-4",
                                                    valueFilter === filter.valueFilter ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>



            </div>
            <div className="flex flex-col md:flex-row w-full">
                <div className="w-full md:w-1/2 p-2">
                    <h2 className='font-extrabold text-xl pb-6'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquid, iure.</h2>
                    <p>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eveniet placeat, in ipsum delectus ab ad quam eaque velit, autem earum, fugiat dicta quos quas neque labore quasi error ea molestiae!
                    </p>
                </div>
                <div className="w-full md:w-1/2 p-2">
                    <Image
                        src={voteLogo}
                        alt='Thinking about voting'
                        width={100}
                        className='w-full max-h-[200px]'
                    />
                </div>
            </div>


            <div className='flex flex-col justify-center items-center'>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
                    {data?.pages.map((page, i) =>
                        page.users.map((user: any, index: number) => (
                            <UserCard key={`${i}-${index}`} user={user} />
                        ))
                    )}
                </div>
                <div ref={ref}>
                    {isFetchingNextPage && <p>Loading more...</p>}
                </div>
            </div>
        </div>
    );
}

// Debounce function implementation
function debounce(func: (...args: any[]) => void, wait: number) {
    let timeout: NodeJS.Timeout | null;
    const debounced = (...args: any[]) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(null, args);
        }, wait);
    };
    debounced.cancel = () => {
        if (timeout) clearTimeout(timeout);
    };
    return debounced;
}

export default Page;
