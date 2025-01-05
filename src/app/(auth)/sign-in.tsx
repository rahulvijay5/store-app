import * as React from 'react'
import { Text, TextInput, Button, View, Pressable } from 'react-native'
import { useSignIn, useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const SignIn = () => {

  // if(signInOption)
  const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()
  
    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
  
    // Handle the submission of the sign-in form
    const onSignInPress = React.useCallback(async () => {
      if (!isLoaded) return
  
      // Start the sign-in process using the email and password provided
      try {
        const signInAttempt = await signIn.create({
          identifier: emailAddress,
          password,
        })
  
        // If sign-in process is complete, set the created session as active
        // and redirect the user
        if (signInAttempt.status === 'complete') {
          await setActive({ session: signInAttempt.createdSessionId })
          router.replace('/')
        } else {
          // If the status isn't complete, check why. User might need to
          // complete further steps.
          console.error(JSON.stringify(signInAttempt, null, 2))
        }
      } catch (err) {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(err, null, 2))
      }
    }, [isLoaded, emailAddress, password])


  return (
    <SafeAreaView className='min-h-screen bg-white'>
        <View className='flex-1 justify-center px-6 '>
      <View className='mb-6'>
        <Text className='text-4xl font-bold text-center text-gray-800 mb-4'>Sign In</Text>

        <TextInput
          className='h-12 p-4 mb-4 bg-gray-100 rounded-md'
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />

        <TextInput
          className='h-12 p-4 mb-6 bg-gray-100 rounded-md'
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />

        <View className='flex items-center justify-center'>
        <Pressable className='bg-sky-500 p-4 w-2/3 rounded-lg' onPress={onSignInPress}>
          <Text className='text-center text-xl text-white'>
            Take Me In!
          </Text>
        </Pressable>
        </View>
      </View>

      <View className='mt-4'>
        <Text className='text-center text-gray-600'>Don't have an account?</Text>
        <Link href="/(auth)/sign-up" className='text-blue-500 text-center mt-1 font-semibold'>
          <Text>Sign up</Text>
        </Link>
      </View>
    </View>
          </SafeAreaView>
  )
}

export default SignIn