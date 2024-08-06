import { transformContainsFilter } from './transformContainsFilter';
import { transformInFilter } from './transformInFilter';

export function transformFilter(filter: Record<string, any>) {
    const transformedFilters: Record<string, any> = {};
    for (const [key, value] of Object.entries(filter)) {
        if (
            key.endsWith('@eq') ||
            key.endsWith('@neq') ||
            key.endsWith('@lt') ||
            key.endsWith('@lte') ||
            key.endsWith('@gt') ||
            key.endsWith('@gte')
        ) {
            const lastIndexOfAt = key.lastIndexOf('@');
            transformedFilters[
                `${key.substring(0, lastIndexOfAt)}_${key.substring(lastIndexOfAt + 1)}`
            ] = value;
            continue;
        }

        if (key.endsWith('@in')) {
            transformedFilters[`${key.slice(0, -3)}_eq_any`] =
                transformInFilter(value);
            continue;
        }

        if (key.endsWith('@cs')) {
            transformedFilters[`${key.slice(0, -3)}`] =
                transformContainsFilter(value);
            continue;
        }

        transformedFilters[key] = value;
    }
    return transformedFilters;
}
