import { ofetch } from "ofetch";

export type ObjektMetadata = {
  name: string;
  description: string;
  image: string;
  background_color: string;
  objekt: {
    collectionId: string;
    season: string;
    member: string;
    collectionNo: string;
    class: string;
    artists: string[];
    thumbnailImage: string;
    frontImage: string;
    backImage: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    comoAmount: number;
    tokenId: string;
    objektNo: number;
    tokenAddress: string;
    transferable: boolean;
  };
};

/**
 * Fetch token metadata from Cosmo with retries.
 * Retries on codes that may have valid responses, but not 404.
 */
export async function fetchMetadataFromCosmo(tokenId: string) {
  return await ofetch<ObjektMetadata>(
    `https://api.cosmo.fans/objekt/v1/token/${tokenId}`,
    {
      onResponse({ response, options }) {
        if (response.status === 404) {
          options.ignoreResponseError = true;
        }
      },
      retry: 10,
      retryDelay: 3500, // 500ms backoff
    }
  );
}
