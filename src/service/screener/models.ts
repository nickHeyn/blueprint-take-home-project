export interface CalculateScreenerResultResponse {
    readonly results: string[];
}


export interface Screener {
    readonly id: string;
    readonly name: string;
    readonly disorder: string;
}