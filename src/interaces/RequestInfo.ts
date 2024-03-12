interface RequestInfo {
    method: string;
    path: string;
    query: Record<string, string>;
    headers: Record<string, string>;
    body: Buffer;
}

export type FlatRequestInfo = Omit<RequestInfo, 'query' | 'headers'>;

export interface RequestInfoWithId extends RequestInfo {
    id: number;
}

export default RequestInfo;
