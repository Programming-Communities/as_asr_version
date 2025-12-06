declare module 'graphql-request' {
  export class GraphQLClient {
    constructor(url: string, options?: any);
    request<T = any>(query: string, variables?: any): Promise<T>;
  }
  
  export function gql(strings: TemplateStringsArray, ...values: any[]): string;
}