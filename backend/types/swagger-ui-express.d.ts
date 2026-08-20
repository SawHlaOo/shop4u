declare module "swagger-ui-express" {
  const swaggerUi: {
    serve: import("express").RequestHandler[];
    setup: (
      swaggerDocument: unknown,
      options?: Record<string, unknown>,
      customCss?: string,
      customfavIcon?: string,
      swaggerUrl?: string,
    ) => import("express").RequestHandler;
  };

  export = swaggerUi;
}