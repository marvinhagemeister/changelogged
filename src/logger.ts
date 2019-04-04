import { yellow, red } from "kleur";

export function logWarn(msg: string) {
  console.error(yellow("⚠ " + msg));
}

export function logError(msg: string) {
  console.error(red("(!) " + msg));
}

export function log(msg: string) {
  console.error(msg);
}
