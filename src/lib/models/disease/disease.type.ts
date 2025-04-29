export enum DiseaseTypeEnum {
	Dengue = 'Dengue',
	Influenza = 'Influenza',
	TB = 'TB',
	Covid19 = 'Covid19',
	HIV = 'HIV'
}

export enum DiseaseICDCodeEnum {
	Dengue = 'A90', // Dengue fever (classical dengue)
	Influenza = 'J11.1', // Influenza, virus not identified, with respiratory manifestations
	TB = 'A15.0', // TB of lungs, confirmed by sputum microscopy with or without culture
	Covid19 = 'U07.1', // COVID-19, virus identified
	HIV = 'B20' // HIV disease resulting in infectious/parasitic diseases
}

export const DiseaseDefinitions = {
	[DiseaseTypeEnum.Dengue]: 'Dengue fever (classical dengue)',
	[DiseaseTypeEnum.Influenza]: 'Influenza, virus not identified, with respiratory manifestations',
	[DiseaseTypeEnum.HIV]: 'HIV disease resulting in infectious/parasitic diseases',
	[DiseaseTypeEnum.TB]: 'TB of lungs, confirmed by sputum microscopy with or without culture',
	[DiseaseTypeEnum.Covid19]: 'COVID-19, virus identified'
};

export enum DiseaseModeTransmissionEnum {
	NA = 'N/A',
	Airborne = 'Airborne',
	Contact = 'Contact',
	Vector = 'Vector',
	Food = 'Food',
	Water = 'Water',
	Blood = 'Blood',
	Unknown = 'Unknown',
	Others = 'Others'
}
