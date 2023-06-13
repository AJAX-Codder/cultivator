import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, FontAwesome5, Entypo, MaterialIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux'
import { setSignIn } from '../../redux/slices/authSlice';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import VerifyOTP from './VerifyOTP';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from '../../../config/firebase';
const auth = getAuth(firebase);
const db = getFirestore();
const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [userType, setUserType] = useState('Trader');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(true);
    const [isVisible, setVisible] = useState(false);
    const [Vemail, setVEmail] = useState(true);
    const [Vpassword, setVPassword] = useState(true);
    const [VmobileNumber, setVMobileNumber] = useState(true);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    useEffect(() => {
        const checkUserLoggedIn = async () => {
            try {
                const user = await AsyncStorage.getItem('user');
                if (user) {
                    const userData = JSON.parse(user);
                    dispatch(setSignIn(userData));
                }
            } catch (error) {
                alert('Error retrieving user data:');
            }
            finally {
                setLoading2(false)
            }
        };

        checkUserLoggedIn();
    }, [dispatch]);
    const validateInputs = (Type) => {
        let valid = true;
        if (Type === 'Trader') {
            if (email === '' || email.trim() === '') {
                setVEmail(false);
                valid = false;
            }
            if (password === '' || password.length < 6) {
                setVPassword(false);
                valid = false;
            }
        } else {
            if (mobileNumber.length !== 10) {
                setVMobileNumber(false);
                valid = false;
            }
        }
        return valid;
    };

    const handleLogin = async () => {
        if (!validateInputs(userType))
            return;
        setLoading(true);
        if (userType === 'Trader') {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const emailid = userCredential.user.email;
                const usersRef = collection(db, 'Traders');
                const q = query(usersRef, where('email', '==', emailid));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    const userData = userDoc.data();
                    const data = {
                        isLoggedIn: true,
                        id: userDoc.id,
                        detail: userData,
                        type: 'Traders',
                    };
                    dispatch(setSignIn(data));
                    await AsyncStorage.setItem('user', JSON.stringify(data));
                } else {
                    Alert.alert('User not found');
                }
            } catch (error) {
                setEmail('');
                setPassword('');
                const errorCode = error.code;
                const errorMessage = error.message;
                Alert.alert('Login Failed');
                console.log(error)
            } finally {
                setLoading(false);
            }
        } else {
            alert('સર્વિસ ઉપલબ્ધ નથી.. ')
            setLoading(false);
        }
    };

    const navigateToScreen = (screen) => {
        navigation.navigate(screen);
    };
    if (loading2) {
        return (
            <View style={styles.container}>
                <ActivityIndicator color={"#fff"} size={"large"} />
            </View>
        )
    }
    else
        return (
            <View style={styles.container}>
                <Image source={require('../../../assets/logo.png')} style={styles.logo} />
                <Text style={{ fontFamily: 'piedra-font', color: '#fff', fontSize: 50, letterSpacing: 1, marginBottom: 20 }}>LOGIN</Text>
                <View style={styles.typeSelection}>
                    <TouchableOpacity
                        style={[styles.radioButton, userType === 'Trader' && styles.radioButtonSelected]}
                        onPress={() => setUserType('Trader')}
                    >
                        <Text style={{ color: !userType == 'Farmer' ? '#fff' : '#BDBFC2', fontWeight: 'bold', letterSpacing: 1, fontSize: 16 }}>Trader</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.radioButton, userType === 'Farmer' && styles.radioButtonSelected]}
                        onPress={() => setUserType('Farmer')}
                    >
                        <Text style={{ color: userType == 'Farmer' ? '#fff' : '#BDBFC2', fontWeight: 'bold', letterSpacing: 1, fontSize: 16 }}>Farmer</Text>
                    </TouchableOpacity>
                </View>
                {userType === 'Trader' ? (
                    <View style={styles.inputContainer}>
                        <View style={[styles.input_group, !Vemail && { borderColor: '#C3533A' }]}>
                            <MaterialCommunityIcons name="email" size={28} color="#fff" style={{
                                paddingHorizontal: 8
                            }} />
                            <TextInput
                                onFocus={() => setVEmail(true)}
                                style={styles.input}
                                placeholder="Email"
                                value={email}
                                inputMode='email'
                                keyboardType='email-address'
                                onChangeText={setEmail}
                                placeholderTextColor="#BDBFC2"
                            />
                            {!Vemail && <MaterialIcons name='error' size={24} color={'#C3533A'} style={{ position: 'absolute', left: '90%' }} />}
                        </View>
                        <View style={[styles.input_group, !Vpassword && { borderColor: '#C3533A' }]}>
                            <FontAwesome5 name="lock" size={26} color="#fff" style={{
                                paddingHorizontal: 11
                            }} />
                            <TextInput
                                onFocus={() => setVPassword(true)}
                                style={styles.input}
                                placeholder="Password"
                                secureTextEntry
                                value={password}
                                importantForAutofill='yes'
                                onChangeText={setPassword}
                                placeholderTextColor="#BDBFC2"
                            />
                            {!Vpassword && <MaterialIcons name='error' size={24} color={'#C3533A'} style={{ position: 'absolute', left: '90%' }} />}
                        </View>

                        <TouchableOpacity onPress={() => navigateToScreen('Forget')} style={styles.createNew}>
                            <Text style={{ color: '#BDBFC2' }}> Forgot password?</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.inputContainer}>
                        <View style={[styles.input_group, !VmobileNumber && { borderColor: '#C3533A' }]}>
                            <Entypo name="old-phone" size={28} color="#fff" style={{
                                paddingHorizontal: 8
                            }} />
                            <TextInput
                                onFocus={() => setVMobileNumber(true)}
                                style={styles.input}
                                placeholder="Mobile Number"
                                value={mobileNumber}
                                inputMode='numeric'
                                keyboardType='numeric'
                                onChangeText={(text) => { setVMobileNumber(true), setMobileNumber(text) }}
                            />
                            {!VmobileNumber && <MaterialIcons name='error' size={24} color={'#C3533A'} style={{ position: 'absolute', left: '90%' }} />}
                        </View>
                    </View>
                )}
                <View style={{ width: '80%', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <TouchableOpacity onPress={handleLogin} style={styles.button}>
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" /> // Show loader if loading state is true
                        ) : (
                            <Text style={styles.buttonText}>{userType === 'Trader' ? 'Login' : 'Send OTP'}</Text>
                        )}
                    </TouchableOpacity>
                </View>
                {userType === 'Trader' ? (
                    <TouchableOpacity onPress={() => navigateToScreen('Register')} style={{ marginTop: 50 }}>
                        <Text style={styles.buttonText}><FontAwesome5 name="hand-point-right" size={24} color="white" />  New Trader ? </Text>
                    </TouchableOpacity>
                ) : null}
                <VerifyOTP isVisible={isVisible} setVisible={setVisible} code={confirm} setcode={setConfirm} />
            </View>
        );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#31363C',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    typeSelection: {
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    radioButton: {
        backgroundColor: '#53595F',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 5,
    },
    radioButtonSelected: {
        backgroundColor: '#1F242B',
    },
    inputContainer: {
        marginBottom: 20,
    },
    input_group: {
        backgroundColor: '#1F242B',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderRadius: 12,
        borderColor: '#1F242B',
        marginBottom: 10
    },
    input: {
        backgroundColor: '#53595F',
        width: 250,
        height: 45,
        color: '#fff',
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#1F242B',
        paddingHorizontal: 35,
        paddingVertical: 15,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LoginScreen;