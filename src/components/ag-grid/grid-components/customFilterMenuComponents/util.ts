export const checkIsDate = (value: any) => {
    if (typeof new Date(value) === 'object' && !isNaN(new Date(value).getTime())) {
        return true
    }
    else {
        return false
    }
}