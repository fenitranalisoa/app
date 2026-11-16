#!/usr/bin/env bash
set -euo pipefail

version="$1"
output="$(mkdir -p "$2" && cd "$2" && pwd)"
root="$(cd "$(dirname "$0")/../.." && pwd)"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
bundle="$work/Open StoryBoard Studio.app"
mkdir -p "$bundle/Contents/MacOS"

plist="$bundle/Contents/Info.plist"
cp "$root/packaging/macos/Info.plist" "$plist"
/usr/libexec/PlistBuddy -c "Set CFBundleShortVersionString $version" "$plist"
/usr/libexec/PlistBuddy -c "Set CFBundleVersion $version" "$plist"
python3 "$root/packaging/web_assets.py" "$bundle/Contents/Resources/Web"

for arch in arm64 x86_64; do
  xcrun swiftc -module-cache-path "$work/swift-cache" -swift-version 5 -parse-as-library -O \
    -target "$arch-apple-macosx13.0" -framework AppKit -framework WebKit \
    "$root/packaging/macos/Studio.swift" -o "$work/studio-$arch"
done
executable="$bundle/Contents/MacOS/OpenStoryboardStudio"
xcrun lipo -create "$work/studio-arm64" "$work/studio-x86_64" -output "$executable"
xcrun lipo -verify_arch arm64 x86_64 "$executable"
codesign --sign - --force "$bundle"
codesign --verify --strict "$bundle"
ditto -c -k --keepParent "$bundle" "$output/Open-StoryBoard-Studio-macOS.zip"
