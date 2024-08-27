"use client";
import React from 'react';
import { useInView } from 'react-intersection-observer';
import useUsers from '@/hooks/useUsers';
import UserCard from '@/components/ui/users/UserCard';
import { Button } from '@/components/ui/button';
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Card, CardHeader } from "@/components/ui/card";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { Skeleton } from '@/components/ui/skeleton';
import {
    useEffect, useMemo, useState
} from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Search } from "lucide-react";
import SearchBar from '@/components/ui/users/searchBar';
const filters = [
    {
        valueFilter: "desc" as const,
        label: "Order by: Desc",
    },
    {
        valueFilter: "asc" as const,
        label: "Order by: Asc",
    },
]

function Page() {
    const [openFilter, setOpenFilter] = useState(false);
    const [valueFilter, setValueFilter] = useState<'asc' | 'desc'>("desc");
    const [searchQuery, setSearchQuery] = useState<string>("");


    const debouncedSearchQuery = useMemo(
        () => debounce((query: string) => setSearchQuery(query), 300),
        []
    );

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useUsers(valueFilter, searchQuery);
    const { ref, inView } = useInView();

    useEffect(() => {
        const handleFetchNextPage = () => {
            if (inView && hasNextPage) {
                fetchNextPage();
            }
        };

        const debounceFetch = debounce(handleFetchNextPage, 300);
        debounceFetch();

        return () => {
            debounceFetch.cancel();
        };
    }, [inView, fetchNextPage, hasNextPage]);
    return (
        <div className='flex flex-col w-full p-4'>
            <div className='flex flex-col md:flex-row md:justify-center md:items-center gap-4 p-4'>
                <div className="relative w-full md:w-[300px]">
                    <input
                        type="text"
                        placeholder="Search by name"
                        onChange={(e) => debouncedSearchQuery(e.target.value)}
                        className="border p-2 rounded-md w-full"
                    />
                </div>
                <Dialog>
                    <DialogTrigger asChild><Button variant="outline"><Search className="pr-0.5 h-4 w-4 text-muted-foreground" />On-chain search</Button></DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Want to vouch for a user that is not in the app yet? Looking for a specific vouch?</DialogTitle>
                            <DialogDescription className='flex items-center justify-center flex-col gap-y-2 pt-2'>
                                <p>Write here the <b className='font-bold'>Address/Vouch Id</b>  and we will find it!</p>
                                <SearchBar />
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>

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
                            <CommandList>
                                <CommandGroup>
                                    {filters.map((filter) => (
                                        <CommandItem
                                            key={filter.valueFilter}
                                            value={filter.valueFilter}
                                            onSelect={(currentValueFilter) => {
                                                setValueFilter(currentValueFilter as 'asc' | 'desc');
                                                setOpenFilter(false);
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

            <div className='flex flex-col justify-center'>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
                    {isLoading ? (
                        Array(12).fill({}).map((i, key) => {
                            return (
                                <Card className="w-full" key={key}>
                                    <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">

                                        <div className="flex justify-center items-center space-x-4">
                                            <Skeleton className="h-12 w-12 rounded-full" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-[250px]" />
                                                <Skeleton className="h-4 w-[200px]" />
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            )
                        })
                    ) : (
                        <>
                            {data?.pages.map((page, i) =>
                                page.users.map((user: any, index: number) => (
                                    <UserCard key={`${i}-${index}`} user={user} />
                                ))
                            )}
                        </>
                    )}
                </div>
                <div ref={ref}>
                    {isFetchingNextPage &&
                        <div className="flex items-start justify-start space-x-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>}
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
