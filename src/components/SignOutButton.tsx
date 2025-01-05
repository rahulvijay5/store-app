import { useClerk } from "@clerk/clerk-react";
import * as Linking from "expo-linking";
import { Button, Pressable, Text } from "react-native";

export const SignOutButton = () => {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to your desired page
      Linking.openURL(Linking.createURL("/"));
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <Pressable
      onPress={handleSignOut}
      className="p-4 bg-white border  w-fit m-2 rounded-lg"
    >
      <Text className=" text-orange-600">Sign Out</Text>
    </Pressable>
  );
};
