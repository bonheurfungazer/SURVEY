export type Point = { x: number; y: number };

/**
 * Function to convert points to an SVG path curve
 */
export const generatePath = (points: Point[]) => {
    if (points.length === 0) return "M0,90";
    if (points.length === 1) return `M${points[0].x},${points[0].y}`;
    if (points.length === 2) return `M${points[0].x},${points[0].y} L${points[1].x},${points[1].y}`;

    let path = `M${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        path += ` Q${points[i].x},${points[i].y} ${xc},${yc}`;
    }
    // Curve to the last point
    path += ` T${points[points.length - 1].x},${points[points.length - 1].y}`;
    return path;
};

/**
 * Function to get flag emoji from country code
 */
export const getFlagEmoji = (countryCode: string) => {
    if (!countryCode) return '🏳️'
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
};
