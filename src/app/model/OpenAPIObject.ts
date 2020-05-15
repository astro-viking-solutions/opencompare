export interface OpenAPIObject {
  openapi: string;
  info: InfoObject;
  paths;
}

export interface InfoObject {
    title: string;
    version: string;
}

export interface PathObject {
  $ref: string;
}
