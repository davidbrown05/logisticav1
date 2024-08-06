// Filename: numberToText.js

export function convertNumberToText(num) {
    num = deleteLeadingZeros(num);
    return getName(num);
}

function deleteLeadingZeros(num) {
    let i = 0;
    while (num.charAt(i) === '0') {
        i++;
    }
    return num.substr(i);
}

function getName(num) {
    num = deleteLeadingZeros(num);

    if (num.length === 1) {
        return getUnits(num);
    }

    if (num.length === 2) {
        return getTens(num);
    }

    if (num.length === 3) {
        return getHundreds(num);
    }

    if (num.length < 7) {
        return getThousands(num);
    }

    if (num.length < 13) {
        return getPeriod(num, 6, 'millón');
    }

    if (num.length < 19) {
        return getPeriod(num, 12, 'billón');
    }

    return 'Número demasiado grande.';
}

function getUnits(num) {
    const units = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    let numberInt = parseInt(num);
    return units[numberInt];
}

function getTens(num) {
    const tenToSixteen = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis'];
    const tens = ['veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];

    let units = num.charAt(1);
    if (num < 17) {
        return tenToSixteen[num - 10];
    }
    if (num < 20) {
        return 'dieci' + getUnits(units);
    }

    let name = tens[num.charAt(0) - 2];
    if (units > 0) {
        name += ' y ' + getUnits(units);
    }
    return name;
}

function getHundreds(num) {
    let name = '';
    let hundreds = num.charAt(0);
    let tens = num.substr(1);

    if (num == 100) {
        return 'cien';
    }

    switch (hundreds) {
        case '1':
            name = 'ciento';
            break;
        case '5':
            name = 'quinientos';
            break;
        case '7':
            name = 'setecientos';
            break;
        case '9':
            name = 'novecientos';
            break;
        default:
            name = getUnits(hundreds) + 'cientos';
            break;
    }

    if (tens > 0) {
        name += ' ' + getName(tens);
    }
    return name;
}

function getThousands(num) {
    let name = 'mil';
    let thousandsLength = num.length - 3;
    let thousands = num.substr(0, thousandsLength);
    let hundreds = num.substr(thousandsLength);

    if (thousands > 1) {
        name = getName(thousands) + ' mil';
    }
    if (hundreds > 0) {
        name += ' ' + getName(hundreds);
    }
    return name;
}

function getPeriod(num, digitsToTheRight, periodName) {
    let name = 'un ' + periodName;
    let periodLength = num.length - digitsToTheRight;
    let periodDigits = num.substr(0, periodLength);
    let previousDigits = num.substr(periodLength);

    if (periodDigits > 1) {
        name = getName(periodDigits) + ' ' + periodName + 'es';
    }
    if (previousDigits > 0) {
        name += ' ' + getName(previousDigits);
    }
    return name;
}
