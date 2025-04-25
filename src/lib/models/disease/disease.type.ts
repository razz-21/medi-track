export enum DiseaseTypeEnum {
	Dengue = 'Dengue',
	Flu = 'Flu',
	Influenza = 'Influenza',
	HIV = 'HIV',
	TB = 'TB'
}

export enum DiseaseICDCodeEnum {
	Dengue = 'A90', // Dengue fever (classical dengue)
	Flu = 'J10.1', // Influenza with other respiratory manifestations, seasonal influenza
	Influenza = 'J11.1', // Influenza, virus not identified, with respiratory manifestations
	HIV = 'B20', // HIV disease resulting in infectious/parasitic diseases
	TB = 'A15.0' // TB of lungs, confirmed by sputum microscopy with or without culture
}

export const DiseaseDefinitions = {
	[DiseaseTypeEnum.Dengue]: 'Dengue fever (classical dengue)',
	[DiseaseTypeEnum.Flu]: 'Influenza with other respiratory manifestations, seasonal influenza',
	[DiseaseTypeEnum.Influenza]: 'Influenza, virus not identified, with respiratory manifestations',
	[DiseaseTypeEnum.HIV]: 'HIV disease resulting in infectious/parasitic diseases',
	[DiseaseTypeEnum.TB]: 'TB of lungs, confirmed by sputum microscopy with or without culture'
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
