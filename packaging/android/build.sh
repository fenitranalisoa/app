#!/usr/bin/env bash
set -euo pipefail

version="$1"
output="$(mkdir -p "$2" && cd "$2" && pwd)"
root="$(cd "$(dirname "$0")/../.." && pwd)"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

sdk="${ANDROID_HOME:-${ANDROID_SDK_ROOT:?Le SDK Android est introuvable.}}"
tools="$sdk/build-tools/35.0.0"
jar="$sdk/platforms/android-35/android.jar"
if [[ ! -x "$tools/aapt2" || ! -f "$jar" ]]; then
  "$sdk/cmdline-tools/latest/bin/sdkmanager" "platforms;android-35" "build-tools;35.0.0"
fi
IFS=. read -r major minor patch <<< "$version"
version_code=$((major * 1000000 + minor * 1000 + patch))

python3 "$root/packaging/web_assets.py" "$work/assets/app"
"$tools/aapt2" compile --dir "$root/packaging/android/res" -o "$work/resources.zip"
"$tools/aapt2" link -I "$jar" --manifest "$root/packaging/android/AndroidManifest.xml" \
  --min-sdk-version 29 --target-sdk-version 35 --version-code "$version_code" --version-name "$version" \
  -A "$work/assets" -o "$work/unsigned.apk" "$work/resources.zip"
javac --release 8 -classpath "$jar" -d "$work/classes" "$root/packaging/android/StudioActivity.java"
jar cf "$work/classes.jar" -C "$work/classes" .
mkdir "$work/dex"
"$tools/d8" --lib "$jar" --min-api 29 --output "$work/dex" "$work/classes.jar"
zip -q -j "$work/unsigned.apk" "$work/dex/classes.dex"
"$tools/zipalign" -f 4 "$work/unsigned.apk" "$work/aligned.apk"

if [[ -n "${STUDIO_ANDROID_KEYSTORE:-}" ]]; then
  keystore="$STUDIO_ANDROID_KEYSTORE"
  : "${STUDIO_ANDROID_PASSWORD:?Mot de passe du keystore manquant.}"
  export STUDIO_ANDROID_PASSWORD
  key_alias="${STUDIO_ANDROID_KEY_ALIAS:-studio}"
else
  keystore="$work/test.p12"
  key_alias="studio"
  export STUDIO_ANDROID_PASSWORD="$(openssl rand -hex 24)"
  keytool -genkeypair -storetype PKCS12 -keystore "$keystore" -storepass:env STUDIO_ANDROID_PASSWORD \
    -alias "$key_alias" -keyalg RSA -keysize 3072 -validity 10000 -dname "CN=Open StoryBoard Studio Test"
fi

apk="$output/Open-StoryBoard-Studio-Android.apk"
"$tools/apksigner" sign --ks "$keystore" --ks-key-alias "$key_alias" \
  --ks-pass env:STUDIO_ANDROID_PASSWORD --out "$apk" "$work/aligned.apk"
"$tools/apksigner" verify --verbose "$apk"
"$tools/aapt2" dump badging "$apk" | sed -n '1,10p'
