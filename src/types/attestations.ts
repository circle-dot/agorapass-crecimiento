export interface Attestation {
    id: string;
    data: string;
    decodedDataJson: string;
    recipient: string;
    attester: string;
    timeCreated: number;
    revoked: boolean;
    txid: string;
    __typename: string;
}
