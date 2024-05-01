import { CartItem } from "@/types/cart";
import { OrderAddon, OrderItem } from "@/types/order";
import { Addon, Menu, Order, Table } from "@prisma/client";

export const getCartTotalPrice = (cart: CartItem[]) => {
  const totalPrice = cart.reduce((prev, curr) => {
    const menuPrice = curr.menu.price;
    const totalAddonPrice = curr.addons.reduce(
      (addonPrice, addon) => (addonPrice += addon.price),
      0
    );
    prev += (menuPrice + totalAddonPrice) * curr.quantity;
    return prev;
  }, 0);
  return totalPrice;
};

export const formatOrders = (
  orders: Order[],
  addons: Addon[],
  menus: Menu[],
  tables: Table[]
): OrderItem[] => {
  const orderItemIds: string[] = [];
  orders.forEach((order) => {
    const itemId = order.itemId;
    const exist = orderItemIds.find((orderItemId) => orderItemId === itemId);
    if (!exist) orderItemIds.push(itemId);
  });
  const orderItems: OrderItem[] = orderItemIds.map((orderItemId) => {
    const currentOrders = orders.filter(
      (order) => order.itemId === orderItemId
    );
    const addonIds = currentOrders.map((item) => item.addonId);
    let orderAddons: OrderAddon[] = [];
    addonIds.forEach((addonId) => {
      const addon = addons.find((item) => item.id === addonId) as Addon;
      if (!addon) return;
      const exist = orderAddons.find(
        (item) => item.addonCategoryId === addon.addonCategoryId
      );
      if (exist) {
        orderAddons = orderAddons.map((item) => {
          const isSameParent = item.addonCategoryId === addon.addonCategoryId;
          if (isSameParent) {
            return {
              addonCategoryId: addon.addonCategoryId,
              addons: [...item.addons, addon].sort((a, b) =>
                a.name.localeCompare(b.name)
              ),
            };
          } else {
            return item;
          }
        });
      } else {
        orderAddons = [
          ...orderAddons,
          {
            addonCategoryId: addon.addonCategoryId,
            addons: [addon].sort((a, b) => a.name.localeCompare(b.name)),
          },
        ];
      }
    });

    return {
      itemId: orderItemId,
      status: currentOrders[0].status,
      orderAddons: orderAddons.sort(
        (a, b) => a.addonCategoryId - b.addonCategoryId
      ),
      menu: menus.find((item) => item.id === currentOrders[0].menuId) as Menu,
      table: tables.find(
        (item) => item.id === currentOrders[0].tableId
      ) as Table,
    };
  });
  return orderItems.sort((a, b) => a.itemId.localeCompare(b.itemId));
};

//localeCompare is used when the string is compared
//a - b is used when the number is compared
