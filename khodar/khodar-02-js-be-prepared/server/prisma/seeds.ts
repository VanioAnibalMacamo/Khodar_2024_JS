import { db } from "../src/database";

interface Province {
    province: string;
    district: string []
}

const provinces: Province [] = [
    {
        province: 'Maputo Cidade',
        district: 
            ['Distrito Urbano de KaMpfumo',
            'Distrito Urbano de Nlhamankulu',
            'Distrito Urbano de KaMaxaquene',
            'Distrito Urbano de KaMavota',
            'Distrito Urbano de KaMubukwana',
            'Distrito Municipal de KaTembe',
            'Distrito Municipal de KaNyaka'
            ]
    },
    {
        province: 'Maputo Provincia',
        district: 
        [ 'Boane',
          'Magude',
          'Manhiça',
          'Marracuene',
          'Matola',
          'Matutuíne',
          'Moamba',
          'Namaacha']
    },
    {
        province: 'Gaza',
        district: 
        [   'Bilene',
            'Chibuto',
            'Chicualacuala',
            'Chigubo',
            'Chókwè',
            'Chongoene',
            'Guijá',
            'Limpopo',
            'Mabalane',
            'Manjacaze',
            'Mapai',
            'Massangena',
            'Massingir',
            'Xai-Xai'
        ]
    },
    {
        province: 'Inhambane',
        district: 
        [   'Funhalouro',
            'Govuro',
            'Homoíne',
            'Inhambane',
            'Inharrime',
            'Inhassoro',
            'Jangamo',
            'Mabote',
            'Massinga',
            'Maxixe',
            'Morrumbene',
            'Panda',
            'Vilanculos',
            'Zavala'
        ]
    },
    {
        province: 'Sofala',
        district: 
        [   'Beira',
            'Búzi',
            'Caia',
            'Chemba',
            'Cheringoma',
            'Chibabava',
            'Dondo',
           'Gorongosa',
           'Machanga',
            'Maringué',
            'Marromeu',
            'Muanza' ,
            'Nhamatanda'
        ]
    },
    {
        province: 'Nampula',
        district: 
        [   'Angoche',
            'Eráti',
            'Ilha de Moçambique',
            'Lalaua',
            'Larde',
            'Liúpo',
            'Malema',
            'Meconta',
            'Mecubúri',
            'Memba',
            'Mogincual',
            'Mogovolas',
            'Moma',
            'Monapo',
            'Mossuril',
            'Muecate',
            'Murrupula',
            'Nacala-a-Velha',
            'Nacala Porto',
            'Nacarôa',
            'Nampula',
            'Rapale' ,
            'Ribaué'
        ]
    }

]
   
async function seed(){

   return Promise.all(

    provinces.map(async (province) => {
        await db.province.create({
            data:{
                designation: province.province,
                district : {
                    create: province.district.map((distric) => ({
                        designatio: distric
                    }))
                }
            }
        });
        })
    );
}

seed().then(() => {
    console.log("Seeds created!")
});