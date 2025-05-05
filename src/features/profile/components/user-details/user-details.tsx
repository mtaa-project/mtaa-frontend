import { Button, Divider, MD3Theme, Text, useTheme } from "react-native-paper"
import { StyleSheet, View } from "react-native"
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form"
import {
  userProfileSchema,
  userProfileSchemaDefaultValues,
  UserProfileSchemaType,
} from "./form-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import RHFTextInput from "@/src/components/ui/rhf-text-input"
import { LocationData, useGetCurrentLocation } from "@/src/helpers"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import { useEffect, useMemo } from "react"
import { useUserProfile } from "../../services/queries"
import { useUpdateProfile } from "../../services/mutations"

export const UserDetails = () => {
  const theme = useTheme()
  const styles = createStyles(theme)
  const currentLocationQuery = useGetCurrentLocation()
  const userProfileQuery = useUserProfile(undefined, true)
  const updateProfileMutation = useUpdateProfile()

  const methods = useForm<UserProfileSchemaType>({
    defaultValues: userProfileSchemaDefaultValues,
    resolver: zodResolver(userProfileSchema),
  })

  const {
    formState: { errors, isDirty },
    setFocus,
    setValue,
    watch,
    reset,
  } = methods

  const serverValues = useMemo(() => {
    if (!userProfileQuery.data) return userProfileSchemaDefaultValues
    const d = userProfileQuery.data
    return {
      address: { ...d.address },
      profileDetails: {
        firstname: d.firstname,
        lastname: d.lastname,
        phoneNumber: d.phoneNumber,
      },
    } as UserProfileSchemaType
  }, [userProfileQuery.data])

  useEffect(() => {
    if (userProfileQuery.isSuccess) {
      reset(serverValues)
    }
  }, [reset, serverValues, userProfileQuery.isSuccess])

  const fillFormFromLocation = (locationData: LocationData) => {
    setValue("address.country", locationData.isoCountryCode ?? "", {
      shouldDirty: true,
    })
    setValue("address.city", locationData.district ?? "", {
      shouldDirty: true,
    })
    setValue("address.postalCode", locationData.postalCode ?? "", {
      shouldDirty: true,
    })
    setValue("address.street", locationData.street ?? "", {
      shouldDirty: true,
    })
    setValue("address.longitude", locationData.longitude, {
      shouldDirty: true,
    })
    setValue("address.latitude", locationData.latitude, {
      shouldDirty: true,
    })
  }

  const handleLocalizeUser = async () => {
    const locationData = await currentLocationQuery.mutateAsync()
    if (locationData) {
      fillFormFromLocation(locationData)
    }
  }

  const onSubmit: SubmitHandler<UserProfileSchemaType> = (data) => {
    console.log("Submit User Form")
    console.log(data)

    updateProfileMutation.mutate(data)
  }

  const onError: SubmitErrorHandler<UserProfileSchemaType> = (error) => {
    console.log(methods.getValues())

    console.log("Form Submit Error: ", JSON.stringify(error, null, 2))
  }

  if (userProfileQuery.isError) {
    return (
      <View>
        <Text>Error by loading user profile</Text>
        <Button>Try again</Button>
      </View>
    )
  }

  if (userProfileQuery.isLoading) {
    return (
      <View>
        <Text>Loading User Profile...</Text>
      </View>
    )
  }

  const handleDiscard = () => reset(serverValues)

  return (
    <View style={{ marginBlockEnd: 30 }}>
      <FormProvider {...methods}>
        <View>
          <Text variant="headlineSmall">User Details</Text>
          <View>
            <RHFTextInput<UserProfileSchemaType>
              name="profileDetails.firstname"
              label="First Name"
            />
            <RHFTextInput<UserProfileSchemaType>
              name="profileDetails.lastname"
              label="Last Name"
            />
            <RHFTextInput<UserProfileSchemaType>
              name="profileDetails.phoneNumber"
              label="Phone Number"
              keyboardType="phone-pad"
            />
          </View>
        </View>
        <Divider
          style={[
            styles.divider,
            {
              height: 4,
              backgroundColor: theme.colors.primary,
              marginVertical: 12,
            },
          ]}
        />
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text variant="headlineSmall">Address</Text>
            <Button
              icon={({ size, color }) => (
                <FontAwesome5
                  name="search-location"
                  size={size}
                  color={color}
                />
              )}
              loading={currentLocationQuery.isPending}
              onPress={handleLocalizeUser}
              style={{ alignSelf: "flex-end" }}
            >
              Use Current Location
            </Button>
          </View>
          <View>
            <RHFTextInput<UserProfileSchemaType>
              name="address.country"
              label="Country"
            />
            <RHFTextInput<UserProfileSchemaType>
              name="address.city"
              label="City"
            />
            <RHFTextInput<UserProfileSchemaType>
              name="address.postalCode"
              label="Postal Code"
              keyboardType="numeric"
            />
            <RHFTextInput<UserProfileSchemaType>
              name="address.street"
              label="Street"
            />
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Button
            // onPress={methods.handleSubmit(onSubmit)}
            onPress={handleDiscard}
            style={styles.submitButton}
            disabled={!isDirty}
          >
            Discard changes
          </Button>
          <Button
            onPress={methods.handleSubmit(onSubmit, onError)}
            style={styles.submitButton}
            mode="contained"
            disabled={!isDirty || updateProfileMutation.isPending}
            loading={
              updateProfileMutation.isPending || userProfileQuery.isPending
            }
          >
            Update Profile
          </Button>
        </View>
      </FormProvider>
    </View>
  )
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {},
    submitButton: {
      alignSelf: "flex-end",
    },

    divider: {
      height: StyleSheet.hairlineWidth,
    },
  })
