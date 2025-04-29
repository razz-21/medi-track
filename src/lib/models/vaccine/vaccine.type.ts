export enum VaccineTypeEnum {
	BCG = 'BCG',
	HepaB1 = 'HepaB1',
	Polio = 'Polio',
	PCV = 'PCV',
	MMR = 'MMR',
	Covid19 = 'COVID-19'
}

export enum Covid19VaccineTypeEnum {
	Pfizer = 'Pfizer',
	Moderna = 'Moderna',
	AstraZeneca = 'AstraZeneca',
	JohnsonJohnson = 'Johnson & Johnson'
}

export const vaccineDefinitions: Record<VaccineTypeEnum, string> = {
	[VaccineTypeEnum.BCG]: 'Given at birth to prevent tuberculosis',
	[VaccineTypeEnum.HepaB1]: 'First dose at birth to prevent hepatitis B',
	[VaccineTypeEnum.Polio]: 'Multiple doses in infancy to prevent polio',
	[VaccineTypeEnum.PCV]: 'Multiple doses to prevent pneumococcal infections',
	[VaccineTypeEnum.Covid19]: 'Initial doses plus boosters to prevent COVID-19',
	[VaccineTypeEnum.MMR]: 'Initial dose plus boosters to prevent measles, mumps, and rubella'
};
