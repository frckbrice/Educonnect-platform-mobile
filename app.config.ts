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
  }
  }
};