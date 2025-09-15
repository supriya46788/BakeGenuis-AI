/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { RequestOptions } from '../types';
import { ApiSettings } from '../types/internal';
export declare enum Task {
    GENERATE_CONTENT = "generateContent",
    STREAM_GENERATE_CONTENT = "streamGenerateContent",
    COUNT_TOKENS = "countTokens",
    PREDICT = "predict"
}
export declare class RequestUrl {
    model: string;
    task: Task;
    apiSettings: ApiSettings;
    stream: boolean;
    requestOptions?: RequestOptions | undefined;
    constructor(model: string, task: Task, apiSettings: ApiSettings, stream: boolean, requestOptions?: RequestOptions | undefined);
    toString(): string;
    private get baseUrl();
    private get apiVersion();
    private get modelPath();
    private get queryParams();
}
export declare class WebSocketUrl {
    apiSettings: ApiSettings;
    constructor(apiSettings: ApiSettings);
    toString(): string;
    private get pathname();
}
export declare function getHeaders(url: RequestUrl): Promise<Headers>;
export declare function constructRequest(model: string, task: Task, apiSettings: ApiSettings, stream: boolean, body: string, requestOptions?: RequestOptions): Promise<{
    url: string;
    fetchOptions: RequestInit;
}>;
export declare function makeRequest(model: string, task: Task, apiSettings: ApiSettings, stream: boolean, body: string, requestOptions?: RequestOptions): Promise<Response>;
