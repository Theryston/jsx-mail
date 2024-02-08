function getCountries(lang = 'en') {
	const A = 65;
	const Z = 90;
	const countryName = new Intl.DisplayNames([lang], { type: 'region' });
	const countries: any = {};
	for (let i = A; i <= Z; ++i) {
		for (let j = A; j <= Z; ++j) {
			let code = String.fromCharCode(i) + String.fromCharCode(j);
			let name = countryName.of(code);
			if (code !== name) {
				countries[code] = name;
			}
		}
	}
	return countries;
}

export const COUNTRIES = Object.keys(getCountries())
	.map((key) => ({
		code: key,
		name: getCountries()[key],
	}))
	.sort((a, b) => a.name.localeCompare(b.name));
