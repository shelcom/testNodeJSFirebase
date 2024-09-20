interface String {
  getImageName: () => string | undefined;
}

String.prototype.getImageName = function () {
  const splitedString = this.split('/');
  return splitedString.last();
};
