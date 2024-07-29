import { z } from "zod";

// Define the Zod schema for the attestation
export const attestationSchema = z.object({
  id: z.string(),  // UID
  attester: z.string(),  // From
  recipient: z.string(),  // To
  timeCreated: z.number(),  // Time when the attestation was created
  revocable: z.boolean(),
  revocationTime: z.number(),  // timestamp in milliseconds
  expirationTime: z.number(),  // timestamp in milliseconds
  data: z.string(),  // Data field
});

// Define the TypeScript type based on the schema
export type Attestation = z.infer<typeof attestationSchema>;
