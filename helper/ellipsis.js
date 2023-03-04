export default function ellipsis(s, limit) {

    if (typeof s !== "string") return "";
    if(s.length>limit)
        return s.substring(0,limit-3)+'...';
    else
    return s;
}