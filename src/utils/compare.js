export const getWinner = (val1, val2) => {
    if (val1 > val2) return 'p1';
    if (val2 > val1) return 'p2';
    return 'tie';
};