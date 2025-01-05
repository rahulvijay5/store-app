import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import { Button } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useUser } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import Cart from "../components/Cart";
import { Prices, TeaType, TeaSize } from "../constants/prices";
import { CartItem, TypeOfCart, Counts } from "../types";
import { useRouter } from "expo-router";
import { SignOutButton } from "../components/SignOutButton";

const API_BASE_URL = "https://vijaychai.vercel.app/api";

const initialCart: CartItem[] = [
  { type: "Regular", size: "250gm", quantity: 0, price: 0 },
  { type: "Regular", size: "500gm", quantity: 0, price: 0 },
  { type: "Regular", size: "1000gm", quantity: 0, price: 0 },
  { type: "Super", size: "250gm", quantity: 0, price: 0 },
  { type: "Super", size: "500gm", quantity: 0, price: 0 },
  { type: "Super", size: "1000gm", quantity: 0, price: 0 },
];

const HomeScreen: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [userIdInDb, setUserIdInDb] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pickupDate, setPickupDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [isInitialFetchDone, setIsInitialFetchDone] = useState<boolean>(false);

  const router = useRouter();

  const { user } = useUser();
  const navigation = useNavigation();

  const checkUser = async () => {
    if (!isInitialFetchDone && user) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/get-logged-in-user?clerk=${user.id}`,
          { method: "GET" }
        );
        const res = await response.json();
        if (res.status === 200) {
          setUserIdInDb(res.message);
        } else {
          console.log("User does not exist, redirecting to add user details");
          //   navigation.navigate('UpdateDetails');
          router.replace("/UpdateDetails");
        }
      } catch (error) {
        console.log("Error: ", error);
      } finally {
        setIsInitialFetchDone(true);
      }
    }
  };

  useEffect(() => {
    checkUser();
  }, [isInitialFetchDone, user]);

  const handleCancel = () => {
    setCart(initialCart);
  };

  const handleAddProduct = (type: TeaType, size: TeaSize) => {
    const priceOfProduct = Prices[type][size];
    const quantityIncrement = size === "250gm" ? 20 : size === "500gm" ? 10 : 5;
    const updatedCart = cart.map((item) => {
      if (item.type === type && item.size === size) {
        return {
          ...item,
          quantity: item.quantity + quantityIncrement,
          price: item.price + priceOfProduct,
        };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const getIndividualCounts = (cart: TypeOfCart): Counts => {
    const counts: Counts = {
      Reg250: 0,
      Reg500: 0,
      Reg1000: 0,
      Sup250: 0,
      Sup500: 0,
      Sup1000: 0,
    };

    cart.forEach((item: CartItem) => {
      const key = `${
        item.type.charAt(0).toUpperCase() + item.type.slice(1, 3)
      }${item.size.replace("gm", "")}` as keyof Counts;
      counts[key] += item.quantity;
    });

    return counts;
  };

  const handleCreateOrder = async () => {
    setIsLoading(true);
    if (calculateTotal() === 0) {
      Alert.alert("Error", "Add items to cart first!");
      setIsLoading(false);
      return;
    }

    if (user) {
      try {
        const totalPrice = calculateTotal();
        const totalWeight = calculateTotalWeight();
        const counts = getIndividualCounts(cart);

        const orderDetails = {
          userId: userIdInDb,
          totalPrice,
          totalWeight,
          pickupDate,
          ...counts,
        };

        const orderResponse = await fetch(`${API_BASE_URL}/create-new-order`, {
          method: "POST",
          body: JSON.stringify(orderDetails),
          headers: { "Content-Type": "application/json" },
        });

        const result = await orderResponse.json();
        if (result.status === 200) {
          Alert.alert("Success", "Your Order has been placed Successfully🎊", [
            { text: "OK" },
            {
              text: "View Last Orders",
              onPress: () =>
                // navigation.navigate('OrderHistory', { userId: userIdInDb })
                Alert.alert("Last Orders will be fetched"),
            },
          ]);
        } else {
          Alert.alert("Error", result.message || "Try again after sometime.");
        }
      } catch (error) {
        console.error("Error creating order:", error);
      } finally {
        setIsLoading(false);
      }
      setCart(initialCart);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const calculateTotalWeight = () => {
    return cart.reduce((total, item) => {
      const needFor1Kg =
        item.size === "250gm" ? 4 : item.size === "500gm" ? 2 : 1;
      return total + item.quantity / needFor1Kg;
    }, 0);
  };

  return (
    <ScrollView style={styles.container} className="h-full p-2">
      <View className="flex justify-between gap-4">
        <View className=" rounded-xl p-3 ">
          {/* <Text style={styles.title}>Vijay Shree Tea Traders</Text> */}
          <Text style={styles.subtitle}>Create New Order</Text>
          <View style={styles.teaSection} className="flex gap-4">
            <View style={styles.teaType} className="">
              <Text style={styles.teaTypeText} className="text-2xl">Regular</Text>
              <View style={styles.buttonGroup} className="">
                {["250gm", "500gm", "1000gm"].map((size) => (
                  <View key={`Regular-${size}`}>
                    <Button
                      title={size == "1000gm" ? "1kg" : size}
                      className="text-black"
                      onPress={() =>
                        handleAddProduct("Regular", size as TeaSize)
                      }
                      buttonStyle={[styles.button, styles.regularButton]}
                    />
                    {/* <Pressable key={`Regular-${size}`} onPress={() => handleAddProduct("Regular", size as TeaSize)} style={[styles.button, styles.regularButton]} className='flex items-center justify-center font-semibold rounded-md py-6'>
                  <Text className='text-2xl text-white'>{size}</Text>
                  </Pressable> */}
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.teaType}>
              <Text style={styles.teaTypeText} className="text-2xl">Super</Text>
              <View style={styles.buttonGroup}>
                {["250gm", "500gm", "1000gm"].map((size) => (
                  <Button
                    key={`Super-${size}`}
                    title={size == "1000gm" ? "1kg" : size}
                    onPress={() => handleAddProduct("Super", size as TeaSize)}
                    buttonStyle={[styles.button, styles.superButton]}
                  />
                ))}
              </View>
            </View>
          </View>

          <View className="flex flex-row items-center justify-between w-full">
            <Text className="text-lg font-semibold">Pickup Date:</Text>
            <View className="flex flex-row items-center gap-2 justify-between ">
              {/* <Pressable
                className="p-4 bg-blue-500 flex flex-grow rounded-md"
                onPress={() => setPickupDate(new Date())}
              >
                <Text className=" text-white">Today</Text>
              </Pressable>
              <Pressable
                className="p-4 bg-blue-500 flex flex-grow rounded-md"
                onPress={() => setPickupDate(new Date(Date.now() + 86400000))}
              >
                <Text className=" text-white">Tomorrow</Text>
              </Pressable> */}
              {showDatePicker && (
                <DateTimePicker
                  value={pickupDate}
                  mode="date"
                  display="default"
                  className=""
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setPickupDate(selectedDate);
                  }}
                />
              )}
              <Pressable
                className="py-2 px-4 bg-blue-500 rounded-md"
                onPress={() => setShowDatePicker((prev)=>!prev)}
              >
                <Text className=" text-white text-lg">Select Date</Text>
              </Pressable>
            </View>
          </View>
          <View
            style={styles.actionButtons}
            className="flex flex-row flex-grow-0 items-center w-full gap-2 my-4"
          >
            <Pressable
              onPress={handleCreateOrder}
              disabled={isLoading}
              className=" bg-blue-500 rounded-md py-2 px-4 flex-grow items-center flex justify-center"
            >
              <Text className="text-white text-lg font-semibold">
                Create Order
              </Text>
            </Pressable>

            {calculateTotal() > 0 && (
              <Pressable
                onPress={handleCancel}
                disabled={isLoading}
                className=" border-blue-500 border rounded-md py-2 px-4 items-center flex justify-center"
              >
                <Text className="text-black text-lg font-semibold">Cancel</Text>
              </Pressable>
            )}
          </View>

          {calculateTotal() != 0 && (
            <Cart
              cart={cart}
              total={calculateTotal()}
              totalWeight={calculateTotalWeight()}
              pickupDate={pickupDate}
            />
          )}

          {/* <Button
          title="View Last Orders"
          onPress={() => 
              // navigation.navigate('OrderHistory', { userId: userIdInDb })
              Alert.alert("Last Orders will be fetched")
          }
        /> */}
        </View>
      </View>
      <SignOutButton/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  teaSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  teaType: {
    flex: 1,
  },
  teaTypeText: {
    // fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: "column",
  },
  button: {
    marginBottom: 8,
    padding: 18,
  },
  regularButton: {
    backgroundColor: "#4CAF50",
  },
  superButton: {
    backgroundColor: "#FFC107",
  },

  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default HomeScreen;
