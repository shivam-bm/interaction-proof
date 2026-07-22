#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

type PackageManifest = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  name?: string;
  optionalDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

type EnvironmentResult = {
  configFiles: string[];
  packageName: string;
  packagePath: string | null;
  revision: string;
  root: string;
  tools?: Record<string, string>;
  versions: Record<string, string>;
};

const readArg = (name: string, fallback: string): string => {
  const index = args.indexOf(name);
  return index === -1 ? fallback : (args[index + 1] ?? fallback);
};

const hasFlag = (name: string): boolean => args.includes(name);

const readJson = (filePath: string): PackageManifest | { error: string } => {
  try {
    return JSON.parse(readFileSync(filePath, "utf8")) as PackageManifest;
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
};

const findNearestPackage = (startPath: string): string | null => {
  let current = path.resolve(startPath);
  while (true) {
    const candidate = path.join(current, "package.json");
    if (existsSync(candidate)) {
      return candidate;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      return null;
    }
    current = parent;
  }
};

const probe = (command: string, commandArgs: string[]): string => {
  try {
    return execFileSync(command, commandArgs, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 5000,
    }).trim();
  } catch (error) {
    if (error && typeof error === "object" && "stderr" in error) {
      const stderr = String(error.stderr ?? "").trim();
      if (stderr) {
        return stderr;
      }
    }
    return "unavailable";
  }
};

const root = path.resolve(readArg("--root", process.cwd()));
const packagePath = findNearestPackage(root);
const packageJson = packagePath ? readJson(packagePath) : null;
const dependencyGroups = packageJson && !("error" in packageJson)
  ? [
      packageJson.dependencies ?? {},
      packageJson.devDependencies ?? {},
      packageJson.peerDependencies ?? {},
      packageJson.optionalDependencies ?? {},
    ]
  : [];
const dependencies = Object.assign({}, ...dependencyGroups);

const trackedPackages = [
  "react",
  "react-native",
  "expo",
  "expo-router",
  "@react-navigation/native",
  "@react-navigation/native-stack",
  "@react-navigation/stack",
  "@react-navigation/drawer",
  "react-native-reanimated",
  "react-native-worklets",
  "react-native-gesture-handler",
  "react-native-screens",
  "react-native-safe-area-context",
];

const versions = Object.fromEntries(
  trackedPackages
    .filter((packageName) => dependencies[packageName])
    .map((packageName) => [packageName, dependencies[packageName]])
);

const configCandidates = [
  "app.json",
  "app.config.js",
  "app.config.ts",
  "expo-env.d.ts",
  "ios/Podfile",
  "android/build.gradle",
  "android/app/build.gradle",
];

const result: EnvironmentResult = {
  root,
  packagePath,
  packageName:
    packageJson && !("error" in packageJson) ? packageJson.name ?? "unknown" : "unknown",
  versions,
  configFiles: configCandidates.filter((candidate) =>
    existsSync(path.join(root, candidate))
  ),
  revision: probe("git", ["-C", root, "rev-parse", "HEAD"]),
};

if (hasFlag("--probe-tools")) {
  result.tools = {
    node: process.version,
    xcodebuild: probe("xcodebuild", ["-version"]),
    simctl: probe("xcrun", ["simctl", "list", "runtimes", "available"]),
    adb: probe("adb", ["version"]),
  };
}

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
