export const getConditionLabel = (cond: number | string | undefined) => {
    if (!cond) return "N/A"
    if (typeof cond === "string") return cond
    if (cond >= 9) return "New"
    if (cond >= 8) return "Excellent"
    if (cond >= 6) return "Good"
    return "Fair"
}