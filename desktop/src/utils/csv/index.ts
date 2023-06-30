// import { ICSVUtil } from "./types";

class CSVUtil {
  public static parse(text: string): string[][] {
    const rows: string[] = text.trim().split("\n");
    const cols: string[][] = [];
    for (const row of rows) {
      cols.push(row.split(",").map((r: string) => r.trim()));
    }
    return cols;
  }
}

export default CSVUtil;
