import { setupWorker } from "msw/browser";
import { HttpResponse, delay, http } from "msw";

const groceryList = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Banana" },
  { id: 3, name: "Cherry" },
  { id: 4, name: "Date" },
  { id: 5, name: "Elderberry" },
  { id: 6, name: "Fig" },
  { id: 7, name: "Grape" },
  { id: 8, name: "Honeydew" },
  { id: 9, name: "Jackfruit" },
  { id: 10, name: "Kiwi" },
  { id: 11, name: "Lemon" },
  { id: 12, name: "Mango" },
  { id: 13, name: "Nectarine" },
  { id: 14, name: "Orange" },
  { id: 15, name: "Papaya" },
  { id: 16, name: "Quince" },
  { id: 17, name: "Raspberry" },
  { id: 18, name: "Strawberry" },
  { id: 19, name: "Tangerine" },
  { id: 20, name: "Ugli" },
  { id: 21, name: "Vanilla" },
  { id: 22, name: "Watermelon" },
  { id: 23, name: "Xylocarp" },
  { id: 24, name: "Yuzu" },
  { id: 25, name: "Zucchini Genovesi" },
];

const cart: typeof groceryList = [];

export const worker = setupWorker(
  http.get(
    "/api/list",
    async () => {
      await delay(1200);

      return HttpResponse.json(
        {
          data: { error: "Server is under mainteinance, please retry" },
          status: "error",
        },
        { status: 500 }
      );
    },
    { once: true }
  ),
  http.get("/api/list", async ({ request }) => {
    const kind = new URL(request.url).searchParams.get("kind");

    console.log("kind", kind);

    await delay(1200);

    if (kind === "fruits") {
      return HttpResponse.json({
        data: [
          { id: 1, name: "Apple" },
          { id: 2, name: "Banana" },
          { id: 3, name: "Cherry" },
          { id: 4, name: "Date" },
          { id: 5, name: "Elderberry" },
          { id: 6, name: "Fig" },
          { id: 7, name: "Grape" },
          { id: 8, name: "Honeydew" },
          { id: 9, name: "Jackfruit" },
          { id: 10, name: "Kiwi" },
        ],
        status: "success",
      });
    }

    return HttpResponse.json({ data: groceryList, status: "success" });
  }),
  http.get(
    "/api/cart",
    async () => {
      await delay(1200);

      return HttpResponse.error();
    },
    { once: true }
  ),
  http.get("/api/cart", async () => {
    await delay(1200);

    return HttpResponse.json({ data: cart, status: "success" });
  }),
  http.put("/api/cart", async ({ request }) => {
    const data = await request.json();
    await delay(8000);

    if (typeof data !== "number") {
      return HttpResponse.json(
        { data: { error: "Invalid item ID" }, status: "error" },
        { status: 400 }
      );
    }

    const newItem = groceryList.find((item) => item.id === data);
    if (!newItem) {
      return HttpResponse.json(
        { data: { error: "Item not found" }, status: "error" },
        { status: 404 }
      );
    }

    cart.push(newItem);

    return HttpResponse.json({ data: cart, status: "success" });
  })
);
