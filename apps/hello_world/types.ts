import { JSON } from '@klave/sdk';

// @ts-ignore
@serializable
export class ErrorMessage {
    success!: boolean;
    message!: string;
}

// @ts-ignore
@serializable
export class FetchInput {
    key!: string;
}

// @ts-ignore
@serializable
export class FetchOutput {
    success!: boolean;
    value!: string;
}

// @ts-ignore
@serializable
export class StoreInput {
    key!: string;
    value!: string;
}

// @ts-ignore
@serializable
export class StoreOutput {
    success!: boolean;
}
