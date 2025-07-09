import React from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';

export default function LoginScreen() {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-background-color"
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                className="flex-1"
            >
                <View className="flex-1 justify-center items-center px-4">
                    <View className="w-full bg-background-color p-6 rounded-2xl shadow-xl min-h-[70%] justify-center">



                        {/* Logo */}
                        <View className="items-center mb-5">
                            <Image
                                source={require('../assets/logo_mota.png')}
                                className="w-16 h-16"
                                resizeMode="contain"
                            />
                        </View>

                        {/* Texto MOTA */}
                        <Text className="text-center mb-2 text-heading-xl font-semibold text-primary-color">
                            MOTA
                        </Text>

                        {/* Texto Iniciar Sesión */}
                        <Text className="text-center mb-6 text-heading-lg font-semibold text-title-color">
                            Iniciar Sesión
                        </Text>

                        {/* Campo correo */}
                        <Text className="mb-1 text-label font-bold text-black">correo</Text>
                        <TextInput
                            className="bg-input-color rounded-md px-4 py-3 mb-5 text-black"
                            placeholder="Correo electrónico"
                            placeholderTextColor="#555"
                            keyboardType="email-address"
                        />

                        {/* Campo contraseña */}
                        <Text className="mb-1 text-label font-bold text-black">contraseña</Text>
                        <TextInput
                            className="bg-input-color rounded-md px-4 py-3 mb-6 text-black"
                            placeholder="••••••••"
                            placeholderTextColor="#555"
                            secureTextEntry
                        />

                        {/* Botón */}
                       <TouchableOpacity className="bg-primary-color rounded-lg py-3 shadow-md mt-4 w-full max-w-button-width self-center">
                            <Text className="text-white text-center font-semibold text-base">
                                Iniciar Sesión
                            </Text>
                        </TouchableOpacity>


                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
