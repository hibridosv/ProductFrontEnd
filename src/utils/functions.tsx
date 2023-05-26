export const numberToMoney = (number: number): string => {
    return `$${number.toFixed(2)}`
}