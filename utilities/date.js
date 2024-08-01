function formatDate(date) {
    const newDate = new Date(date);
    return newDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}

module.exports = {formatDate};