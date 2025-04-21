export interface CalculateScreenerResultResponse {
    readonly results: string[];
}
export interface ScreenerQuestion {
    readonly questionId: string;
    readonly title: string;
}

export interface ScreenerAnswer {
    readonly title: string;
    readonly value: number;
}

export interface ScreenerSection {
    readonly type: "standard"; // TODO: Add other types
    readonly title: string;
    readonly questions: ScreenerQuestion[];
    readonly answers: ScreenerAnswer[];
}

export interface ScreenerContent {
    readonly sections: ScreenerSection[];
    readonly displayName: string;
}


export interface Screener {
    readonly id: string;
    readonly name: string;
    readonly disorder: string;
    readonly content: ScreenerContent
}