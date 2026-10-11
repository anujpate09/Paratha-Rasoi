export const PHONE = '+919719666616'
export const PHONE_DISPLAY = '+91 97196 66616'
export const WHATSAPP = '919719666616'
export const INSTAGRAM = 'https://www.instagram.com/paratha.rasoi/'
export const ZOMATO_BOOKING = 'https://www.zomato.com/bangalore/paratha-rasoi-varthur-main-road-whitefield-bangalore/book'
export const FACEBOOK = 'https://www.facebook.com/share/1Dj3cF8EcS/'

// Section ids; their labels live in src/i18n.jsx under nav.*
export const NAV_LINKS = ['home', 'menu', 'speciality', 'about', 'visit', 'reviews', 'contact']

export const FEATURES = [
  { icon: 'steam', key: 'fresh' },
  { icon: 'sparkle', key: 'flavours' },
  { icon: 'family', key: 'family' },
]

export const DISHES = [
  {
    name: 'Aloo Cheese Paratha',
    description: 'Comforting spiced potato and melted cheese inside a crisp paratha.',
    descriptionHi: 'कुरकुरे पराठे में मसालेदार आलू और पिघला हुआ चीज़।',
    descriptionKn: 'ಗರಿಗರಿಯಾದ ಪರಾಠದೊಳಗೆ ಮಸಾಲೆ ಆಲೂಗಡ್ಡೆ ಮತ್ತು ಕರಗಿದ ಚೀಸ್.',
    price: 199,
    image: '/assets/signature-paratha.webp',
    alt: 'Aloo cheese paratha with butter',
  },
  {
    name: 'Chilli Paneer',
    description: 'Paneer, peppers, and onions tossed in a bold Indo-Chinese sauce.',
    descriptionHi: 'पनीर, शिमला मिर्च और प्याज़, तीखी इंडो-चाइनीज़ सॉस में।',
    descriptionKn: 'ಪನೀರ್, ದೊಣ್ಣೆ ಮೆಣಸಿನಕಾಯಿ ಮತ್ತು ಈರುಳ್ಳಿ, ಖಾರವಾದ ಇಂಡೋ-ಚೈನೀಸ್ ಸಾಸ್‌ನಲ್ಲಿ.',
    price: 249,
    image: '/assets/paneer-tikka.webp',
    alt: 'Chilli paneer with peppers and onions',
  },
  {
    name: 'Butter Chicken',
    description: 'Tender chicken in a creamy tomato and butter gravy.',
    descriptionHi: 'मलाईदार टमाटर-मक्खन ग्रेवी में नरम चिकन।',
    descriptionKn: 'ಕೆನೆಭರಿತ ಟೊಮೆಟೊ-ಬೆಣ್ಣೆ ಗ್ರೇವಿಯಲ್ಲಿ ಮೃದುವಾದ ಚಿಕನ್.',
    price: 339,
    image: '/assets/butter-chicken.webp',
    alt: 'Butter chicken served in a copper bowl',
  },
  {
    name: 'Dhabe Wala Dal Fry',
    description: 'Homestyle lentils tempered with aromatic spices and fresh coriander.',
    descriptionHi: 'घर जैसी दाल, ख़ुशबूदार तड़के और हरे धनिये के साथ।',
    descriptionKn: 'ಮನೆಯಂತಹ ದಾಲ್, ಘಮಘಮಿಸುವ ಒಗ್ಗರಣೆ ಮತ್ತು ತಾಜಾ ಕೊತ್ತಂಬರಿಯೊಂದಿಗೆ.',
    price: 199,
    image: '/assets/dal-makhani.webp',
    alt: 'Dhabe wala dal fry garnished with coriander',
  },
]

export const SPECIALITY = {
  name: 'Chicken Ghee Roast Paratha',
  price: 289,
  image: '/assets/signature-paratha.webp',
}

export const TIMES = ['12:00 PM', '1:00 PM', '6:00 PM', '7:00 PM', '8:00 PM']

export const TOPICS = ['General enquiry', 'Party / bulk order', 'Table booking', 'Feedback']

// Full menu, transcribed from public/assets/paratha-rasoi-menu.jpg. Used by header search.
export const MENU = [
  {
    category: 'Classic Paratha',
    items: [
      ['Aloo Paratha', 139], ['Aloo Pyaz Paratha', 149], ['Punjabi Anardana Aloo Paratha', 159],
      ['Paneer Paratha', 179], ['Gobi Paratha', 149], ['Matar Paratha', 149], ['Aloo Matar Paratha', 149],
      ['Sattu Paratha', 159], ['Onion Ajwain Paratha', 139], ['Plain Paratha', 79], ['Egg Bhurji Paratha', 189],
      ['Egg Chicken Paratha', 219], ['Chicken Keema Paratha', 249],
    ],
  },
  {
    category: 'Signature Paratha',
    items: [
      ['Aloo Cheese Paratha', 199], ['Cheese Garlic Paratha', 209], ['Chilli Cheese Paratha', 209],
      ['Chicken Cheese Paratha', 269], ['Paneer Ghee Roast Paratha', 249], ['Chicken Ghee Roast Paratha', 289],
    ],
  },
  {
    category: 'Curry',
    items: [
      ['Paneer Butter Masala', 259], ['Matar Paneer', 239], ['Kadhai Paneer', 259], ['Mix Veg Masala', 219],
      ['Chatpate Aloo Dry', 189], ['Dhabe Wala Dal Fry', 199], ['Chole Masala', 199], ['Chilli Paneer', 249],
      ['Kadhai Chicken', 309], ['Bhuna Chicken', 319], ['Butter Chicken', 339], ['Chilli Chicken Gravy', 319],
      ['Pepper Chicken', 319],
    ],
  },
  {
    category: 'Starter',
    items: [
      ['Chicken Pakora', 269], ['Chicken Drumsticks', 289], ['Pepper Chicken', 299], ['Chicken Majestic', 299],
      ['Chicken 65', 279], ['Chana Chilli', 199], ['Pepper Paneer', 249], ['Chilli Paneer Dry', 249],
      ['Chilli Chicken Dry', 299],
    ],
  },
  {
    category: 'Rice',
    items: [
      ['Steam Rice', 129], ['Jeera Rice', 159], ['Veg Fried Rice', 209], ['Egg Fried Rice', 229],
      ['Paneer Fried Rice', 239], ['Chicken Fried Rice', 269],
    ],
  },
  {
    category: 'Add-on',
    items: [['Extra Butter', 25], ['Extra Curd', 49], ['Mint Chutney', 29], ['Pickle', 25], ['Lachha Pyaz', 39]],
  },
  {
    category: 'Combos',
    items: [
      ['Aloo Paratha + Chole + Dahi', 199], ['4 Puri + Aloo Jeera + Chutney + Onion', 189],
      ['4 Puri + Aloo Sabji + Dahi', 209], ['4 Puri + Chole + Dahi', 199],
      ['2 Paratha Meal (Any 2 Classic + Curd + Pickle)', 279],
      ['2 Paratha Non-Veg Meal (Chicken Keema + 1 Classic + Curd + Pickle + Butter + Mint Chutney)', 329],
      ['Punjabi Meal (2 Classic + Chole + Curd)', 309], ['Chole Chawal', 219], ['3 Plain Paratha + Kadhai Paneer', 219],
      ['3 Plain Paratha + Bhuna Chicken', 269], ['Jeera Rice + Dhabewala Dal Fry', 169],
    ],
  },
]
