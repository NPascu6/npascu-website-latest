const Snake = () => {
    return <img alt="snake" src="data:image/png;base64,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" />
}

export default Snake