'use server';
// add to cart, Order now, change quantities, place the order.
// (Server Action concept: see lib/form.ts.)
// The cart is kept in the database by the backend, and its items are RESERVED:
// every change moves the product's stock too (add 1 -> stock -1). After each

import { redirect } from 'next/navigation';
import { getCurrentUser, requireCustomer } from '@/lib/auth';
import { attempt, readQuantities, type FormState } from '@/lib/form';
import { refreshShop } from '@/lib/revalidate';
import { CHECKOUT_PATH, loginPath, orderPath, productPath } from '@/lib/routes';
import {
  addCartItem,
  checkoutCart as checkoutCartApi,
  getCart,
  setCartQuantity,
} from '@/services/cart.service';
import { countItems } from '@/types/cart';

// The check every "add" action needs: visitors -> /login (then back to the product); admins -> error.
async function checkShopper(productId: string): Promise<FormState> {
  // The real check lives HERE, on the server (hiding the button is not enough: anyone can send the form).
  const user = await getCurrentUser();//means checking the cookie 
  if (!user) redirect(loginPath(productPath(productId)));
  if (user.role === 'admin') return { error: 'Admins cannot add products to a cart' };
}

// 
export async function addToCart(productId: string): Promise<FormState> {
  const denied = await checkShopper(productId);
  if (denied) return denied;

  // The backend reserves one (stock -1) and answers with the whole cart.
  const result = await attempt(() => addCartItem(productId), 'Could not add this product');
  if (!result.ok) return result.state; // if the item is sold out 

  refreshShop(); // new stock + new cart count everywhere
  // How many of THIS product are now in the cart (".find" = the first line that matches).
  const inCart = result.data.find((line) => line.productId === productId)?.quantity ?? 0;
  return { success: `Added to cart (${inCart} in cart)` };
}

// "Order now" (product page): add one, then go straight to checkout.
export async function buyNow(productId: string): Promise<FormState> {
  const denied = await checkShopper(productId);
  if (denied) return denied;

  const result = await attempt(() => addCartItem(productId), 'Could not add this product');
  if (!result.ok) return result.state;

  refreshShop();//updates the stock numbers and the little cart counter at the top of the website
  redirect(CHECKOUT_PATH);//takes the user to the Checkout page 
}

// change the number on the cart page 
export async function updateCart(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireCustomer(); // visitors -> /login, admins -> /admin
  const current = await getCart();
  let changed = 0;

  for (const { productId, quantity } of readQuantities(formData, true)) {
    //helper function that scans all the HTML inputs from the cart form and turns them into a neat list (array) of objects, like
    const line = current.find((item) => item.productId === productId);
    // Only products already in the cart (a tampered form can't add strangers), and only real changes.
    if (!line || line.quantity === quantity) continue;
    //If the item isn't really in their cart, or if the number didn't actually change, skip it so we don't waste time updating it
    const result = await attempt(() => setCartQuantity(productId, quantity), 'Could not update the cart');
    if (!result.ok) {
      if (changed > 0) refreshShop(); // earlier lines already changed -> show them
      return result.state; // e.g. 'Only 3 more "Laptop Stand" in stock'
    }
    changed++;
  }
  //logic not understood 


  // Nothing changed -> no message at all (undefined = the form shows nothing).
  if (changed === 0) return undefined;

  refreshShop();
  // "1 item" / "3 items"
  const count = countItems(await getCart());
  return { success: `Cart updated (${count} ${count === 1 ? 'item' : 'items'})` };
}

// Checkout page "Place order": the whole cart becomes one order (stock was already reserved).
export async function checkoutCart(): Promise<FormState> {
  await requireCustomer();
  const result = await attempt(() => checkoutCartApi(), 'Could not place the order');
  if (!result.ok) return result.state; // e.g. "Your cart is empty"

  refreshShop(); // empty cart in the header; the new order on the dashboard
  redirect(orderPath(result.data.id)); // the new order's page (Pay is there)
}
