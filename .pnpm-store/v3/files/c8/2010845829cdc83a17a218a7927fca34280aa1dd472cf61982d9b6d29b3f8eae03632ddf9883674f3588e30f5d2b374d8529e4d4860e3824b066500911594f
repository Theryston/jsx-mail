"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
/**
 * A command is user-callable function that runs stuff.
 */
var Command = /** @class */ (function () {
    function Command(props) {
        this.name = null;
        this.description = null;
        this.file = null;
        this.run = null;
        this.hidden = false;
        this.commandPath = null;
        this.alias = [];
        this.dashed = false;
        this.plugin = null;
        if (props)
            Object.assign(this, props);
    }
    Object.defineProperty(Command.prototype, "aliases", {
        /**
         * Returns normalized list of aliases.
         *
         * @returns list of aliases.
         */
        get: function () {
            if (!this.alias)
                return [];
            return Array.isArray(this.alias) ? this.alias : [this.alias];
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Checks if the command has any aliases at all.
     *
     * @returns whether the command has any aliases
     */
    Command.prototype.hasAlias = function () {
        return this.aliases.length > 0;
    };
    /**
     * Checks if a given alias matches with this command's aliases, including name.
     * Can take a list of aliases too and check them all.
     *
     * @param alias
     * @returns whether the alias[es] matches
     */
    Command.prototype.matchesAlias = function (alias) {
        var _this = this;
        var aliases = Array.isArray(alias) ? alias : [alias];
        return Boolean(aliases.find(function (a) { return _this.name === a || _this.aliases.includes(a); }));
    };
    return Command;
}());
exports.Command = Command;
//# sourceMappingURL=command.js.map