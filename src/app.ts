import fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import fs from "fs";
import { withRefResolver } from "fastify-zod";
import { productSchemas } from "./modules/product/product.schema";
import productRoutes from "./modules/product/product.route";
import { fstat } from "fs";

export const server = fastify({
  logger: true,
  ajv: {
    customOptions: {
      strict: "log",
      keywords: ["exsample"],
    },
  },
});

// Fastify serverの起動
const main = async () => {
  for (const schema of productSchemas) {
    server.addSchema(schema);
  }

  server.register(
    swagger,
    withRefResolver({
      openapi: {
        info: {
          title: "Sample API using Fastify and Zod.",
          description:
            "ZodのバリデーションスキーマからリッチなOpenAPI仕様を出力するサンプル",
          version: "1.0.0",
        },
      },
    })
  );

  server.register(swaggerUI, {
    routePrefix: "/docs",
    staticCSP: true,
  });

  server.register(productRoutes, { prefix: "/products" });

  try {
    await server.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Server listening on port 3000");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  const responseYaml = await server.inject("/docs/yaml");
  fs.writeFileSync("docs/openapi.yaml", responseYaml.payload);
};
main();
