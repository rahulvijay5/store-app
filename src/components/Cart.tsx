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
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      {cart.map(
        (item, index) =>
          item.quantity > 0 && (
            <View key={index} style={styles.item}>
              <Text>{`${item.type} ${item.size}: ${item.quantity}`}</Text>
              <Text>{`₹${item.price}`}</Text>
            </View>
          )
      )}
      <View style={styles.totalContainer} className="flex flex-col gap-2 w-full">
        <Text>Total Weight: {totalWeight.toFixed(2)} kg</Text>
        <Text>Pickup Date: {pickupDate?.toLocaleDateString()}</Text>
        <Text className="flex flex-row flex-grow border-t border-gray-300 pt-2 font-bold justify-between items-center w-full">
          <Text className="w-full bg-red-300 flex-row flex-grow">Total:</Text>
          <Text className="w-full">₹{total}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f0f0f0",
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
