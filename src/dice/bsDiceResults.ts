export function GetResults(data: ResultsData): string
{
    let rolls: Roll[] = [];
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
            resultString += ', ';
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