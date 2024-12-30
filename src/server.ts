import fastify from "fastify";

const app = fastify();

app.get("/", async (request, reply) => {
  reply.send({ message: "Service is running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Service running on http://localhost:${PORT}`);
});