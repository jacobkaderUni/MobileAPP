function generateColorCode(name) {
  const hash = name.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    const darkenedValue = Math.floor(value * 0.6);
    color += ("00" + darkenedValue.toString(16)).substr(-2);
    // color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
}

export default generateColorCode;
