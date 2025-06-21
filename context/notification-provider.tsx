import { View, Text, Alert } from "react-native";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import * as Notifications from "expo-notifications";
import useUser, { setAuthorizationHeader } from "@/hooks/use-user";
import { registerForPushNotificationsAsync } from "@/utils/register-for-push-notification";
import axios from "axios";
import { router } from "expo-router";
import { API_URL } from "@/utils/env-constant";

interface NotificationContextType {
    expoPushToken: string | null;
    notification: Notifications.Notification | null;
    error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined
);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        Alert.alert("useNotification must be used within a notification provider");
    }
    return context;
};

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider = ({
    children,
}: NotificationProviderProps) => {

    const [expoPushToken, setExpoPushToken] = useState("");
    const [notification, setNotification] =
        useState<Notifications.Notification | null>(null);
    const [error, setError] = useState(null);
    const notificationListener = useRef<Notifications.EventSubscription | null>(null);
    const responseListener = useRef<Notifications.EventSubscription | null>(null);
    const { apiUser: user, loader } = useUser();

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            const registerPushNotification = async () => {
                try {
                    const token = await registerForPushNotificationsAsync();
                    if (token) {
                        // if the user is connected with different device. we update the existing token in DB.
                        if (!loader && user && user.pushToken !== token) {
                            await setAuthorizationHeader(); // add Bearer token to the the request header
                            await axios.put(
                                `${API_URL}/users/update`,
                                { pushToken: token }
                            );
                            setExpoPushToken(token);
                        }
                    }
                } catch (error: any) {
                    console.error("\n\n Error registering for push notifications:", error);
                    setError(error);
                }
            };
            registerPushNotification();
        }

        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                console.log("\n\n Notification received while the app is running:", notification);
                setNotification(notification); // here we get the notification directly
            });

        // subscribe to an event. and we get a response object, not the notification itself like above.
        notificationListener.current =
            // we get this data from the data sent in the backend on in the reply route.
            Notifications.addNotificationResponseReceivedListener((response) => {
                console.log("\n\n Notification response : user interact with the notification (tap on it):",
                    JSON.stringify(response, null, 2));
                if (response.notification.request.content.data.courseData) {
                    router.push({
                        pathname: "/(routes)/course-access",
                        params: {
                            ...response.notification.request.content.data.courseData,
                            activeVideo:
                                response.notification.request.content.data.activeVideo as number,
                        },
                    });
                }
                if (response.notification.request.content.data.link) {
                    const link = response.notification.request.content.data.link;
                    if (typeof link === "string") {
                        router.push(link as any);
                    } else {
                        console.warn("Notification link is not a string:", link);
                    }
                }
            });

        Notifications.getLastNotificationResponseAsync().then((response) => {
            if (!response?.notification) {
                return;
            }
        });

        return () => {
            isMounted = false;
            notificationListener.current && notificationListener.current.remove();
            responseListener.current && responseListener.current.remove();
        };
    }, [loader]);

    return (
        <NotificationContext.Provider
            value={{ expoPushToken, notification, error }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
