import { SignOutButton } from "@/src/components/SignOutButton";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "@/src/screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function Page() {
  const { user } = useUser();

  return (
    <SafeAreaView className="px-4 min-h-screen">
      <SignedIn>
        {/* <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <Link
          href={"/UpdateDetails"}
          className="p-4 bg-emerald-500 w-fit m-2 rounded-lg"
        >
          <Text className=" text-black">Update Details</Text>
        </Link>
        <SignOutButton /> */}
        <HomeScreen/>
        {/* <Stack.Navigator>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ title: 'Vijay Shree Tea Traders' }} 
            />
            <Stack.Screen 
              name="UpdateDetails" 
              component={UpdateDetailsScreen} 
              options={{ title: 'Update Details' }} 
            />
            <Stack.Screen 
              name="OrderHistory" 
              component={OrderHistoryScreen} 
              options={{ title: 'Order History' }} 
            />
          </Stack.Navigator> */}
      </SignedIn>
      <SignedOut>
        <Link
          className="p-4 bg-orange-500 w-fit m-2 rounded-lg text-white"
          href="/(auth)/sign-in"
        >
          <Text>Sign in</Text>
        </Link>
        <Link
          className="p-4 bg-orange-500 w-fit m-2 rounded-lg text-white"
          href="/(auth)/sign-up"
        >
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </SafeAreaView>
  );
}
