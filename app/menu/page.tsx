import { getProductsServer } from "@/lib/product-service";
import MenuPage from "../../menu-page";

export default async function Page() {
  try {
    const { products } = await getProductsServer();
    return <MenuPage initialProducts={products || []} />;
  } catch (err) {
    console.error("Exception in menu page:", err);
    // Return the menu page with no initial products
    // It will handle loading its own data on the client side
    return <MenuPage initialProducts={[]} />;
  }
}
