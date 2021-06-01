import pino from "pino";

export default function logger(component: string): pino.Logger {
  return pino({
    level: "info",
  }).child({
    component,
  });
}
