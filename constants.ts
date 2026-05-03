
import { KurdishLetter } from './types';

export const KURDISH_ALPHABET: KurdishLetter[] = [
  { 
    char: 'ئـ', 
    name: 'هەمزە', 
    exampleWord: 'ئالا', 
    exampleTranslation: 'Flag', 
    searchKeyword: 'flag', 
    audioUrl: '/audio/hamza.mp3', // مثال لـ رابط ملف صوتي ثابت
    imageUrl: '/images/flag.png',   // مثال لـ رابط صورة ثابتة
    examples: [
      { word: 'ئاسک', translation: 'Deer', searchKeyword: 'deer', audioUrl: '/audio/ask.mp3' }, 
      { word: 'ئەزمان', translation: 'Tongue/Language', searchKeyword: 'tongue' }
    ] 
  },
  { char: 'ا', name: 'ئەلف', exampleWord: 'ئاگر', exampleTranslation: 'Fire', searchKeyword: 'fire', examples: [{ word: 'ئاڤ', translation: 'Water', searchKeyword: 'water' }, { word: 'ئەرد', translation: 'Ground', searchKeyword: 'earth' }] },
  { char: 'ب', name: 'بێ', exampleWord: 'بەفر', exampleTranslation: 'Snow', searchKeyword: 'snow', examples: [{ word: 'بەرخ', translation: 'Lamb', searchKeyword: 'lamb' }, { word: 'باران', translation: 'Rain', searchKeyword: 'rain' }] },
  { char: 'پ', name: 'پێ', exampleWord: 'پشیک', exampleTranslation: 'Cat', searchKeyword: 'cat', examples: [{ word: 'پەلاتینک', translation: 'Butterfly', searchKeyword: 'butterfly' }, { word: 'پێلاڤ', translation: 'Shoes', searchKeyword: 'shoes' }] },
  { char: 'ت', name: 'تێ', exampleWord: 'تری', exampleTranslation: 'Grapes', searchKeyword: 'grapes', examples: [{ word: 'تەیر', translation: 'Bird', searchKeyword: 'bird' }, { word: 'تل', translation: 'Finger', searchKeyword: 'finger' }] },
  { char: 'ج', name: 'جیم', exampleWord: 'جوتیار', exampleTranslation: 'Farmer', searchKeyword: 'farmer', examples: [{ word: 'جەمەدانی', translation: 'Scarf', searchKeyword: 'scarf' }, { word: 'جۆک', translation: 'Chick', searchKeyword: 'chick' }] },
  { char: 'چ', name: 'چێ', exampleWord: 'چا', exampleTranslation: 'Tea', searchKeyword: 'tea', examples: [{ word: 'چاڤ', translation: 'Eye', searchKeyword: 'eye' }, { word: 'چێل', translation: 'cow', searchKeyword: 'cow' }] },
  { char: 'ح', name: 'حێ', exampleWord: 'حێشتر', exampleTranslation: 'Camel', searchKeyword: 'camel', examples: [{ word: 'حەوشە', translation: 'Yard', searchKeyword: 'garden' }, { word: 'حەیوان', translation: 'Animal', searchKeyword: 'animals' }] },
  { char: 'خ', name: 'خێ', exampleWord: 'خالخالوک', exampleTranslation: 'Ladybug', searchKeyword: 'ladybug', examples: [{ word: 'خانوو', translation: 'House', searchKeyword: 'house' }, { word: 'خوارن', translation: 'Food', searchKeyword: 'food' }] },
  { char: 'د', name: 'دال', exampleWord: 'دەست', exampleTranslation: 'Hand', searchKeyword: 'hand', examples: [{ word: 'دەرگەهـ', translation: 'Door', searchKeyword: 'door' }, { word: 'دادێ', translation: 'Mother', searchKeyword: 'woman,mother' }] },
  { char: 'ر', name: 'رێ (سڤک)', exampleWord: 'رۆژ', exampleTranslation: 'Sun', searchKeyword: 'sun', examples: [{ word: 'رەنگ', translation: 'Color', searchKeyword: 'rainbow' }, { word: 'رەز', translation: 'Vineyard', searchKeyword: 'vineyard' }] },
  { char: 'ڕ', name: 'ڕێ (گران)', exampleWord: 'چێل', exampleTranslation: 'Cow', searchKeyword: 'cow', examples: [{ word: 'بڕەر', translation: 'Saw', searchKeyword: 'saw' }, { word: 'گەڕ', translation: 'Tour', searchKeyword: 'walking' }] },
  { char: 'ز', name: 'زێ', exampleWord: 'زەیتون', exampleTranslation: 'Olive', searchKeyword: 'olive', examples: [{ word: 'زێر', translation: 'Gold', searchKeyword: 'gold' }, { word: 'زەڤی', translation: 'Field', searchKeyword: 'field' }] },
  { char: 'ژ', name: 'ژێ', exampleWord: 'ژیژی', exampleTranslation: 'Hedgehog', searchKeyword: 'hedgehog', examples: [{ word: 'ژن', translation: 'Woman', searchKeyword: 'woman' }, { word: 'ژمارە', translation: 'Number', searchKeyword: 'numbers' }] },
  { char: 'س', name: 'سین', exampleWord: 'سێڤ', exampleTranslation: 'Apple', searchKeyword: 'apple', examples: [{ word: 'سوار', translation: 'Rider', searchKeyword: 'riding' }, { word: 'سەبەتە', translation: 'Basket', searchKeyword: 'basket' }] },
  { char: 'ش', name: 'شین', exampleWord: 'شڤان', exampleTranslation: 'Shepherd', searchKeyword: 'shepherd', examples: [{ word: 'شێر', translation: 'Lion', searchKeyword: 'lion' }, { word: 'شەڤ', translation: 'Night', searchKeyword: 'night' }] },
  { char: 'ع', name: 'عەین', exampleWord: 'عەور', exampleTranslation: 'Cloud', searchKeyword: 'cloud', examples: [{ word: 'عەلوک', translation: 'turkey', searchKeyword: 'turkey' }, { word: 'عەرد', translation: 'Ground', searchKeyword: 'soil' }] },
  { char: 'غ', name: 'غەین', exampleWord: 'غەزال', exampleTranslation: 'Gazelle', searchKeyword: 'gazelle', examples: [{ word: 'غەریب', translation: 'Stranger', searchKeyword: 'traveler' }] },
  { char: 'ف', name: 'فێ', exampleWord: 'فیل', exampleTranslation: 'Elephant', searchKeyword: 'elephant', examples: [{ word: 'فێقێ', translation: 'Fruit', searchKeyword: 'fruit' }, { word: 'فڕۆکە', translation: 'Airplane', searchKeyword: 'airplane' }] },
  { char: 'ڤ', name: 'ڤێ', exampleWord: 'ڤین', exampleTranslation: 'Will/Love', searchKeyword: 'heart', examples: [{ word: 'ڤەبڕ', translation: 'Cutter', searchKeyword: 'knife' }] },
  { char: 'ق', name: 'قاف', exampleWord: 'قاز', exampleTranslation: 'Goose', searchKeyword: 'goose', examples: [{ word: 'قەل', translation: 'Crow', searchKeyword: 'crow' }, { word: 'قەلەم', translation: 'Pen', searchKeyword: 'pencil' }] },
  { char: 'ک', name: 'کاف', exampleWord: 'کێڤریشک', exampleTranslation: 'Rabbit', searchKeyword: 'rabbit', examples: [{ word: 'کەر', translation: 'donkey', searchKeyword: 'donkey' }, { word: 'کەڤن', translation: 'Old', searchKeyword: 'antique' }] },
  { char: 'گ', name: 'گاف', exampleWord: 'گول', exampleTranslation: 'Flower', searchKeyword: 'flower', examples: [{ word: 'گیسک', translation: 'Young Goat', searchKeyword: 'goat' }, { word: 'گەنم', translation: 'Wheat', searchKeyword: 'wheat' }] },
  { char: 'ل', name: 'لام (سۆک)', exampleWord: 'لێڤ', exampleTranslation: 'Lips', searchKeyword: 'lips', examples: [{ word: 'بلبل', translation: 'canary/bird', searchKeyword: 'canary' }, { word: 'لیمۆ', translation: 'Lemon', searchKeyword: 'lemon' }] },
  { char: 'ڵ', name: 'لام (گران)', exampleWord: 'دهوڵ', exampleTranslation: 'Drum', searchKeyword: 'drum', examples: [{ word: 'گوڵ', translation: 'Flowers', searchKeyword: 'flower' }, { word: 'کەڵ', translation: 'Bull', searchKeyword: 'bull' }] },
  { char: 'م', name: 'میم', exampleWord: 'مریشک', exampleTranslation: 'Chicken', searchKeyword: 'chicken', examples: [{ word: 'مشک', translation: 'mouse', searchKeyword: 'mouse' }, { word: 'مێش', translation: 'Fly', searchKeyword: 'fly' }] },
  { char: 'ن', name: 'نوون', exampleWord: 'نان', exampleTranslation: 'Bread', searchKeyword: 'bread', examples: [{ word: 'نێرگز', translation: 'Narcissus', searchKeyword: 'flower' }, { word: 'نامە', translation: 'Letter', searchKeyword: 'envelope' }] },
  { char: 'و', name: 'واو', exampleWord: 'وێنە', exampleTranslation: 'Picture', searchKeyword: 'painting', examples: [{ word: 'وەلات', translation: 'Country', searchKeyword: 'globe' }] },
  { char: 'وو', name: 'وو (Û)', exampleWord: 'دوور', exampleTranslation: 'Far', searchKeyword: 'telescope', examples: [{ word: 'لوولەک', translation: 'Tube', searchKeyword: 'cylinder' }] },
  { char: 'ۆ', name: 'ۆ (Ô)', exampleWord: 'رۆژ', exampleTranslation: 'Sun', searchKeyword: 'sun', examples: [{ word: 'گۆڵچى', translation: 'goal keeper', searchKeyword: 'soccer,player' }, { word: 'گۆشت', translation: 'Meat', searchKeyword: 'steak' }] },
  { char: 'هـ', name: 'هێ', exampleWord: 'هێک', exampleTranslation: 'Egg', searchKeyword: 'egg', examples: [{ word: 'هەسپ', translation: 'Horse', searchKeyword: 'horse' }, { word: 'هەنگ', translation: 'Bee', searchKeyword: 'bee' }] },
  { char: 'ـه', name: 'ڤەکێشاو (E)', exampleWord: 'پەنجەر', exampleTranslation: 'Window', searchKeyword: 'window', examples: [{ word: 'نامە', translation: 'Letter', searchKeyword: 'envelope' }, { word: 'کاسە', translation: 'Bowl', searchKeyword: 'bowl' }] },
  { char: 'ی', name: 'ێی', exampleWord: 'یاری', exampleTranslation: 'Game', searchKeyword: 'toys', examples: [{ word: 'دایک', translation: 'mother', searchKeyword: 'mother' }, { word: 'یەک', translation: 'One', searchKeyword: 'number1' }] },
  { char: 'ێ', name: 'ێ (Ê)', exampleWord: 'پێلاڤ', exampleTranslation: 'Shoes', searchKeyword: 'shoes', examples: [{ word: 'سێ', translation: 'Three', searchKeyword: 'number3' }, { word: 'بێ', translation: 'Without', searchKeyword: 'empty' }] },
];
