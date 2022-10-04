import { GluegunSemver } from './semver-types';
/**
 * We're replicating the interface of semver in order to
 * "lazy load" the package only if and when we actually are asked for it.
 * This results in a significant speed increase.
 */
declare const semver: GluegunSemver;
export { semver, GluegunSemver };
