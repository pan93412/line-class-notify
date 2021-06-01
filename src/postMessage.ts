import fetch from "node-fetch";
import logger from "./logger";

const API_ENDPOINT = "https://notify-api.line.me/api/notify";

export enum CourseStatus {
  STARTED,
  ENDED,
}

export interface Notification {
  /**
   * CourseStatus.STARTED = 本堂課
   * CourseStatus.ENDED = 下堂課
   */
  course: string;
  status: CourseStatus;
}

function postMessageFormatter({ course, status }: Notification): string {
  switch (status) {
    case CourseStatus.STARTED:
      return `>> ${course}課開始。`;
    case CourseStatus.ENDED:
      return `<< 本節課結束。下節課是${course}。`;
    default:
      throw new Error("Runtime Error: 不正確的 status 值。");
  }
}

export async function PostMessage(
  notification: Notification,
  token: string
): Promise<boolean> {
  const log = logger("postMessage.PostMessage");
  const message = postMessageFormatter(notification);
  const body = new URLSearchParams();
  body.append("message", message);

  log.info("Start posting message to a LINE group");
  const resp = await fetch(API_ENDPOINT, {
    method: "POST",
    body,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  log.debug("Checking if it succeed");
  if (resp.ok) {
    if ((await resp.json()).status === 200) {
      log.debug("Yes! returning true");
      return true;
    }
  }

  log.debug("No... returning false");
  return false;
}

// postMessage({
//     course: "英文",
//     status: CourseStatus.STARTED,
// }, "453vWIQwb8i4lzOYVBCacvG6fXGPCRvyqRvWaUtXW0q");
