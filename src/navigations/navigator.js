import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './app-navigator';
import AuthNavigator from './auth-navigators';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../redux/slices/authSlice';
const AppRoute = () => {
    const isLoggedIn = useSelector(selectIsLoggedIn);
    return (
        <NavigationContainer>
            {
                isLoggedIn ? <AppNavigator /> : <AuthNavigator />
            }
        </NavigationContainer>
    )
}
export default AppRoute
