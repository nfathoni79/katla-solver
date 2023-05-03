import { twMerge } from 'tailwind-merge'

export default (baseClasses, attrClasses) => {
  let merged = twMerge(baseClasses, attrClasses)
  return merged.replace(attrClasses, '')
}