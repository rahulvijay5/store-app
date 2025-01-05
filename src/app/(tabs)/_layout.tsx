import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link, Redirect, Tabs } from 'expo-router';
import {Text} from 'react-native'
import React, { useState } from 'react';
import { SignOutButton } from "@/src/components/SignOutButton";
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSignIn } from '@clerk/clerk-expo'
import {  useRouter } from 'expo-router'
import {  TextInput, Button, View, Pressable } from 'react-native'

export default function TabLayout() {

    


  return (
    <>
    <SignedIn> 
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
    <Tabs.Screen
      name="index"
      options={{
        title: 'Vijay Shree Tea Traders',
        // headerShown:false,
        tabBarLabel:'Create Order',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
      }}
    />
    <Tabs.Screen
      name="pastOrders"
      options={{
        title: 'Last Orders',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="history" color={color} />,
      }}
    />
  </Tabs>
      </SignedIn>
      <SignedOut>
       <Redirect href={'/(auth)/sign-in'} />
      </SignedOut>

    </>
  );
}
