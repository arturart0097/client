import { BaseResponseError } from "../base-response";

export interface ReportsColumn {
    name: string;
    data: string;
}

export interface ReportsPostData {
    itemUID?: string;
    data?: Record<string, string>[];
    format?: string;
    columns?: ReportsColumn[];
}

export interface ReportCollection {
    created: string;
    description: string;
    index: number;
    itemuid: string;
    name: string;
    updated: string;
}

export interface ReportCollectionContent {
    [x: string]: {};
    accessed: string;
    created: string;
    description: string;
    index: number;
    isfavorite: 0 | 1;
    itemUID: string;
    name: string;
    updated: string;
    userUID: string;
    documents: IDocument[];
}

export interface ReportCollectionResponse extends BaseResponseError {
    collections: ReportCollection[];
}

export interface ReportDocument {
    [x: string]: any;
    description: string;
    index: number;
    itemuid: string;
    name: string;
    state: string;
    type: string;
    version: string;
}

export interface IDocument {
    accessed: string;
    count: number;
    created: string;
    documentUID: string;
    index: number;
    isfavorite: number;
    itemUID: string;
    name: string;
    updated: string;
}

export interface ReportsListResponse extends BaseResponseError {
    documents: ReportDocument[];
}
