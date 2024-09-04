function getshade(baseColor, shadeNumber) {
  // Convert the baseColor from hex to RGB
  const hexToRgb = (hex) => {
    const bigint = Number.parseInt(hex.slice(1), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return { r, g, b } // Return an object with numeric values
  }

  // convert rgb to hex

  const rgbToHex = (r, g, b) => {
    // Ensure that each color component is within the valid range (0-255)
    r = Math.max(0, Math.min(255, r))
    g = Math.max(0, Math.min(255, g))
    b = Math.max(0, Math.min(255, b))

    // Convert each color component to its hexadecimal representation
    const rHex = r.toString(16).padStart(2, '0')
    const gHex = g.toString(16).padStart(2, '0')
    const bHex = b.toString(16).padStart(2, '0')

    // Concatenate the hexadecimal values to form the final hex color
    const hexColor = `#${rHex}${gHex}${bHex}`

    return hexColor
  }

  // Calculate the step value for shades
  const step = 50

  // Calculate the shade color
  const calculateShadeColor = (baseRgb, step, shadeNumber) => {
    const r = Math.min(255, Math.round(baseRgb.r - step * shadeNumber))
    const g = Math.min(255, Math.round(baseRgb.g - step * shadeNumber))
    const b = Math.min(255, Math.round(baseRgb.b - step * shadeNumber))
    return { r, g, b }
  }

  // Convert the base color to RGB
  const baseRgb = hexToRgb(baseColor)
  // Calculate the shade color for the given shade number
  const shadeColor = calculateShadeColor(baseRgb, step, shadeNumber)
  // Convert the shade color to hex
  const shadeHex = rgbToHex(shadeColor.r, shadeColor.g, shadeColor.b)
  // Return the shade color
  return shadeHex
}

// var primary = '#6a87fc';
// var secondary = '#6ae670';

const primary = '#1f111c'
const secondary = '#1f16ff'

const colors = {
  secondary: {
    DEFAULT: secondary,
    50: getshade(secondary, -4),
    100: getshade(secondary, -3),
    200: getshade(secondary, -2),
    300: getshade(secondary, -1),
    400: getshade(secondary, 0),
    500: getshade(secondary, 1),
    600: getshade(secondary, 1.5),
    700: getshade(secondary, 2),
    800: getshade(secondary, 2.5),
    900: getshade(secondary, 3),
  },
  primary: {
    DEFAULT: primary,
    50: getshade(primary, -4),
    100: getshade(primary, -3),
    200: getshade(primary, -2),
    300: getshade(primary, -1),
    400: getshade(primary, 0),
    500: getshade(primary, 1),
    600: getshade(primary, 1.5),
    700: getshade(primary, 2),
    800: getshade(primary, 2.5),
    900: getshade(primary, 3),
  },
}

export default colors
