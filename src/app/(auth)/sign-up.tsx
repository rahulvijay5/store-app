import * as React from 'react'
import { Text, TextInput, Button, View, Pressable } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <>
        <Text>Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <Button title="Verify" onPress={onVerifyPress} />
      </>
    )
  }

  return (
    <View>
      
            <SafeAreaView className='min-h-full bg-white'>
                    <View className='flex-1 justify-center px-6 '>
                  <View className='mb-6'>
                    <Text className='text-4xl font-bold text-center text-gray-800 mb-4'>Sign Up</Text>
            
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
                    <Pressable className='bg-sky-500 p-4 w-2/3 rounded-lg' onPress={onSignUpPress}>
                      <Text className='text-center text-xl text-white'>
                        Register
                      </Text>
                    </Pressable>
                    </View>
                  </View>
            
                  <View className='mt-4'>
                    <Text className='text-center text-gray-600'>Already having a account?</Text>
                    <Link href="/(auth)/sign-in" className='text-blue-500 text-center mt-1 font-semibold'>
                      <Text>Sign In</Text>
                    </Link>
                  </View>
                </View>
                      </SafeAreaView>
    </View>
  )
}