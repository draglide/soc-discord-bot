export interface BaseSession {
    timestamp: number;
}

export type PageSessionData<TResult, TMeta = unknown> = BaseSession & {
    results: TResult[];
    meta?: TMeta;
};