import type { UUIDSchema } from './common.schema';
import type { z } from 'zod';

export type UUID = z.infer<typeof UUIDSchema>;

export enum GenderEnum {
	MALE = 'male',
	FEMALE = 'female'
}

export type Gender = (typeof GenderEnum)[keyof typeof GenderEnum];

export enum BaranggayEnum {
	Poblacion = 'Poblacion',
	Sinaloc = 'Sinaloc',
	Bolisong = 'Bolisong',
	PedroSaBaculio = 'PSB',
	Molugan = 'Molugan',
	Quibonbon = 'Quibonbon',
	Sambulawan = 'Sambulawan',
	Ulaliman = 'Ulaliman',
	Kalabaylabay = 'Kalabaylabay',
	Amoros = 'Amoros',
	Taytay = 'Taytay',
	Hinigdaan = 'Hinigdaan',
	Himaya = 'Himaya',
	Cogon = 'Cogon',
	Others = 'Others'
}
