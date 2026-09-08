import type { Metadata } from "next";
import { StyleguideClient } from "./StyleguideClient";

export const metadata: Metadata = { title: "Styleguide" };

export default function StyleguidePage() {
  return <StyleguideClient />;
}
