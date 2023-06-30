enum LogLevelColors {
  INFO = "\x1b[36m", // blue
  SUCCESS = "\x1b[32m", // green
  WARN = "\x1b[33m", // yellow
  ERROR = "\x1b[31m", // red
}

class Logger {
  static log(level: "INFO" | "SUCCESS" | "WARN" | "ERROR", text: string): void {
    const formulatedText = `[+] ${text}`;
    if (level === "INFO") {
      return console.log(`${LogLevelColors.INFO}%s\x1b[0m`, formulatedText);
    }
    if (level === "SUCCESS") {
      return console.log(`${LogLevelColors.SUCCESS}%s\x1b[0m`, formulatedText);
    }
    if (level === "WARN") {
      return console.log(`${LogLevelColors.WARN}%s\x1b[0m`, formulatedText);
    }
    if (level === "ERROR") {
      return console.log(`${LogLevelColors.ERROR}%s\x1b[0m`, formulatedText);
    }
    console.log(text);
  }
}

export default Logger;
