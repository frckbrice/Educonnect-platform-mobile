import { ConfigContext, ExpoConfig } from "expo/config";
import 'dotenv/config';

const EAS_PROJECT_ID = process.env.EXPO_PUBLIC_EAS_PROJECT_ID!;
const APPLE_TEAM_ID = process.env.EXPO_PUBLIC_APPLE_TEAM_ID;

const PROJECT_SLUG = process.env.EXPO_PUBLIC_PROJECT_SLUG;
const OWNER = "franckbriceavom";
const IOS_URL_SHEME = process.env.EXPO_PUBLIC_IOS_GOOGLE_URL_SCHEME;

// App production config
const APP_NAME = "";
const BUNDLE_IDENTIFIER = "";
const PACKAGE_NAME = "";
const ICON = "./assets/images/icon.png";
const SPLASH_ICON = "./assets/images/splash-icon.png";
const ADAPTIVE_ICON = "";
const SHEME = "educonnected"
const BASE_PROD_URL = process.env.EXPO_PUBLIC_BASE_URL;


// the app.config.js used to hide some sensitive information like the api-keys
export default ({ config }: ConfigContext): ExpoConfig => {

  console.log(` building app for environment : `, process.env.NODE_ENV);

  return {
    ...config,
    "name": "learning_platform",
    "slug": "learning_platform",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "owner": "franckbriceavom",
    "scheme": "educonnected",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "config": {
        "usesNonExemptEncryption": false
      },
      "bundleIdentifier": "com.bricefrck.learningplatform.stage",
      "appleTeamId": APPLE_TEAM_ID,
      entitlements: {
        'aps-environment': 'development'
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "googleServicesFile": "./google-services.json",
      "package": "com.bricefrck.learningplatform.dev",
    },
    "web": {
      "bundler": "metro",
      "output": "server",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [

      "react-native-iap",
      [
        "expo-router",
        {
          "origin": process.env.NODE_ENV === "development" ?
            "http://localhost:8081"
            : BASE_PROD_URL
        }
      ],
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#080393"
        }
      ],
      [
        "expo-secure-store",
        {
          "configureAndroidBackup": true,
          "faceIDPermission": "Allow $(PRODUCT_NAME) to access your Face ID biometric data."
        }
      ],
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": IOS_URL_SHEME
        }
      ],
      "expo-font",
      "expo-web-browser"
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": EAS_PROJECT_ID,
      }
    }
  }
}
