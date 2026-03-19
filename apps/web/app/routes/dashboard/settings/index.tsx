import { redirect, href } from "react-router";

export function clientLoader() {
  // Redirect to profile by default
  throw redirect(href("/dashboard/settings/profile"));
}

export default function SettingsIndexRoute() {
  return null;
}
