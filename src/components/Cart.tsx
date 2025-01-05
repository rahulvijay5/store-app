import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CartItem } from "../types";

interface CartProps {
  cart: CartItem[];
  total: number;
  totalWeight: number;
  pickupDate: Date | null;
}

const Cart: React.FC<CartProps> = ({
  cart,
  total,
  totalWeight,
  pickupDate,
}) => {
  return (
    <View style={styles.container} className="border">
      <Text style={styles.title}>Cart</Text>
      <View style={styles.item}>
              <Text
                className={"font-semibold text-lg"}
              >Product</Text>
              <View className="w-3/5 flex flex-row justify-between">
              <Text
                className={`font-semibold text-lg`}
              >Quantity</Text>
              <Text
                className={`font-semibold text-lg`}
              >Weight</Text>
              <Text
                className={`font-semibold text-lg`}
              >Price</Text>
              </View>
            </View>
      {cart.map(
        (item, index) =>
          item.quantity > 0 && (
            <View key={index} style={styles.item} className="w-full">
              <Text
                className={`${
                  item.type == "Regular"
                    ? "text-emerald-700"
                    : "text-yellow-600"
                } font-semibold text-lg w-2/5`}
              >{`${item.type} ${item.size=="1000gm"?"1kg":item.size}`}</Text>
              <View className="w-3/5 flex flex-row justify-between "><Text
                className={`${
                  item.type == "Regular"
                    ? "text-emerald-700"
                    : "text-yellow-600"
                } font-semibold text-lg text-center`}
              >{`${item.quantity}`}</Text>
              <Text
                className={`${
                  item.type == "Regular"
                    ? "text-emerald-700"
                    : "text-yellow-600"
                } font-semibold text-lg text-center`}
              >{`${
                item.quantity /
                (item.size === "250gm" ? 4 : item.size === "500gm" ? 2 : 1)
              } kg`}</Text>
              <Text
                className={`${
                  item.type == "Regular"
                    ? "text-emerald-700"
                    : "text-yellow-600"
                } font-semibold text-lg text-center`}
              >{`₹${item.price}`}</Text></View>
            </View>
          )
      )}
      <View
        style={styles.totalContainer}
        className="flex flex-col gap-2 w-full"
      >
        <View className="flex font-medium flex-row justify-between items-center w-full">
          <Text className="flex items-center text-lg justify-center flex-grow-0 ">
            Total Weight:
          </Text>
          <Text className="font-semibold text-lg">
            {totalWeight.toFixed(0)} kg
          </Text>
        </View>
        <View className="flex flex-row justify-between items-center w-full">
          <Text className="flex items-center text-lg justify-center flex-grow-0 ">
            Pickup Date:
          </Text>
          <Text className="font-semibold text-lg">
            {pickupDate?.toLocaleDateString("en-GB")}
          </Text>
        </View>
        <View className="flex border-t border-gray-300  pt-2 font-bold flex-row justify-between items-center w-full">
          <Text className="flex items-center text-xl justify-center flex-grow-0 font-bold">
            Total:
          </Text>
          <Text className="font-semibold text-xl">
            ₹{total.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 8,
  },
});

export default Cart;
