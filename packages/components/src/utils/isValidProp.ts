import isValidHtmlProp from "@emotion/is-prop-valid";

const ALLOWED_PROPS = ["layoutId", "whileTap"];
export const isValidProp = (prop: string) => isValidHtmlProp(prop) || ALLOWED_PROPS.includes(prop);
