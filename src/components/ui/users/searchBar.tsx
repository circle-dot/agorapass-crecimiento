"use client";
import React, { useState, useEffect, useMemo } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import client from "@/lib/ApolloClient";
import Link from 'next/link';
import SEARCH_ENS_NAMES from "@/graphql/searchBar/searchENSName";
import SEARCH_WALLETS from "@/graphql/searchBar/searchWallets";
import SEARCH_ATTESTATIONS from "@/graphql/searchBar/searchAttestation";
import debounce from 'lodash.debounce';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const [searchEnsNames, { loading: loadingEns, error: errorEns, data: dataEns }] = useLazyQuery(SEARCH_ENS_NAMES, { client });
    const [searchAttestations, { loading: loadingAttestations, error: errorAttestations, data: dataAttestations }] = useLazyQuery(SEARCH_ATTESTATIONS, { client });
    const [searchWallets, { loading: loadingWallets, error: errorWallets, data: dataWallets }] = useLazyQuery(SEARCH_WALLETS, { client });

    const debouncedSearch = useMemo(() =>
        debounce((term) => {
            if (term) {
                searchEnsNames({ variables: { query: term } });
                searchAttestations({ variables: { query: term } });
                searchWallets({ variables: { query: term } });
            }
        }, 500), [searchEnsNames, searchAttestations, searchWallets]);

    useEffect(() => {
        debouncedSearch(searchTerm);
    }, [searchTerm, debouncedSearch]);

    useEffect(() => {
        const results = new Map();

        if (dataEns) {
            dataEns.ensNames.forEach((ensName: any) => {
                results.set(ensName.id.toLowerCase(), {
                    type: "ENS Name",
                    value: ensName.name,
                    id: ensName.id.toLowerCase(),
                });
            });
        }

        if (dataAttestations) {
            dataAttestations.attestations.forEach((attestation: any) => {
                results.set(attestation.id.toLowerCase(), {
                    type: "Attestation ID",
                    value: attestation.id,
                    recipient: attestation.recipient.toLowerCase(),
                });
            });
        }

        if (dataWallets) {
            const uniqueWallets = Array.from(new Set(dataWallets.attestations.map((wallet: any) => wallet.recipient.toLowerCase())));
            uniqueWallets.forEach((wallet: any) => {
                results.set(wallet, {
                    type: "Wallet Address",
                    value: wallet,
                });
            });
        }

        setSearchResults(Array.from(results.values()));
    }, [dataEns, dataAttestations, dataWallets]);

    const getLinkForResult = (result: any) => {
        if (result.type === "Wallet Address") {
            return `/agora/address/${result.value}`;
        } else if (result.type === "ENS Name") {
            return `/agora/address/${result.id}`;
        } else if (result.type === "Attestation ID") {
            return `/agora/attestation/${result.value}`;
        }
        return "#";
    };

    return (
        <div className="relative sm:w-[300px] md:w-[200px] lg:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search ENS Names, Wallets or Attestations..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                    {(loadingEns || loadingAttestations || loadingWallets) && <p>Loading...</p>}
                    {(errorEns || errorAttestations || errorWallets) && (
                        <p>Error: {errorEns?.message || errorAttestations?.message || errorWallets?.message}</p>
                    )}
                    {searchResults.map((result, index) => (
                        <Link key={index} href={getLinkForResult(result)} passHref>
                            <p className="block p-2 hover:bg-gray-200 truncate">
                                <p>
                                    {result.value}
                                </p>

                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
