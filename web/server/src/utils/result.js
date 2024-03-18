exports.positive = () => {
    return JSON.stringify({
        result: "0"
    });
}

exports.negative = (specific) => {
    if (specific === undefined) {
        specific = 1;
    }

    return JSON.stringify({
        result: specific
    });
}

exports.positiveWith = (w) => {
    return JSON.stringify({
        result: w
    });
}