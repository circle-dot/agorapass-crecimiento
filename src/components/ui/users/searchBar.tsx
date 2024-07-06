import React, { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import client from "@/lib/ApolloClient";

const SEARCH_ENS_NAMES = gql`
  query SearchEnsNames($query: String!) {
    ensNames(where: { name: { contains: $query } }) {
      name
    }
  }
`;

const SEARCH_ATTESTATIONS = gql`
  query SearchAttestations($query: String!) {
    attestations(where: { id: { contains: $query } }) {
      id
      recipient
    }
  }
`;

const SEARCH_WALLETS = gql`
  query SearchWallets($query: String!) {
    attestations(where: { recipient: { contains: $query } }) {
      recipient
      id
    }
  }
`;

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedQuery, setSelectedQuery] = useState("ENS Names");

    const { loading: loadingEns, error: errorEns, data: dataEns } = useQuery(SEARCH_ENS_NAMES, {
        variables: { query: searchTerm },
        client,
        skip: !searchTerm || selectedQuery !== "ENS Names",
    });

    const { loading: loadingAttestations, error: errorAttestations, data: dataAttestations } = useQuery(SEARCH_ATTESTATIONS, {
        variables: { query: searchTerm },
        client,
        skip: !searchTerm || selectedQuery !== "Attestations",
    });

    const { loading: loadingWallets, error: errorWallets, data: dataWallets } = useQuery(SEARCH_WALLETS, {
        variables: { query: searchTerm },
        client,
        skip: !searchTerm || selectedQuery !== "Wallet Addresses",
    });

    useEffect(() => {
        if (selectedQuery === "ENS Names" && dataEns) {
            setSearchResults(dataEns.ensNames.map((ensName: any) => ({
                name: ensName.name,
            })));
        } else if (selectedQuery === "Attestations" && dataAttestations) {
            setSearchResults(dataAttestations.attestations.map((attestation: any) => ({
                id: attestation.id,
                recipient: attestation.recipient,
            })));
        } else if (selectedQuery === "Wallet Addresses" && dataWallets) {
            // Use a Set to ensure unique wallet addresses
            const uniqueWallets = Array.from(new Set(dataWallets.attestations.map((wallet: any) => wallet.recipient)));
            setSearchResults(uniqueWallets.map((wallet: any) => ({
                recipient: wallet,
            })));
        }
    }, [dataEns, dataAttestations, dataWallets, selectedQuery]);

    return (
        <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search ENS Names, Attestations, or Wallet Addresses..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
                onChange={(e) => setSelectedQuery(e.target.value)}
                className="absolute top-10 left-0 p-2 border border-gray-300 rounded"
            >
                <option value="ENS Names">ENS Names</option>
                <option value="Attestations">Attestations</option>
                <option value="Wallet Addresses">Wallet Addresses</option>
            </select>
            {searchTerm && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                    {(loadingEns || loadingAttestations || loadingWallets) && <p>Loading...</p>}
                    {(errorEns || errorAttestations || errorWallets) && <p>Error: {errorEns?.message || errorAttestations?.message || errorWallets?.message}</p>}
                    {searchResults.map((result, index) => (
                        <div key={index} className="p-2 hover:bg-gray-200">
                            {selectedQuery === "ENS Names" ? (
                                <p>ENS Name: {result.name}</p>
                            ) : selectedQuery === "Attestations" ? (
                                <>
                                    <p>Attestation ID: {result.id}</p>
                                </>
                            ) : (
                                <p>Wallet Address: {result.recipient}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
