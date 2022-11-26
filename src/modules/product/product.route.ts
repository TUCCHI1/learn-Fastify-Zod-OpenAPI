import { FastifyInstance } from "fastify";
import { $ref } from "./product.schema";
import { getProductHandler } from "./product.controller";
const productRoutes = async (server: FastifyInstance) => {
  server.post("/", {
    schema: {
      body: $ref("createProductBodySchema"),
      response: {
        201: { ...$ref("productResponseSchema"), description: "登録完了" },
      },
      tags: ["Product"],
    },
    handler: getProductHandler,
  });
};

export default productRoutes;
