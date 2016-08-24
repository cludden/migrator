let executed

export default function getExecuted (options = {}) {
  if (executed && !options.refresh) {
    return Promise.resolve(executed)
  }
  return this.options.executed()
}
