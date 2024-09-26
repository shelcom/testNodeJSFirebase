interface Array<T> {
  last: () => string | undefined;
}

Array.prototype.last = function () {
  if (this.length > 0) {
    return this[this.length - 1];
  }

  return undefined;
};
