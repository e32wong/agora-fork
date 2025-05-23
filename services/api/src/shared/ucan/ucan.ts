/** **** WARNING: GENERATED FROM SHARED DIRECTORY, DO NOT MOFIFY THIS FILE DIRECTLY! **** **/
export function httpUrlToResourcePointer(url: URL | string): {
    scheme: string;
    hierPart: string;
} {
    let urlVal: URL;
    if (url instanceof URL) {
        urlVal = url;
    } else {
        urlVal = new URL(url);
    }
    const scheme = "https";
    const hierPart = `//agoracitizen.network${urlVal.pathname}`;
    return { scheme, hierPart };
}

export function httpPathnameToResourcePointer(pathname: string): {
    scheme: string;
    hierPart: string;
} {
    const scheme = "https";
    const hierPart = `//agoracitizen.network${pathname}`;
    return { scheme, hierPart };
}

export function httpMethodToAbility(method: string) {
    return { namespace: "http", segments: [method.toUpperCase()] };
}
