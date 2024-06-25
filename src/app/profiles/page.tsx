"use client"
import * as React from "react"
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
import { users } from '../../fakeData/data'

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
    const [valueSort, setValueSort] = React.useState("")
    return (
        <div className='flex flex-col'>
            <div className='flex flex-col md:flex-row md:justify-center md:items-center gap-4 p-4'>

                <form className="">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search users..."
                            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                        />
                    </div>
                </form>


                <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="outline">Filters</Button></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                {users.map((user, index) => (
                    <UserCard key={index} user={user} />
                ))}
            </div>
        </div>
    );
}

export default Page;


