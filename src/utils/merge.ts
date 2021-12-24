// From https://github.com/spotky1004/Bunch-of-Achievements/blob/main/src/util/SaveLoad.js

export function mergeObject(target: any, source: any) {
  target = target ?? {};
  for (const i in source) {
    if (Array.isArray(source[i])) {
      target[i] = target[i] ?? [];
      mergeArray(target[i], source[i]);
    } else if (typeof source[i] === "object") {
      target[i] = mergeObject(target[i], source[i]);
    } else {
      target[i] = source[i].constructor(target[i] ?? source[i]);
    }
  }
  return target;
}
export function mergeArray(target: Array<any>, source: Array<any>) {
  for (let i = 0, l = source.length; i < l; i++) {
    if (Array.isArray(source[i])) {
      mergeArray(target[i], source[i]);
    } else if (typeof source[i] === "object") {
      target[i] = mergeObject(target[i], source[i]);
    } else {
      target[i] = source[i].constructor(target[i] ?? source[i]);
    }
  }
  return target;
}
