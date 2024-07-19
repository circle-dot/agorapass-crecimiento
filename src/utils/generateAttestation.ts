async function generateAttestation(token: string, power: string, endorsementType: string, platform: string, wallet: string) {
    const url = '/api/createAttestation';


    const body = JSON.stringify({
        power: power,
        endorsementType: endorsementType,
        platform: platform,
        wallet: wallet
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
        throw new Error(`Error creating attestation: ${response.statusText}`);
    }

    return await response.json();
}

export default generateAttestation;
