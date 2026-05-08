import { KurdishLetter } from './types';

export const KURDISH_ALPHABET: KurdishLetter[] = [
  {
    char: 'ئـ',
    name: 'هەمزە',
    exampleWord: 'ئالا',
    exampleTranslation: 'Flag',
    searchKeyword: 'flag',
    audioUrl: '/audio/hamza.mp3',
    examples: [
      { word: 'ئاسک', translation: 'Deer', searchKeyword: 'deer' },
      { word: 'ئەزمان', translation: 'Tongue/Language', searchKeyword: 'tongue' }
    ]
  },
  {
    char: 'ا',
    name: 'ئەلف',
    exampleWord: 'ئاگر',
    exampleTranslation: 'Fire',
    searchKeyword: 'fire',
    audioUrl: '/audio/alif.mp3',
    examples: [
      { word: 'ئاڤ', translation: 'Water', searchKeyword: 'water' },
      { word: 'باخچە', translation: 'Garden', searchKeyword: 'garden' }
    ]
  },
  {
    char: 'ب',
    name: 'بێ',
    exampleWord: 'بەفر',
    exampleTranslation: 'Snow',
    searchKeyword: 'snow',
    audioUrl: '/audio/be.mp3',
    examples: [
      { word: 'بەرخ', translation: 'Lamb', searchKeyword: 'lamb' },
      { word: 'باران', translation: 'Rain', searchKeyword: 'rain' }
    ]
  },
  {
    char: 'پ',
    name: 'پێ',
    exampleWord: 'پشیک',
    exampleTranslation: 'Cat',
    searchKeyword: 'cat',
    audioUrl: '/audio/pe.mp3',
    examples: [
      { word: 'پەلاتینک', translation: 'Butterfly', searchKeyword: 'butterfly' },
      { word: 'پەرتووک', translation: 'Book', searchKeyword: 'book' } 
    ]
  },
  {
    char: 'ت',
    name: 'تێ',
    exampleWord: 'تری',
    exampleTranslation: 'Grapes',
    searchKeyword: 'grapes',
    audioUrl: '/audio/te.mp3',
    examples: [
      { word: 'تانکەر', translation: 'Tanker', searchKeyword: 'tanker truck' },
      { word: 'تبل', translation: 'Finger', searchKeyword: 'finger' }
    ]
  },
  {
    char: 'ج',
    name: 'جیم',
    exampleWord: 'جوتیار',
    exampleTranslation: 'Farmer',
    searchKeyword: 'farmer',
    audioUrl: '/audio/jim.mp3',
    examples: [
      { word: 'جەمەدانی', translation: 'Suitcase', searchKeyword: 'suitcase' }, // ✏️ صُححت الترجمة من Scarf إلى Suitcase
      { word: 'جۆک', translation: 'Chick', searchKeyword: 'chick' }
    ]
  },
  {
    char: 'چ',
    name: 'چێ',
    exampleWord: 'چا',
    exampleTranslation: 'Tea',
    searchKeyword: 'tea',
    audioUrl: '/audio/che.mp3',
    examples: [
      { word: 'چاڤ', translation: 'Eye', searchKeyword: 'eye' },
      { word: 'چێل', translation: 'Cow', searchKeyword: 'cow' }
    ]
  },
  {
    char: 'ح',
    name: 'حێ',
    exampleWord: 'حێشتر',
    exampleTranslation: 'Camel',
    searchKeyword: 'camel',
    audioUrl: '/audio/he_h.mp3',
    examples: [
      { word: 'حەوش', translation: 'Yard', searchKeyword: 'garden' },
    ]
  },
  {
    char: 'خ',
    name: 'خێ',
    exampleWord: 'خالخالووک',
    exampleTranslation: 'Ladybug',
    searchKeyword: 'ladybug',
    audioUrl: '/audio/khe.mp3',
    examples: [
      { word: 'خانی', translation: 'House', searchKeyword: 'house' },
      { word: 'خلیشانک', translation: 'Slide', searchKeyword: 'slide' }
    ]
  },
  {
    char: 'د',
    name: 'دال',
    exampleWord: 'دەست',
    exampleTranslation: 'Hand',
    searchKeyword: 'hand',
    audioUrl: '/audio/dal.mp3',
    examples: [
      { word: 'دەرگەهـ', translation: 'Door', searchKeyword: 'door' },
      { word: 'دادێ', translation: 'Mother', searchKeyword: 'mother' }
    ]
  },
  {
    char: 'ر',
    name: 'رێ (سڤک)',
    exampleWord: 'رۆژ',
    exampleTranslation: 'Sun',
    searchKeyword: 'sun',
    audioUrl: '/audio/re_soft.mp3',
    examples: [
      { word: 'رەنگ', translation: 'Color', searchKeyword: 'rainbow' },
      { word: 'رەز', translation: 'Vineyard', searchKeyword: 'vineyard' }
    ]
  },
  {
    char: 'ڕ',
    name: 'ڕێ (گران)',
    exampleWord: 'ڕووبار',
    exampleTranslation: 'River',
    searchKeyword: 'river',
    audioUrl: '/audio/re_heavy.mp3',
    examples: [
      { word: 'ڕویڤی', translation: 'Fox', searchKeyword: 'fox' },
    ]
  },
  {
    char: 'ز',
    name: 'زێ',
    exampleWord: 'زەیتون',
    exampleTranslation: 'Olive',
    searchKeyword: 'olive',
    audioUrl: '/audio/ze.mp3',
    examples: [
      { word: 'زێر', translation: 'Gold', searchKeyword: 'gold' },
      { word: 'زەڤی', translation: 'Field', searchKeyword: 'field' }
    ]
  },
  {
    char: 'ژ',
    name: 'ژێ',
    exampleWord: 'ژیژی',
    exampleTranslation: 'Hedgehog',
    searchKeyword: 'hedgehog',
    audioUrl: '/audio/zhe.mp3',
    examples: [
      { word: 'کاژ', translation: 'Pine Cones', searchKeyword: 'pine cones' },
      { word: 'ژمارە', translation: 'Number', searchKeyword: 'numbers' }
    ]
  },
  {
    char: 'س',
    name: 'سين',
    exampleWord: 'سێڤ',
    exampleTranslation: 'Apple',
    searchKeyword: 'apple',
    audioUrl: '/audio/sin.mp3',
    examples: [
      { word: 'سوار', translation: 'Rider', searchKeyword: 'riding' },
      { word: 'سەبەتە', translation: 'Basket', searchKeyword: 'basket' }
    ]
  },
  {
    char: 'ش',
    name: 'شين',
    exampleWord: 'شڤان',
    exampleTranslation: 'Shepherd',
    searchKeyword: 'shepherd',
    audioUrl: '/audio/shin.mp3',
    examples: [
      { word: 'شێر', translation: 'Lion', searchKeyword: 'lion' },
      { word: 'شەڤ', translation: 'Night', searchKeyword: 'night' }
    ]
  },
  {
    char: 'ع',
    name: 'عەین',
    exampleWord: 'عەور',
    exampleTranslation: 'Cloud',
    searchKeyword: 'cloud',
    audioUrl: '/audio/ain.mp3',
    examples: [
      { word: 'عەلووک', translation: 'Turkey', searchKeyword: 'turkey' },
      { word: 'عەرد', translation: 'Ground', searchKeyword: 'soil' }
    ]
  },
  {
    char: 'غ',
    name: 'غەین',
    exampleWord: 'غەزال',
    exampleTranslation: 'Gazelle',
    searchKeyword: 'gazelle',
    audioUrl: '/audio/ghain.mp3',
    examples: [
    ]
  },
  {
    char: 'ف',
    name: 'فێ',
    exampleWord: 'فیل',
    exampleTranslation: 'Elephant',
    searchKeyword: 'elephant',
    audioUrl: '/audio/fe.mp3',
    examples: [
      { word: 'فێقێ', translation: 'Fruit', searchKeyword: 'fruit' },
      { word: 'فڕۆکە', translation: 'Airplane', searchKeyword: 'airplane' }
    ]
  },
  {
    char: 'ڤ',
    name: 'ڤێ',
    exampleWord: 'ڤین',
    exampleTranslation: 'Love',
    searchKeyword: 'heart',
    audioUrl: '/audio/ve.mp3',
    examples: [
      { word: 'ڤەبڕ', translation: 'Cutter', searchKeyword: 'knife' },
      { word: 'مروڤ', translation: 'Human', searchKeyword: 'human' }

    ]
  },
  {
    char: 'ق',
    name: 'قاف',
    exampleWord: 'قاز',
    exampleTranslation: 'Goose',
    searchKeyword: 'goose',
    audioUrl: '/audio/qaf.mp3',
    examples: [
      { word: 'قەلە رەشک', translation: 'Crow', searchKeyword: 'crow' },
    ]
  },
  {
    char: 'ک',
    name: 'کاف',
    exampleWord: 'کێڤریشک',
    exampleTranslation: 'Rabbit',
    searchKeyword: 'rabbit',
    audioUrl: '/audio/kaf.mp3',
    examples: [
      { word: 'کەر', translation: 'Donkey', searchKeyword: 'donkey' },
      { word: 'کلیل', translation: 'Key', searchKeyword: 'key' }
    ]
  },
  {
    char: 'گ',
    name: 'گاف',
    exampleWord: 'گول',
    exampleTranslation: 'Flower',
    searchKeyword: 'flower',
    audioUrl: '/audio/gaf.mp3',
    examples: [
      { word: 'گامێش', translation: 'Buffalo', searchKeyword: 'buffalo' },
      { word: 'گەنم', translation: 'Wheat', searchKeyword: 'wheat' }
    ]
  },
  {
    char: 'ل',
    name: 'لام (سۆک)',
    exampleWord: 'لێڤ',
    exampleTranslation: 'Lips',
    searchKeyword: 'lips',
    audioUrl: '/audio/lam_soft.mp3',
    examples: [
      { word: 'بلبل', translation: 'Canary', searchKeyword: 'canary' },
      { word: 'لیمۆ', translation: 'Lemon', searchKeyword: 'lemon' }
    ]
  },
  {
    char: 'ڵ',
    name: 'لام (گران)',
    exampleWord: 'دهوڵ',
    exampleTranslation: 'Drum',
    searchKeyword: 'drum',
    audioUrl: '/audio/lam_heavy.mp3',
    examples: [
      { word: 'گوڵ', translation: 'Flowers', searchKeyword: 'flower' },
    ]
  },
  {
    char: 'م',
    name: 'میم',
    exampleWord: 'مریشک',
    exampleTranslation: 'Chicken',
    searchKeyword: 'chicken',
    audioUrl: '/audio/mim.mp3',
    examples: [
      { word: 'مشک', translation: 'Mouse', searchKeyword: 'mouse' },
      { word: 'مێش', translation: 'Fly', searchKeyword: 'fly insect' }
    ]
  },
  {
    char: 'ن',
    name: 'نوون',
    exampleWord: 'نان',
    exampleTranslation: 'Bread',
    searchKeyword: 'bread',
    audioUrl: '/audio/nun.mp3',
    examples: [
      { word: 'نێرگز', translation: 'Narcissus', searchKeyword: 'narcissus flower' },
      { word: 'نەخۆش', translation: 'Sick/Patient', searchKeyword: 'sick child' } // ✏️ غُيّر من نامە لأنه مكرر مع ـه
    ]
  },
  {
    char: 'و',
    name: 'واو',
    exampleWord: 'وێنە',
    exampleTranslation: 'Picture',
    searchKeyword: 'painting',
    audioUrl: '/audio/waw.mp3',
    examples: [
      { word: 'وەردەک', translation: 'Duck', searchKeyword: 'duck' }
    ]
  },
  {
    char: 'وو',
    name: 'وو (Û)',
    exampleWord: 'دوور',
    exampleTranslation: 'Far',
    searchKeyword: 'telescope',
    audioUrl: '/audio/uu.mp3',
    examples: [
      { word: 'نووک', translation: 'chickpea', searchKeyword: ' chickpea' } 
    ]
  },
  {
    char: 'ۆ',
    name: 'ۆ (Ô)',
    exampleWord: 'گۆپال', // ✏️ غُيّر من رۆژ لأنه مكرر مع حرف ر
    exampleTranslation: 'crutch',
    searchKeyword: 'wooden crutch',
    audioUrl: '/audio/o.mp3',
    examples: [
      { word: 'گۆڵچى', translation: 'Goal Keeper', searchKeyword: 'soccer goalkeeper' },
      { word: 'گۆشت', translation: 'Meat', searchKeyword: 'steak' }
    ]
  },
  {
    char: 'هـ',
    name: 'هێ',
    exampleWord: 'هێک',
    exampleTranslation: 'Egg',
    searchKeyword: 'egg',
    audioUrl: '/audio/he_light.mp3',
    examples: [
      { word: 'هەسپ', translation: 'Horse', searchKeyword: 'horse' },
      { word: 'هنگڤین', translation: 'Honey', searchKeyword: 'honey' }
    ]
  },
  {
    char: 'ـه',
    name: 'ڤەکێشاو (E)',
    exampleWord: 'پەنجەر',
    exampleTranslation: 'Window',
    searchKeyword: 'window',
    audioUrl: '/audio/e_vowel.mp3',
    examples: [
      { word: 'نامە', translation: 'Letter', searchKeyword: 'envelope' },
      { word: 'کێڤژەلە', translation: 'Crab', searchKeyword: 'True Crabs' }
    ]
  },
  {
    char: 'ی',
    name: 'ێی',
    exampleWord: 'یاری',
    exampleTranslation: 'Game',
    searchKeyword: 'toys',
    audioUrl: '/audio/ye.mp3',
    examples: [
      { word: 'دایک', translation: 'Mother', searchKeyword: 'mother' },
      { word: 'یەک', translation: 'One', searchKeyword: 'number 1' }
    ]
  },
  {
    char: 'ێ',
    name: 'ێ (Ê)',
    exampleWord: 'پێلاڤ',
    exampleTranslation: 'Shoes',
    searchKeyword: 'shoes',
    audioUrl: '/audio/ee.mp3',
    examples: [
      { word: 'سێ', translation: 'Three', searchKeyword: 'number 3' },
      { word: 'هێزک', translation: 'Swing', searchKeyword: 'swing' } 
    ]
  }
];

export const BACKGROUND_MUSIC_TRACKS = [
  { id: 1, title: 'Music 1', url: '/audio/music/kids_music_1.mp3' },
  { id: 2, title: 'Music 2', url: '/audio/music/kids_music_2.mp3' },
  { id: 3, title: 'Music 3', url: '/audio/music/kids_music_3.mp3' },
];
