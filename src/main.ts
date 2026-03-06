import { mountApp } from "./ui/app";

const root = document.querySelector<HTMLElement>("#app");

if (!root) {
  throw new Error("App root not found.");
}

mountApp(root);
