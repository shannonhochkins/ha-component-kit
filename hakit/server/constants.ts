export const PORT = process.env.PORT || 2022;
export const OPTIONS = process.env.OPTIONS || `${process.cwd()}/server/options.json`;

export const OUTPUT_DIR = process.env.NODE_ENV === 'production' ? '/config' : `${process.cwd()}/config`