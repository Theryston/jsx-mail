export interface GluegunSemver {
    valid(version: string): string | null;
    clean(version: string): string | null;
    satisfies(version: string, inVersion: string): boolean;
    gt(version: string, isGreaterThanVersion: string): boolean;
    lt(version: string, isLessThanVersion: string): boolean;
    validRange(range: string): boolean | null;
}
