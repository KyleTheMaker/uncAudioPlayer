import { ExpoConfig, ConfigContext } from "expo/config";

const APP_ID_PREFIX = "com.anonymous";

function getName(base: string) {
  switch (process.env.APP_VARIANT) {
    case "production":
      return base;
    case "preview":
      return `${base} (Preview)`;
    default:
      return `${base} (Dev)`;
  }
}

function getAppId() {
  switch (process.env.APP_VARIANT) {
    case "production":
      return APP_ID_PREFIX;
    case "preview":
      return `${APP_ID_PREFIX}.preview`;
    default:
      return `${APP_ID_PREFIX}.dev`;
  }
}

function getAppIcon() {
    switch (process.env.APP_VARIANT) {
    case "production":
      return undefined;
    case "preview":
      return "./assets/images/icon-prev.png";
    default:
      return "./assets/images/icon-dev.png";
  }
}

const icon = getAppIcon();

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: config.slug ?? "uncAudioPlayer",
  icon: icon ?? config.icon,
  name: getName(config.name ?? "uncAudioPlayer"),
  ios: { ...config.ios, icon: icon ?? config.ios?.icon, bundleIdentifier: getAppId() },
  android: { ...config.android, icon: icon ?? config.android?.icon, adaptiveIcon: {      ...config.android?.adaptiveIcon,
      foregroundImage: icon ?? config.android?.adaptiveIcon?.foregroundImage
    }, package: getAppId() },
});