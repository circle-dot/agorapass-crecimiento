"use client";
import React from 'react';
import { useInView } from 'react-intersection-observer';
import useRankings from '@/hooks/useRankings';
import { Button } from '@/components/ui/button';
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const filters = [
    { valueFilter: "desc", label: "Order by: Desc" },
    { valueFilter: "asc", label: "Order by: Asc" },
];

function Page() {
    const [openFilter, setOpenFilter] = useState(false);
    const [valueFilter, setValueFilter] = useState<'asc' | 'desc'>("asc");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useRankings(valueFilter, searchQuery);
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
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ranking
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Address
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Value
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                Array.from({ length: 12 }).map((_, key) => (
                                    <tr key={key}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Skeleton className="h-4 w-[250px]" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Skeleton className="h-4 w-[250px]" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Skeleton className="h-4 w-[200px]" />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <>
                                    {data?.pages.flatMap((page, i) =>
                                        page.rankings.map((ranking: any) => (
                                            <tr key={ranking.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {ranking.position}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Link href={'/address/' + ranking.address}>{ranking.address}</Link>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {ranking.value}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
                <div ref={ref}>
                    {isFetchingNextPage && (
                        <div className="flex items-start justify-start space-x-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    )}
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
