async function generateAttestation(token: string, power: string, endorsementType: string, platform: string, recipient: string, attester: string, signature: string) {
    const url = '/api/createAttestation';


    const body = JSON.stringify({
        power: power,
        endorsementType: endorsementType,
        platform: platform,
        wallet: recipient,
        attester,
        signature
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
        if (response.status === 550) {
            throw new Error('550');
        } else {
            // Throw a general error for other status codes
            throw new Error(`Error creating attestation: ${response.statusText}`);
        }
    }

    return await response.json();
}

export default generateAttestation;
