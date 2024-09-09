import icons from "./genesys.svg";

export function GetResults(data: ResultsData): string
{
    let rolls: any[] = [];
    if (data.rolls && !Array.isArray(data.rolls))
    {
        rolls = Object.values(data.rolls).map((roll) => roll);
    } else
    {
        rolls = Object.values(recursiveSearch(data, 'rolls')).map((group) =>
        {
            return Object.values(group) as any;
        }).flat();
    }

    let total: any = 0;
    if (data.hasOwnProperty('value'))
    {
        total = data.value!;
    } else
    {
        total = rolls.reduce((val, roll) => val + roll.value!, 0);
        let modifier = (data as any).reduce((val, roll) => val + roll.modifier, 0);
        total += modifier;
    }

    total = isNaN(total) ? '...' : total;
    let resultString = '';

    rolls.forEach((roll, i) =>
    {
        let val;
        let sides = roll.die || roll.sides || 'fate';
        if (i !== 0)
        {
            if (data.ops)
            {
                const operator = data.ops[i - 1];
                const opsString = operator === "-" ? '-' : '';
                resultString += `, ${opsString}`;
            }
            else
            {
                resultString += `, `;
            }
        }

        if (roll.success !== undefined && roll.success !== null)
        {
            val = roll.success ? `<img class="success" id="checkSvg" src="/checkmark.svg" alt="Check Image">` :
                roll.failures! > 0 ? `<img class="failure" id="cancelSvg" src="/cancel.svg" alt="Cancel Image">` :
                    `<img class="null" id="minusSvg" src="/minus.svg" alt="Minus Image">`;
        } else
        {
            val = roll.hasOwnProperty('value') ? roll.value!.toString() : '...';
        }
        let classes = `d${sides}`;

        if (roll.critical === "success" || (roll.hasOwnProperty('value') && sides == roll.value))
        {
            classes += ' crit-success';
        }
        if (roll.critical === "failure" || (roll.success === null && roll.hasOwnProperty('value') && roll.value! <= 1 && sides !== 'fate'))
        {
            classes += ' crit-failure';
        }
        if (roll.drop)
        {
            classes += ' die-dropped';
        }
        if (roll.reroll)
        {
            classes += ' die-rerolled';
        }
        if (roll.explode)
        {
            classes += ' die-exploded';
        }
        if (sides === 'fate')
        {
            if (roll.value === 1)
            {
                classes += ' crit-success';
            }
            if (roll.value === -1)
            {
                classes += ' crit-failure';
            }
        }

        if (classes !== '')
        {
            val = `<span class='${classes.trim()}'>${val}</span>`;
        }

        resultString += val;
    });

    // Process modifiers
    let modifiers: string[] = [];
    if (data.dice && data.dice.length > 1)
    {
        for (let index = 0; index < data.dice.length; index++)
        {
            const diceM = data.dice[index];
            if (data.ops && data.ops.length > 0)
            {
                const modifier = data.ops[index - 1];
                if (diceM && diceM.type === 'number' && diceM.value !== undefined && modifier)
                {
                    modifiers.push(modifier + diceM.value.toString());
                }
            }
        }
    }

    if (modifiers.length > 0)
    {
        resultString += `, (${modifiers.join(' ')})`
    }

    resultString += ` = <strong>${total}</strong>`;

    return resultString;
}

function recursiveSearch(obj: Record<string, any>, searchKey: string, results: any[] = [], callback?: (obj: Record<string, any>) => void): any[]
{
    const r = results;
    Object.keys(obj).forEach(key =>
    {
        const value = obj[key];
        if (key === searchKey)
        {
            r.push(value);
            if (callback && typeof callback === 'function')
            {
                callback(obj);
            }
        } else if (value && typeof value === 'object')
        {
            recursiveSearch(value, searchKey, r, callback);
        }
    });
    return r;
}

export function GetGenesysResultsSimple(data: ResultsData)
{
    let rolls: any[] = [];
    rolls = Object.values(recursiveSearch(data, 'rolls')).map(group =>
    {
        return Object.values(group);
    }).flat()

    let total = data.hasOwnProperty('value') ? data.value : rolls.reduce((val, roll) => val + roll.value, 0)
    total = isNaN(total) ? '...' : total;

    if (typeof total === 'string')
    {
        total = {};

        // count up values
        function logValue(value)
        {
            if (value && typeof value === 'string')
            {
                if (total[value])
                {
                    total[value] = total[value] + 1;
                } else
                {
                    total[value] = 1;
                }
            }
        }

        rolls.forEach(roll =>
        {
            // if value is a string
            if (typeof roll.value === 'string')
            {
                logValue(roll.value);
            }

            // if value is an array, then loop and count
            if (Array.isArray(roll.value))
            {
                roll.value.forEach(val =>
                {
                    logValue(val);
                })
            }
        })
    }

    return formatRollResults(total);

    function formatRollResults(rollResults)
    {
        const resultArray: string[] = [];

        for (let key in rollResults)
        {
            const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
            resultArray.push(`${capitalizedKey}(${rollResults[key]})`);
        }

        return resultArray.length > 0 ? resultArray.join(', ') : "blank";
    }
}

export function GetGenesysResults(data: ResultsData)
{
    let rolls: any[] = [];
    rolls = Object.values(recursiveSearch(data, 'rolls')).map(group =>
    {
        return Object.values(group);
    }).flat()

    let total = data.hasOwnProperty('value') ? data.value : rolls.reduce((val, roll) => val + roll.value, 0)
    total = isNaN(total) ? '...' : total;

    let resultString = '<div class="values genesysResults">';
    let totals;

    if (typeof total === 'string')
    {
        total = {}

        // count up values
        function logValue(value, dieType)
        {
            if (value && typeof value === 'string')
            {
                if (total[value])
                {
                    total[value] = total[value] + 1
                } else
                {
                    total[value] = 1
                }
                const icon = `<svg class="symbol"><use xlink:href="${icons}#${value}" /></svg>`
                resultString += `<span class='die-${dieType}'>${icon}</span>`
            }
        }

        rolls.forEach(roll =>
        {
            const dieType = roll.sides;
            // if value is a string
            if (typeof roll.value === 'string')
            {
                logValue(roll.value, dieType);
            }

            // if value is an array, then loop and count
            if (Array.isArray(roll.value))
            {
                roll.value.forEach(val =>
                {
                    logValue(val, dieType);
                })
            }
        })

        // sort the keys by alpha
        const sortedTotals = Object.fromEntries(Object.entries(total).sort())

        totals = Object.entries(sortedTotals).map(([key, val]) =>
        {
            const icon = `<svg class="symbol"><use xlink:href="${icons}#${key}" /></svg>`
            return `<span><span class="tooltip">${icon}<span class="tooltiptext">${key}</span></span><span class="total">:${val}</span></span>`
        })
        // square options ■ ⬛
        if (!totals.length)
        {
            totals.push(`<span><span class="tooltip die-blank">⬛<span class="tooltiptext">blank</span></span></span>`)
        }
    }

    resultString += '</div>'

    if (resultString === "<div class='values genesysResults'></div>")
    {
        resultString = "<div class='values genesysResults'>blank...</div>"
    }
    //const totalResults = document.createRange().createContextualFragment(`<div class="totals">${totals.join('')}</div>`)
    return resultString;
}

export function parseGenesysRoll(rollString)
{
    const diceTypes = {
        'boost': 'boost',
        'setback': 'setback',
        'ability': 'ability',
        'difficulty': 'difficulty',
        'challenge': 'challenge',
        'proficiency': 'proficiency',
    };

    const diceRolls: any[] = [];
    const parts = rollString.toLowerCase().match(/(\d+)([a-z]+)/g);

    if (parts)
    {
        parts.forEach(part =>
        {
            const [, qty, diceType] = part.match(/(\d+)([a-z]+)/);
            if (diceTypes[diceType])
            {
                diceRolls.push({
                    qty: parseInt(qty),
                    sides: diceTypes[diceType],
                    mods: []
                });
            }
        });
    }

    return diceRolls;
}