export const SATISFIED = {
    SATISFIED: 1,
    DISSATISFIED: 2
};

export const ENABLE = {
    ENABLE: 1,
    DISABLE: 0,
};

export const SATISFIED_MAP = new Map([
    [SATISFIED.SATISFIED, {key: 'satisfied', value: 1}],
    [SATISFIED.DISSATISFIED, {key: 'dissatisfied', value: 2}],
]);

export const ENABLE_MAP = new Map([
    [ENABLE.ENABLE, {key: 'enable', value: 1}],
    [ENABLE.DISABLE, {key: 'disable', value: 0}],
]);