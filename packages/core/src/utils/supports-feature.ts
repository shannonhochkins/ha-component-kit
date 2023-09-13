export const supportsFeatureFromAttributes = (
  attributes: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  },
  feature: number,
): boolean => (attributes.supported_features! & feature) !== 0;
