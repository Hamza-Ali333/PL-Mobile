export default function firstChar(s) {

	if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase();
}