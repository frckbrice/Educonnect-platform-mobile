import 'dotenv/config';
import {ExpoConfig, ConfigContext} from 'expo/config';


// the app.config.js used to hide some sensitive information like the api-keys
export default ({config}: ConfigContext): ExpoConfig => {

  return {
    ...config,
   name: config.name || "learning_platform",
    slug: config.slug || "learning_platform",
    ios: {
        ...config.ios,
    },
    android: {
      ...config.android,
    },
    "owner": "franckbriceavom",
    "version": "1.0.0",
    "extra": {
      "eas": {
        "projectId": "505d0288-acb5-4b09-8e77-9b51762c3190"
      }
    }
  }
};