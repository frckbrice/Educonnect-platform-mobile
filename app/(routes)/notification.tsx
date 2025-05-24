import NotificationScreen from '@/components/screen/notifications/notification-screen'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Notification = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NotificationScreen />
        </GestureHandlerRootView>
    )
}

export default Notification;
