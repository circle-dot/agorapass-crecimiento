async function generateAttestation(token: string, attester: string, signature: string, nullifier:any) {
    const url = '/api/zupass/createAttestation';

    const body = JSON.stringify({
        attester,
        signature,
        nullifier
    });

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
        body: body
    });

    if (!response.ok) {
            // Throw a general error
            throw new Error(`Error creating attestation: ${response.statusText}`);
    }


    return await response.json();
}

export default generateAttestation;
