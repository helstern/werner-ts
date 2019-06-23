export default function hasKey<T>(obj: T, key: string|number|Symbol): key is keyof T {
  return key in obj
}