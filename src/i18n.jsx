import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// All site copy in English, Kannada and Hindi. Edit wording here; components read it through useLang().
// A title written as [plain, highlighted] renders the second part in the accent colour.
const STRINGS = {
  en: {
    meta: { title: 'Paratha Rasoi — Authentic North Indian Food' },
    lang: { switch: 'Switch language' },
    nav: {
      home: 'Home', menu: 'Menu', speciality: 'Our Speciality', about: 'About Us',
      visit: 'Visit', visitUs: 'Visit Us', reviews: 'Reviews', contact: 'Contact',
    },
    header: {
      search: 'Search the menu', whatsapp: 'Order on WhatsApp', reserve: 'Reserve a Table',
      openNav: 'Open navigation', closeNav: 'Close navigation', mainNav: 'Main navigation',
    },
    hero: {
      eyebrow: 'Authentic North Indian',
      line1: 'Stuffed With Love,', line2: 'Served With', line3: 'Happiness',
      description: 'Freshly made parathas and comforting North Indian favourites in the heart of Gunjur.',
      order: 'Order Now', call: 'Call Us',
    },
    features: {
      fresh: ['Freshly Made', 'Prepared after you order'],
      flavours: ['North Indian Flavours', 'Comfort food done right'],
      family: ['Family Friendly', 'Dine-in, takeout & delivery'],
    },
    signature: {
      eyebrow: "Chef's favorites",
      title: ['Signature ', 'Collection'],
      intro: 'Handpicked favorites from our menu, crafted with passion and designed to leave a lasting impression.',
      viewMenu: 'View Full Menu',
    },
    speciality: {
      badge: 'House Signature',
      eyebrow: 'Our speciality',
      title: ['Chicken Ghee Roast ', 'Paratha'],
      body: 'Our signature paratha pairs a crisp, freshly cooked exterior with a rich chicken ghee roast filling. It is bold, warming, and made to order for a satisfying North Indian meal.',
      price: 'Price', bestWith: 'Best with', bestWithValue: 'Curd & Mint Chutney',
      call: 'Call to Order',
    },
    fullMenu: {
      eyebrow: 'Complete selection',
      title: ['Explore Our ', 'Menu'],
      intro: 'Classic and signature parathas, curries, starters, rice, combos, and add-ons.',
      hint: 'Tap to view full menu', open: 'Open the full menu',
      viewerTitle: 'Our Menu', zoomIn: 'Zoom in', fit: 'Fit to screen', close: 'Close menu',
    },
    story: {
      caption: 'Our dining room · LG City, Gunjur',
      eyebrow: 'Our story',
      title: ['Good Food, ', 'Happy Mood'],
      p1: 'Paratha Rasoi opened at LG City, Gunjur in August 2026 with one simple idea: parathas the way they’re made at home. Rolled when you order, stuffed generously and served hot off the tawa with butter, curd and pickle.',
      p2: 'Step into our bright, colourful dining room for a meal with family and friends, or take your favourites home. Alongside the parathas you’ll find North Indian curries, starters, rice and value combos.',
      opened: ['Aug 2026', 'Opened in Gunjur'],
      rating: '{n} Google reviews',
      price: 'Approx. for two',
    },
    visit: {
      eyebrow: 'Location & contact',
      title: ['Visit ', 'Paratha Rasoi'],
      call: 'Call {phone}',
      storefront: 'Look for our sign at LG City, Gunjur – Nerige Road',
      address: 'Address', directions: 'Get directions →',
      hours: 'Opening Hours', days: 'Tuesday–Sunday', closed: 'Monday: Closed',
      dining: 'Dining Options', diningText: 'Dine-in, takeout, and delivery.',
      diningNote: 'Family-friendly casual counter and table service',
    },
    reviews: {
      eyebrow: 'What our guests say',
      title: ['Google ', 'reviews'],
      count: '{n} reviews',
      viewAll: 'View all reviews',
      readMore: 'Read more', showLess: 'Show less',
      prev: 'Previous reviews', next: 'Next reviews',
    },
    contact: {
      eyebrow: 'Get in touch',
      title: ['Contact ', 'Us'],
      intro: "Questions, party orders or feedback? Send us a message and we'll get back to you soon.",
      callUs: 'Call us', whatsapp: 'WhatsApp', chat: 'Chat with us', days: 'Tue–Sun',
      mapTitle: 'Map showing Paratha Rasoi in Gunjur, Bengaluru',
      name: 'Your name', phone: 'Phone', topic: 'Topic', message: 'Message',
      messagePlaceholder: 'How can we help?',
      send: 'Send via WhatsApp',
      sent: 'WhatsApp opened with your message. Just tap send!',
      topics: {
        'General enquiry': 'General enquiry', 'Party / bulk order': 'Party / bulk order',
        'Table booking': 'Table booking', Feedback: 'Feedback',
      },
    },
    footer: {
      tagline: 'Authentic North Indian food, freshly made and always served with happiness.',
      quickLinks: 'Quick Links', contactUs: 'Contact Us',
      hours1: 'Tue–Sun: 12–3:30 PM', hours2: '& 5:30–11:30 PM', closed: 'Monday: Closed',
      order: 'Order', orderText: 'Call us for takeout and delivery, or drop in for dine-in.',
      callToOrder: 'Call to order', contactBtn: 'Contact us',
      rights: '© {year} Paratha Rasoi. All rights reserved.',
      privacy: 'Privacy Policy', motto: 'Good Food • Happy Mood',
      facebook: 'Paratha Rasoi on Facebook', instagram: 'Paratha Rasoi on Instagram',
    },
    reserve: {
      title: 'Reserve a table', subtitle: 'Plan a relaxed meal at Paratha Rasoi.',
      close: 'Close reservation form',
      name: 'Your name', phone: 'Phone', date: 'Date', time: 'Time', selectTime: 'Select a time',
      guests: 'Guests', partySize: 'Party size',
      submit: 'Get OTP on WhatsApp', sending: 'Sending…', or: 'or', zomato: 'Book on Zomato',
      otpSent: 'We sent a 6-digit OTP to {phone} on WhatsApp. Enter it below to confirm your booking.',
      otp: 'OTP', verify: 'Verify & book', verifying: 'Verifying…',
      resend: 'Resend OTP', resendIn: 'Resend OTP in {s}s', changeNumber: 'Change details',
      success: "Thanks! Your table request is saved. We'll call you to confirm.",
      alsoWhatsapp: 'Also message us on WhatsApp',
      submitWhatsapp: 'Request via WhatsApp', openWhatsapp: 'Open WhatsApp again',
      successWhatsapp: ['Thanks! WhatsApp is open with your booking details. Tap ', 'Send', " so we get it right away, and we'll call you to confirm."],
    },
    search: {
      label: 'Search the menu', input: 'Search dishes', placeholder: 'Search dishes, e.g. paneer',
      close: 'Close search', popular: 'Popular searches',
      suggestions: ['Paratha', 'Paneer', 'Chicken', 'Combo', 'Rice'],
      found: '{n} dishes found', foundOne: '1 dish found', none: 'No dishes match “{q}”',
      fullMenu: 'See the full menu', order: 'Order {name} on WhatsApp',
    },
  },

  hi: {
    meta: { title: 'पराठा रसोई — असली नॉर्थ इंडियन खाना' },
    lang: { switch: 'भाषा बदलें' },
    nav: {
      home: 'होम', menu: 'मेन्यू', speciality: 'हमारी ख़ासियत', about: 'हमारे बारे में',
      visit: 'पता', visitUs: 'हमसे मिलें', reviews: 'रिव्यू', contact: 'संपर्क',
    },
    header: {
      search: 'मेन्यू में खोजें', whatsapp: 'WhatsApp पर ऑर्डर करें', reserve: 'टेबल बुक करें',
      openNav: 'मेन्यू खोलें', closeNav: 'मेन्यू बंद करें', mainNav: 'मुख्य नेविगेशन',
    },
    hero: {
      eyebrow: 'असली नॉर्थ इंडियन स्वाद',
      line1: 'हर पराठे में प्यार,', line2: 'हर निवाले में', line3: 'ख़ुशी',
      description: 'गुंजूर के दिल में ताज़े बने पराठे और घर जैसा नॉर्थ इंडियन खाना।',
      order: 'अभी ऑर्डर करें', call: 'कॉल करें',
    },
    features: {
      fresh: ['ताज़ा बना', 'आपके ऑर्डर के बाद बनाया जाता है'],
      flavours: ['नॉर्थ इंडियन स्वाद', 'घर जैसा सुकून भरा खाना'],
      family: ['फ़ैमिली के लिए', 'डाइन-इन, टेकअवे और डिलीवरी'],
    },
    signature: {
      eyebrow: 'शेफ़ की पसंद',
      title: ['सिग्नेचर ', 'डिशेज़'],
      intro: 'हमारे मेन्यू की चुनिंदा डिशेज़, जिन्हें दिल से बनाया जाता है और जिनका स्वाद लंबे समय तक याद रहता है।',
      viewMenu: 'पूरा मेन्यू देखें',
    },
    speciality: {
      badge: 'हमारी ख़ास डिश',
      eyebrow: 'हमारी ख़ासियत',
      title: ['चिकन घी रोस्ट ', 'पराठा'],
      body: 'हमारा सिग्नेचर पराठा: बाहर से कुरकुरा और ताज़ा सिका हुआ, अंदर भरपूर चिकन घी रोस्ट। दमदार, गरमागरम और आपके ऑर्डर पर बनाया गया, ताकि आपका नॉर्थ इंडियन खाना पूरा हो जाए।',
      price: 'दाम', bestWith: 'इसके साथ खाएँ', bestWithValue: 'दही और पुदीने की चटनी',
      call: 'कॉल करके ऑर्डर करें',
    },
    fullMenu: {
      eyebrow: 'पूरा मेन्यू',
      title: ['हमारा ', 'मेन्यू'],
      intro: 'क्लासिक और सिग्नेचर पराठे, करी, स्टार्टर, राइस, कॉम्बो और ऐड-ऑन।',
      hint: 'पूरा मेन्यू देखने के लिए टैप करें', open: 'पूरा मेन्यू खोलें',
      viewerTitle: 'हमारा मेन्यू', zoomIn: 'ज़ूम करें', fit: 'स्क्रीन पर फ़िट करें', close: 'मेन्यू बंद करें',
    },
    story: {
      caption: 'हमारा डाइनिंग रूम · LG सिटी, गुंजूर',
      eyebrow: 'हमारी कहानी',
      title: ['अच्छा खाना, ', 'अच्छा मूड'],
      p1: 'पराठा रसोई अगस्त 2026 में LG सिटी, गुंजूर में एक सीधी-सी सोच के साथ खुला: पराठे बिल्कुल वैसे, जैसे घर पर बनते हैं। आपके ऑर्डर पर बेले जाते हैं, भरपूर भरावन के साथ, और तवे से सीधे गरमागरम परोसे जाते हैं, मक्खन, दही और अचार के साथ।',
      p2: 'परिवार और दोस्तों के साथ खाने के लिए हमारे रंग-बिरंगे डाइनिंग रूम में आइए, या अपनी पसंदीदा डिशेज़ घर ले जाइए। पराठों के साथ यहाँ नॉर्थ इंडियन करी, स्टार्टर, राइस और किफ़ायती कॉम्बो भी मिलते हैं।',
      opened: ['अगस्त 2026', 'गुंजूर में शुरुआत'],
      rating: '{n} Google रिव्यू',
      price: 'दो लोगों के लिए लगभग',
    },
    visit: {
      eyebrow: 'पता और संपर्क',
      title: ['आइए ', 'पराठा रसोई'],
      call: 'कॉल करें {phone}',
      storefront: 'LG सिटी, गुंजूर – नेरिगे रोड पर हमारा बोर्ड देखिए',
      address: 'पता', directions: 'रास्ता देखें →',
      hours: 'खुलने का समय', days: 'मंगलवार–रविवार', closed: 'सोमवार: बंद',
      dining: 'खाने के विकल्प', diningText: 'डाइन-इन, टेकअवे और डिलीवरी।',
      diningNote: 'फ़ैमिली के लिए आरामदायक माहौल, काउंटर और टेबल सर्विस',
    },
    reviews: {
      eyebrow: 'हमारे मेहमान क्या कहते हैं',
      title: ['Google ', 'रिव्यू'],
      count: '{n} रिव्यू',
      viewAll: 'सभी रिव्यू देखें',
      readMore: 'और पढ़ें', showLess: 'कम दिखाएँ',
      prev: 'पिछले रिव्यू', next: 'अगले रिव्यू',
    },
    contact: {
      eyebrow: 'संपर्क करें',
      title: ['हमसे ', 'बात करें'],
      intro: 'कोई सवाल, पार्टी ऑर्डर या सुझाव? हमें मैसेज भेजिए, हम जल्द ही जवाब देंगे।',
      callUs: 'कॉल करें', whatsapp: 'WhatsApp', chat: 'हमसे चैट करें', days: 'मंगल–रवि',
      mapTitle: 'गुंजूर, बेंगलुरु में पराठा रसोई का नक्शा',
      name: 'आपका नाम', phone: 'फ़ोन', topic: 'विषय', message: 'मैसेज',
      messagePlaceholder: 'हम आपकी क्या मदद कर सकते हैं?',
      send: 'WhatsApp से भेजें',
      sent: 'आपके मैसेज के साथ WhatsApp खुल गया है। बस Send दबाइए!',
      topics: {
        'General enquiry': 'सामान्य जानकारी', 'Party / bulk order': 'पार्टी / बल्क ऑर्डर',
        'Table booking': 'टेबल बुकिंग', Feedback: 'सुझाव / फ़ीडबैक',
      },
    },
    footer: {
      tagline: 'असली नॉर्थ इंडियन खाना, ताज़ा बना और हमेशा ख़ुशी से परोसा गया।',
      quickLinks: 'क्विक लिंक्स', contactUs: 'संपर्क',
      hours1: 'मंगल–रवि: 12–3:30 PM', hours2: 'और 5:30–11:30 PM', closed: 'सोमवार: बंद',
      order: 'ऑर्डर', orderText: 'टेकअवे और डिलीवरी के लिए कॉल करें, या बैठकर खाने के लिए आ जाइए।',
      callToOrder: 'कॉल करके ऑर्डर करें', contactBtn: 'संपर्क करें',
      rights: '© {year} पराठा रसोई। सर्वाधिकार सुरक्षित।',
      privacy: 'प्राइवेसी पॉलिसी', motto: 'अच्छा खाना • अच्छा मूड',
      facebook: 'Facebook पर पराठा रसोई', instagram: 'Instagram पर पराठा रसोई',
    },
    reserve: {
      title: 'टेबल बुक करें', subtitle: 'पराठा रसोई में आराम से खाने का प्लान बनाइए।',
      close: 'बुकिंग फ़ॉर्म बंद करें',
      name: 'आपका नाम', phone: 'फ़ोन', date: 'तारीख़', time: 'समय', selectTime: 'समय चुनें',
      guests: 'मेहमान', partySize: 'कितने लोग',
      submit: 'WhatsApp पर OTP पाएँ', sending: 'भेज रहे हैं…', or: 'या', zomato: 'Zomato पर बुक करें',
      otpSent: 'हमने {phone} पर WhatsApp से 6 अंकों का OTP भेजा है। बुकिंग कन्फ़र्म करने के लिए उसे नीचे डालिए।',
      otp: 'OTP', verify: 'वेरिफ़ाई करें और बुक करें', verifying: 'वेरिफ़ाई हो रहा है…',
      resend: 'OTP दोबारा भेजें', resendIn: '{s} सेकंड में OTP दोबारा भेजें', changeNumber: 'जानकारी बदलें',
      success: 'धन्यवाद! आपकी टेबल की रिक्वेस्ट सेव हो गई है। हम आपको कॉल करके कन्फ़र्म करेंगे।',
      alsoWhatsapp: 'WhatsApp पर भी मैसेज करें',
      submitWhatsapp: 'WhatsApp से बुक करें', openWhatsapp: 'WhatsApp फिर से खोलें',
      successWhatsapp: ['धन्यवाद! आपकी बुकिंग की जानकारी के साथ WhatsApp खुल गया है। ', 'Send', ' दबाइए ताकि हमें तुरंत मिल जाए, फिर हम आपको कॉल करके कन्फ़र्म करेंगे।'],
    },
    search: {
      label: 'मेन्यू में खोजें', input: 'डिश खोजें', placeholder: 'डिश खोजें, जैसे पनीर या paneer',
      close: 'खोज बंद करें', popular: 'लोकप्रिय खोजें',
      suggestions: ['पराठा', 'पनीर', 'चिकन', 'कॉम्बो', 'राइस'],
      found: '{n} डिशेज़ मिलीं', foundOne: '1 डिश मिली', none: '“{q}” से जुड़ी कोई डिश नहीं मिली',
      fullMenu: 'पूरा मेन्यू देखें', order: 'WhatsApp पर {name} ऑर्डर करें',
    },
  },

  kn: {
    meta: { title: 'ಪರಾಠ ರಸೋಯಿ — ಅಸಲಿ ಉತ್ತರ ಭಾರತೀಯ ಊಟ' },
    lang: { switch: 'ಭಾಷೆ ಬದಲಿಸಿ' },
    nav: {
      home: 'ಮುಖಪುಟ', menu: 'ಮೆನು', speciality: 'ನಮ್ಮ ವಿಶೇಷ', about: 'ನಮ್ಮ ಬಗ್ಗೆ',
      visit: 'ವಿಳಾಸ', visitUs: 'ನಮ್ಮಲ್ಲಿಗೆ ಬನ್ನಿ', reviews: 'ವಿಮರ್ಶೆಗಳು', contact: 'ಸಂಪರ್ಕ',
    },
    header: {
      search: 'ಮೆನುವಿನಲ್ಲಿ ಹುಡುಕಿ', whatsapp: 'WhatsApp ನಲ್ಲಿ ಆರ್ಡರ್ ಮಾಡಿ', reserve: 'ಟೇಬಲ್ ಬುಕ್ ಮಾಡಿ',
      openNav: 'ಮೆನು ತೆರೆಯಿರಿ', closeNav: 'ಮೆನು ಮುಚ್ಚಿ', mainNav: 'ಮುಖ್ಯ ನ್ಯಾವಿಗೇಷನ್',
    },
    hero: {
      eyebrow: 'ಅಸಲಿ ಉತ್ತರ ಭಾರತೀಯ ರುಚಿ',
      line1: 'ಪ್ರತಿ ಪರಾಠದಲ್ಲೂ ಪ್ರೀತಿ,', line2: 'ಪ್ರತಿ ತುತ್ತಿನಲ್ಲೂ', line3: 'ಸಂತೋಷ',
      description: 'ಗುಂಜೂರಿನ ಹೃದಯಭಾಗದಲ್ಲಿ ತಾಜಾ ಪರಾಠಗಳು ಮತ್ತು ಮನೆಯಂತಹ ಉತ್ತರ ಭಾರತೀಯ ಊಟ.',
      order: 'ಈಗಲೇ ಆರ್ಡರ್ ಮಾಡಿ', call: 'ಕರೆ ಮಾಡಿ',
    },
    features: {
      fresh: ['ತಾಜಾ ತಯಾರಿ', 'ನೀವು ಆರ್ಡರ್ ಮಾಡಿದ ನಂತರವೇ ತಯಾರಿಸಲಾಗುತ್ತದೆ'],
      flavours: ['ಉತ್ತರ ಭಾರತೀಯ ರುಚಿ', 'ಮನೆಯಂತಹ ನೆಮ್ಮದಿಯ ಊಟ'],
      family: ['ಕುಟುಂಬಕ್ಕೆ ಸೂಕ್ತ', 'ಡೈನ್-ಇನ್, ಟೇಕ್‌ಅವೇ ಮತ್ತು ಡೆಲಿವರಿ'],
    },
    signature: {
      eyebrow: 'ಶೆಫ್ ಅವರ ಆಯ್ಕೆ',
      title: ['ಸಿಗ್ನೇಚರ್ ', 'ಖಾದ್ಯಗಳು'],
      intro: 'ನಮ್ಮ ಮೆನುವಿನಿಂದ ಆಯ್ದ ಖಾದ್ಯಗಳು, ಪ್ರೀತಿಯಿಂದ ತಯಾರಿಸಿದವು, ಅವುಗಳ ರುಚಿ ಬಹುಕಾಲ ನೆನಪಿನಲ್ಲಿ ಉಳಿಯುತ್ತದೆ.',
      viewMenu: 'ಪೂರ್ಣ ಮೆನು ನೋಡಿ',
    },
    speciality: {
      badge: 'ನಮ್ಮ ವಿಶೇಷ ಖಾದ್ಯ',
      eyebrow: 'ನಮ್ಮ ವಿಶೇಷ',
      title: ['ಚಿಕನ್ ಘೀ ರೋಸ್ಟ್ ', 'ಪರಾಠ'],
      body: 'ನಮ್ಮ ಸಿಗ್ನೇಚರ್ ಪರಾಠ: ಹೊರಗೆ ಗರಿಗರಿಯಾಗಿ ತಾಜಾ ಬೇಯಿಸಿದ್ದು, ಒಳಗೆ ಸಮೃದ್ಧವಾದ ಚಿಕನ್ ಘೀ ರೋಸ್ಟ್. ಖಡಕ್ ರುಚಿ, ಬಿಸಿಬಿಸಿ, ಮತ್ತು ನಿಮ್ಮ ಆರ್ಡರ್‌ಗೆ ತಕ್ಕಂತೆ ತಯಾರಿಸಲಾಗುತ್ತದೆ, ತೃಪ್ತಿಕರ ಉತ್ತರ ಭಾರತೀಯ ಊಟಕ್ಕಾಗಿ.',
      price: 'ಬೆಲೆ', bestWith: 'ಇದರೊಂದಿಗೆ ಸವಿಯಿರಿ', bestWithValue: 'ಮೊಸರು ಮತ್ತು ಪುದೀನ ಚಟ್ನಿ',
      call: 'ಕರೆ ಮಾಡಿ ಆರ್ಡರ್ ಮಾಡಿ',
    },
    fullMenu: {
      eyebrow: 'ಪೂರ್ಣ ಮೆನು',
      title: ['ನಮ್ಮ ', 'ಮೆನು'],
      intro: 'ಕ್ಲಾಸಿಕ್ ಮತ್ತು ಸಿಗ್ನೇಚರ್ ಪರಾಠಗಳು, ಕರಿ, ಸ್ಟಾರ್ಟರ್, ರೈಸ್, ಕಾಂಬೊ ಮತ್ತು ಆಡ್-ಆನ್‌ಗಳು.',
      hint: 'ಪೂರ್ಣ ಮೆನು ನೋಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ', open: 'ಪೂರ್ಣ ಮೆನು ತೆರೆಯಿರಿ',
      viewerTitle: 'ನಮ್ಮ ಮೆನು', zoomIn: 'ಜೂಮ್ ಮಾಡಿ', fit: 'ಪರದೆಗೆ ಹೊಂದಿಸಿ', close: 'ಮೆನು ಮುಚ್ಚಿ',
    },
    story: {
      caption: 'ನಮ್ಮ ಡೈನಿಂಗ್ ರೂಮ್ · LG ಸಿಟಿ, ಗುಂಜೂರು',
      eyebrow: 'ನಮ್ಮ ಕಥೆ',
      title: ['ಒಳ್ಳೆಯ ಊಟ, ', 'ಒಳ್ಳೆಯ ಮೂಡ್'],
      p1: 'ಪರಾಠ ರಸೋಯಿ ಆಗಸ್ಟ್ 2026 ರಲ್ಲಿ LG ಸಿಟಿ, ಗುಂಜೂರಿನಲ್ಲಿ ಒಂದು ಸರಳ ಆಲೋಚನೆಯೊಂದಿಗೆ ಆರಂಭವಾಯಿತು: ಮನೆಯಲ್ಲಿ ಮಾಡುವಂತೆಯೇ ಪರಾಠಗಳು. ನೀವು ಆರ್ಡರ್ ಮಾಡಿದಾಗಲೇ ಲಟ್ಟಿಸಿ, ಧಾರಾಳವಾಗಿ ಹೂರಣ ತುಂಬಿ, ಬೆಣ್ಣೆ, ಮೊಸರು ಮತ್ತು ಉಪ್ಪಿನಕಾಯಿಯೊಂದಿಗೆ ತವಾದಿಂದ ನೇರವಾಗಿ ಬಿಸಿಬಿಸಿಯಾಗಿ ಬಡಿಸಲಾಗುತ್ತದೆ.',
      p2: 'ಕುಟುಂಬ ಮತ್ತು ಸ್ನೇಹಿತರೊಂದಿಗೆ ಊಟಕ್ಕಾಗಿ ನಮ್ಮ ಬಣ್ಣಬಣ್ಣದ ಡೈನಿಂಗ್ ರೂಮ್‌ಗೆ ಬನ್ನಿ, ಅಥವಾ ನಿಮ್ಮ ನೆಚ್ಚಿನ ಖಾದ್ಯಗಳನ್ನು ಮನೆಗೆ ಕೊಂಡೊಯ್ಯಿರಿ. ಪರಾಠಗಳ ಜೊತೆಗೆ ಉತ್ತರ ಭಾರತೀಯ ಕರಿಗಳು, ಸ್ಟಾರ್ಟರ್‌ಗಳು, ರೈಸ್ ಮತ್ತು ಕೈಗೆಟುಕುವ ಕಾಂಬೊಗಳು ಇಲ್ಲಿ ಸಿಗುತ್ತವೆ.',
      opened: ['ಆಗಸ್ಟ್ 2026', 'ಗುಂಜೂರಿನಲ್ಲಿ ಆರಂಭ'],
      rating: '{n} Google ವಿಮರ್ಶೆಗಳು',
      price: 'ಇಬ್ಬರಿಗೆ ಸುಮಾರು',
    },
    visit: {
      eyebrow: 'ವಿಳಾಸ ಮತ್ತು ಸಂಪರ್ಕ',
      title: ['ಬನ್ನಿ ', 'ಪರಾಠ ರಸೋಯಿಗೆ'],
      call: '{phone} ಗೆ ಕರೆ ಮಾಡಿ',
      storefront: 'LG ಸಿಟಿ, ಗುಂಜೂರು – ನೆರಿಗೆ ರಸ್ತೆಯಲ್ಲಿ ನಮ್ಮ ಬೋರ್ಡ್ ನೋಡಿ',
      address: 'ವಿಳಾಸ', directions: 'ದಾರಿ ನೋಡಿ →',
      hours: 'ತೆರೆಯುವ ಸಮಯ', days: 'ಮಂಗಳವಾರ–ಭಾನುವಾರ', closed: 'ಸೋಮವಾರ: ರಜೆ',
      dining: 'ಊಟದ ಆಯ್ಕೆಗಳು', diningText: 'ಡೈನ್-ಇನ್, ಟೇಕ್‌ಅವೇ ಮತ್ತು ಡೆಲಿವರಿ.',
      diningNote: 'ಕುಟುಂಬಕ್ಕೆ ಸೂಕ್ತ ವಾತಾವರಣ, ಕೌಂಟರ್ ಮತ್ತು ಟೇಬಲ್ ಸರ್ವೀಸ್',
    },
    reviews: {
      eyebrow: 'ನಮ್ಮ ಅತಿಥಿಗಳು ಏನು ಹೇಳುತ್ತಾರೆ',
      title: ['Google ', 'ವಿಮರ್ಶೆಗಳು'],
      count: '{n} ವಿಮರ್ಶೆಗಳು',
      viewAll: 'ಎಲ್ಲಾ ವಿಮರ್ಶೆಗಳನ್ನು ನೋಡಿ',
      readMore: 'ಇನ್ನಷ್ಟು ಓದಿ', showLess: 'ಕಡಿಮೆ ತೋರಿಸಿ',
      prev: 'ಹಿಂದಿನ ವಿಮರ್ಶೆಗಳು', next: 'ಮುಂದಿನ ವಿಮರ್ಶೆಗಳು',
    },
    contact: {
      eyebrow: 'ಸಂಪರ್ಕಿಸಿ',
      title: ['ನಮ್ಮೊಂದಿಗೆ ', 'ಮಾತನಾಡಿ'],
      intro: 'ಯಾವುದೇ ಪ್ರಶ್ನೆ, ಪಾರ್ಟಿ ಆರ್ಡರ್ ಅಥವಾ ಸಲಹೆ ಇದೆಯೇ? ನಮಗೆ ಮೆಸೇಜ್ ಕಳುಹಿಸಿ, ನಾವು ಶೀಘ್ರದಲ್ಲೇ ಉತ್ತರಿಸುತ್ತೇವೆ.',
      callUs: 'ಕರೆ ಮಾಡಿ', whatsapp: 'WhatsApp', chat: 'ನಮ್ಮೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ', days: 'ಮಂಗಳ–ಭಾನು',
      mapTitle: 'ಗುಂಜೂರು, ಬೆಂಗಳೂರಿನಲ್ಲಿ ಪರಾಠ ರಸೋಯಿಯ ನಕ್ಷೆ',
      name: 'ನಿಮ್ಮ ಹೆಸರು', phone: 'ಫೋನ್', topic: 'ವಿಷಯ', message: 'ಮೆಸೇಜ್',
      messagePlaceholder: 'ನಾವು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
      send: 'WhatsApp ಮೂಲಕ ಕಳುಹಿಸಿ',
      sent: 'ನಿಮ್ಮ ಮೆಸೇಜ್‌ನೊಂದಿಗೆ WhatsApp ತೆರೆದಿದೆ. Send ಒತ್ತಿದರೆ ಸಾಕು!',
      topics: {
        'General enquiry': 'ಸಾಮಾನ್ಯ ವಿಚಾರಣೆ', 'Party / bulk order': 'ಪಾರ್ಟಿ / ಬಲ್ಕ್ ಆರ್ಡರ್',
        'Table booking': 'ಟೇಬಲ್ ಬುಕಿಂಗ್', Feedback: 'ಸಲಹೆ / ಪ್ರತಿಕ್ರಿಯೆ',
      },
    },
    footer: {
      tagline: 'ಅಸಲಿ ಉತ್ತರ ಭಾರತೀಯ ಊಟ, ತಾಜಾ ತಯಾರಿ ಮತ್ತು ಯಾವಾಗಲೂ ಸಂತೋಷದಿಂದ ಬಡಿಸಲಾಗುತ್ತದೆ.',
      quickLinks: 'ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು', contactUs: 'ಸಂಪರ್ಕ',
      hours1: 'ಮಂಗಳ–ಭಾನು: 12–3:30 PM', hours2: 'ಮತ್ತು 5:30–11:30 PM', closed: 'ಸೋಮವಾರ: ರಜೆ',
      order: 'ಆರ್ಡರ್', orderText: 'ಟೇಕ್‌ಅವೇ ಮತ್ತು ಡೆಲಿವರಿಗೆ ಕರೆ ಮಾಡಿ, ಅಥವಾ ಕುಳಿತು ಊಟ ಮಾಡಲು ಬನ್ನಿ.',
      callToOrder: 'ಕರೆ ಮಾಡಿ ಆರ್ಡರ್ ಮಾಡಿ', contactBtn: 'ಸಂಪರ್ಕಿಸಿ',
      rights: '© {year} ಪರಾಠ ರಸೋಯಿ. ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
      privacy: 'ಗೌಪ್ಯತಾ ನೀತಿ', motto: 'ಒಳ್ಳೆಯ ಊಟ • ಒಳ್ಳೆಯ ಮೂಡ್',
      facebook: 'Facebook ನಲ್ಲಿ ಪರಾಠ ರಸೋಯಿ', instagram: 'Instagram ನಲ್ಲಿ ಪರಾಠ ರಸೋಯಿ',
    },
    reserve: {
      title: 'ಟೇಬಲ್ ಬುಕ್ ಮಾಡಿ', subtitle: 'ಪರಾಠ ರಸೋಯಿಯಲ್ಲಿ ನಿರಾಳವಾದ ಊಟಕ್ಕೆ ಯೋಜನೆ ಮಾಡಿ.',
      close: 'ಬುಕಿಂಗ್ ಫಾರ್ಮ್ ಮುಚ್ಚಿ',
      name: 'ನಿಮ್ಮ ಹೆಸರು', phone: 'ಫೋನ್', date: 'ದಿನಾಂಕ', time: 'ಸಮಯ', selectTime: 'ಸಮಯ ಆಯ್ಕೆಮಾಡಿ',
      guests: 'ಅತಿಥಿಗಳು', partySize: 'ಎಷ್ಟು ಜನ',
      submit: 'WhatsApp ನಲ್ಲಿ OTP ಪಡೆಯಿರಿ', sending: 'ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ…', or: 'ಅಥವಾ', zomato: 'Zomato ನಲ್ಲಿ ಬುಕ್ ಮಾಡಿ',
      otpSent: '{phone} ಗೆ WhatsApp ನಲ್ಲಿ 6 ಅಂಕಿಯ OTP ಕಳುಹಿಸಿದ್ದೇವೆ. ಬುಕಿಂಗ್ ಖಚಿತಪಡಿಸಲು ಅದನ್ನು ಕೆಳಗೆ ನಮೂದಿಸಿ.',
      otp: 'OTP', verify: 'ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಬುಕ್ ಮಾಡಿ', verifying: 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ…',
      resend: 'OTP ಮತ್ತೆ ಕಳುಹಿಸಿ', resendIn: '{s} ಸೆಕೆಂಡ್‌ಗಳಲ್ಲಿ OTP ಮತ್ತೆ ಕಳುಹಿಸಿ', changeNumber: 'ವಿವರ ಬದಲಿಸಿ',
      success: 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಟೇಬಲ್ ವಿನಂತಿ ಉಳಿಸಲಾಗಿದೆ. ಖಚಿತಪಡಿಸಲು ನಾವು ನಿಮಗೆ ಕರೆ ಮಾಡುತ್ತೇವೆ.',
      alsoWhatsapp: 'WhatsApp ನಲ್ಲಿಯೂ ಮೆಸೇಜ್ ಮಾಡಿ',
      submitWhatsapp: 'WhatsApp ಮೂಲಕ ಬುಕ್ ಮಾಡಿ', openWhatsapp: 'WhatsApp ಮತ್ತೆ ತೆರೆಯಿರಿ',
      successWhatsapp: ['ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಬುಕಿಂಗ್ ವಿವರಗಳೊಂದಿಗೆ WhatsApp ತೆರೆದಿದೆ. ನಮಗೆ ತಕ್ಷಣ ತಲುಪಲು ', 'Send', ' ಒತ್ತಿ, ನಂತರ ಖಚಿತಪಡಿಸಲು ನಾವು ನಿಮಗೆ ಕರೆ ಮಾಡುತ್ತೇವೆ.'],
    },
    search: {
      label: 'ಮೆನುವಿನಲ್ಲಿ ಹುಡುಕಿ', input: 'ಖಾದ್ಯ ಹುಡುಕಿ', placeholder: 'ಖಾದ್ಯ ಹುಡುಕಿ, ಉದಾ. ಪನೀರ್ ಅಥವಾ paneer',
      close: 'ಹುಡುಕಾಟ ಮುಚ್ಚಿ', popular: 'ಜನಪ್ರಿಯ ಹುಡುಕಾಟಗಳು',
      suggestions: ['ಪರಾಠ', 'ಪನೀರ್', 'ಚಿಕನ್', 'ಕಾಂಬೊ', 'ರೈಸ್'],
      found: '{n} ಖಾದ್ಯಗಳು ಸಿಕ್ಕಿವೆ', foundOne: '1 ಖಾದ್ಯ ಸಿಕ್ಕಿದೆ', none: '“{q}” ಗೆ ಹೊಂದುವ ಯಾವುದೇ ಖಾದ್ಯ ಸಿಗಲಿಲ್ಲ',
      fullMenu: 'ಪೂರ್ಣ ಮೆನು ನೋಡಿ', order: 'WhatsApp ನಲ್ಲಿ {name} ಆರ್ಡರ್ ಮಾಡಿ',
    },
  },
}

export const LANGS = ['en', 'kn', 'hi']

// Hindi names for every dish on the menu (English stays the key, matching data.js).
const DISH_HI = {
  'Aloo Paratha': 'आलू पराठा', 'Aloo Pyaz Paratha': 'आलू प्याज़ पराठा',
  'Punjabi Anardana Aloo Paratha': 'पंजाबी अनारदाना आलू पराठा', 'Paneer Paratha': 'पनीर पराठा',
  'Gobi Paratha': 'गोभी पराठा', 'Matar Paratha': 'मटर पराठा', 'Aloo Matar Paratha': 'आलू मटर पराठा',
  'Sattu Paratha': 'सत्तू पराठा', 'Onion Ajwain Paratha': 'प्याज़ अजवाइन पराठा', 'Plain Paratha': 'सादा पराठा',
  'Egg Bhurji Paratha': 'अंडा भुर्जी पराठा', 'Egg Chicken Paratha': 'अंडा चिकन पराठा',
  'Chicken Keema Paratha': 'चिकन कीमा पराठा',
  'Aloo Cheese Paratha': 'आलू चीज़ पराठा', 'Cheese Garlic Paratha': 'चीज़ गार्लिक पराठा',
  'Chilli Cheese Paratha': 'चिली चीज़ पराठा', 'Chicken Cheese Paratha': 'चिकन चीज़ पराठा',
  'Paneer Ghee Roast Paratha': 'पनीर घी रोस्ट पराठा', 'Chicken Ghee Roast Paratha': 'चिकन घी रोस्ट पराठा',
  'Paneer Butter Masala': 'पनीर बटर मसाला', 'Matar Paneer': 'मटर पनीर', 'Kadhai Paneer': 'कड़ाही पनीर',
  'Mix Veg Masala': 'मिक्स वेज मसाला', 'Chatpate Aloo Dry': 'चटपटे आलू (ड्राई)',
  'Dhabe Wala Dal Fry': 'ढाबे वाली दाल फ्राई', 'Chole Masala': 'छोले मसाला', 'Chilli Paneer': 'चिली पनीर',
  'Kadhai Chicken': 'कड़ाही चिकन', 'Bhuna Chicken': 'भुना चिकन', 'Butter Chicken': 'बटर चिकन',
  'Chilli Chicken Gravy': 'चिली चिकन ग्रेवी', 'Pepper Chicken': 'पेपर चिकन',
  'Chicken Pakora': 'चिकन पकोड़ा', 'Chicken Drumsticks': 'चिकन ड्रमस्टिक्स', 'Chicken Majestic': 'चिकन मजेस्टिक',
  'Chicken 65': 'चिकन 65', 'Chana Chilli': 'चना चिली', 'Pepper Paneer': 'पेपर पनीर',
  'Chilli Paneer Dry': 'चिली पनीर (ड्राई)', 'Chilli Chicken Dry': 'चिली चिकन (ड्राई)',
  'Steam Rice': 'स्टीम राइस', 'Jeera Rice': 'जीरा राइस', 'Veg Fried Rice': 'वेज फ्राइड राइस',
  'Egg Fried Rice': 'एग फ्राइड राइस', 'Paneer Fried Rice': 'पनीर फ्राइड राइस',
  'Chicken Fried Rice': 'चिकन फ्राइड राइस',
  'Extra Butter': 'एक्स्ट्रा मक्खन', 'Extra Curd': 'एक्स्ट्रा दही', 'Mint Chutney': 'पुदीना चटनी',
  Pickle: 'अचार', 'Lachha Pyaz': 'लच्छा प्याज़',
  'Aloo Paratha + Chole + Dahi': 'आलू पराठा + छोले + दही',
  '4 Puri + Aloo Jeera + Chutney + Onion': '4 पूरी + आलू जीरा + चटनी + प्याज़',
  '4 Puri + Aloo Sabji + Dahi': '4 पूरी + आलू सब्ज़ी + दही', '4 Puri + Chole + Dahi': '4 पूरी + छोले + दही',
  '2 Paratha Meal (Any 2 Classic + Curd + Pickle)': '2 पराठा मील (कोई भी 2 क्लासिक + दही + अचार)',
  '2 Paratha Non-Veg Meal (Chicken Keema + 1 Classic + Curd + Pickle + Butter + Mint Chutney)':
    '2 पराठा नॉन-वेज मील (चिकन कीमा + 1 क्लासिक + दही + अचार + मक्खन + पुदीना चटनी)',
  'Punjabi Meal (2 Classic + Chole + Curd)': 'पंजाबी मील (2 क्लासिक + छोले + दही)',
  'Chole Chawal': 'छोले चावल', '3 Plain Paratha + Kadhai Paneer': '3 सादा पराठा + कड़ाही पनीर',
  '3 Plain Paratha + Bhuna Chicken': '3 सादा पराठा + भुना चिकन',
  'Jeera Rice + Dhabewala Dal Fry': 'जीरा राइस + ढाबे वाली दाल फ्राई',
}

const CATEGORY_HI = {
  'Classic Paratha': 'क्लासिक पराठा', 'Signature Paratha': 'सिग्नेचर पराठा', Curry: 'करी',
  Starter: 'स्टार्टर', Rice: 'राइस', 'Add-on': 'ऐड-ऑन', Combos: 'कॉम्बो',
}

// Kannada names for every dish on the menu.
const DISH_KN = {
  'Aloo Paratha': 'ಆಲೂ ಪರಾಠ', 'Aloo Pyaz Paratha': 'ಆಲೂ ಈರುಳ್ಳಿ ಪರಾಠ',
  'Punjabi Anardana Aloo Paratha': 'ಪಂಜಾಬಿ ಅನಾರ್ದಾನ ಆಲೂ ಪರಾಠ', 'Paneer Paratha': 'ಪನೀರ್ ಪರಾಠ',
  'Gobi Paratha': 'ಗೋಬಿ ಪರಾಠ', 'Matar Paratha': 'ಬಟಾಣಿ ಪರಾಠ', 'Aloo Matar Paratha': 'ಆಲೂ ಬಟಾಣಿ ಪರಾಠ',
  'Sattu Paratha': 'ಸತ್ತು ಪರಾಠ', 'Onion Ajwain Paratha': 'ಈರುಳ್ಳಿ ಓಮ ಪರಾಠ', 'Plain Paratha': 'ಸಾದಾ ಪರಾಠ',
  'Egg Bhurji Paratha': 'ಎಗ್ ಭುರ್ಜಿ ಪರಾಠ', 'Egg Chicken Paratha': 'ಎಗ್ ಚಿಕನ್ ಪರಾಠ',
  'Chicken Keema Paratha': 'ಚಿಕನ್ ಕೀಮಾ ಪರಾಠ',
  'Aloo Cheese Paratha': 'ಆಲೂ ಚೀಸ್ ಪರಾಠ', 'Cheese Garlic Paratha': 'ಚೀಸ್ ಗಾರ್ಲಿಕ್ ಪರಾಠ',
  'Chilli Cheese Paratha': 'ಚಿಲ್ಲಿ ಚೀಸ್ ಪರಾಠ', 'Chicken Cheese Paratha': 'ಚಿಕನ್ ಚೀಸ್ ಪರಾಠ',
  'Paneer Ghee Roast Paratha': 'ಪನೀರ್ ಘೀ ರೋಸ್ಟ್ ಪರಾಠ', 'Chicken Ghee Roast Paratha': 'ಚಿಕನ್ ಘೀ ರೋಸ್ಟ್ ಪರಾಠ',
  'Paneer Butter Masala': 'ಪನೀರ್ ಬಟರ್ ಮಸಾಲಾ', 'Matar Paneer': 'ಮಟರ್ ಪನೀರ್', 'Kadhai Paneer': 'ಕಡಾಯಿ ಪನೀರ್',
  'Mix Veg Masala': 'ಮಿಕ್ಸ್ ವೆಜ್ ಮಸಾಲಾ', 'Chatpate Aloo Dry': 'ಚಟ್‌ಪಟೆ ಆಲೂ (ಡ್ರೈ)',
  'Dhabe Wala Dal Fry': 'ಢಾಬೆ ವಾಲಾ ದಾಲ್ ಫ್ರೈ', 'Chole Masala': 'ಚೋಲೆ ಮಸಾಲಾ', 'Chilli Paneer': 'ಚಿಲ್ಲಿ ಪನೀರ್',
  'Kadhai Chicken': 'ಕಡಾಯಿ ಚಿಕನ್', 'Bhuna Chicken': 'ಭುನಾ ಚಿಕನ್', 'Butter Chicken': 'ಬಟರ್ ಚಿಕನ್',
  'Chilli Chicken Gravy': 'ಚಿಲ್ಲಿ ಚಿಕನ್ ಗ್ರೇವಿ', 'Pepper Chicken': 'ಪೆಪ್ಪರ್ ಚಿಕನ್',
  'Chicken Pakora': 'ಚಿಕನ್ ಪಕೋಡಾ', 'Chicken Drumsticks': 'ಚಿಕನ್ ಡ್ರಮ್‌ಸ್ಟಿಕ್ಸ್', 'Chicken Majestic': 'ಚಿಕನ್ ಮೆಜೆಸ್ಟಿಕ್',
  'Chicken 65': 'ಚಿಕನ್ 65', 'Chana Chilli': 'ಚನಾ ಚಿಲ್ಲಿ', 'Pepper Paneer': 'ಪೆಪ್ಪರ್ ಪನೀರ್',
  'Chilli Paneer Dry': 'ಚಿಲ್ಲಿ ಪನೀರ್ (ಡ್ರೈ)', 'Chilli Chicken Dry': 'ಚಿಲ್ಲಿ ಚಿಕನ್ (ಡ್ರೈ)',
  'Steam Rice': 'ಸ್ಟೀಮ್ ರೈಸ್', 'Jeera Rice': 'ಜೀರಾ ರೈಸ್', 'Veg Fried Rice': 'ವೆಜ್ ಫ್ರೈಡ್ ರೈಸ್',
  'Egg Fried Rice': 'ಎಗ್ ಫ್ರೈಡ್ ರೈಸ್', 'Paneer Fried Rice': 'ಪನೀರ್ ಫ್ರೈಡ್ ರೈಸ್',
  'Chicken Fried Rice': 'ಚಿಕನ್ ಫ್ರೈಡ್ ರೈಸ್',
  'Extra Butter': 'ಹೆಚ್ಚುವರಿ ಬೆಣ್ಣೆ', 'Extra Curd': 'ಹೆಚ್ಚುವರಿ ಮೊಸರು', 'Mint Chutney': 'ಪುದೀನ ಚಟ್ನಿ',
  Pickle: 'ಉಪ್ಪಿನಕಾಯಿ', 'Lachha Pyaz': 'ಲಚ್ಛಾ ಈರುಳ್ಳಿ',
  'Aloo Paratha + Chole + Dahi': 'ಆಲೂ ಪರಾಠ + ಚೋಲೆ + ಮೊಸರು',
  '4 Puri + Aloo Jeera + Chutney + Onion': '4 ಪೂರಿ + ಆಲೂ ಜೀರಾ + ಚಟ್ನಿ + ಈರುಳ್ಳಿ',
  '4 Puri + Aloo Sabji + Dahi': '4 ಪೂರಿ + ಆಲೂ ಪಲ್ಯ + ಮೊಸರು', '4 Puri + Chole + Dahi': '4 ಪೂರಿ + ಚೋಲೆ + ಮೊಸರು',
  '2 Paratha Meal (Any 2 Classic + Curd + Pickle)': '2 ಪರಾಠ ಮೀಲ್ (ಯಾವುದೇ 2 ಕ್ಲಾಸಿಕ್ + ಮೊಸರು + ಉಪ್ಪಿನಕಾಯಿ)',
  '2 Paratha Non-Veg Meal (Chicken Keema + 1 Classic + Curd + Pickle + Butter + Mint Chutney)':
    '2 ಪರಾಠ ನಾನ್-ವೆಜ್ ಮೀಲ್ (ಚಿಕನ್ ಕೀಮಾ + 1 ಕ್ಲಾಸಿಕ್ + ಮೊಸರು + ಉಪ್ಪಿನಕಾಯಿ + ಬೆಣ್ಣೆ + ಪುದೀನ ಚಟ್ನಿ)',
  'Punjabi Meal (2 Classic + Chole + Curd)': 'ಪಂಜಾಬಿ ಮೀಲ್ (2 ಕ್ಲಾಸಿಕ್ + ಚೋಲೆ + ಮೊಸರು)',
  'Chole Chawal': 'ಚೋಲೆ ಚಾವಲ್', '3 Plain Paratha + Kadhai Paneer': '3 ಸಾದಾ ಪರಾಠ + ಕಡಾಯಿ ಪನೀರ್',
  '3 Plain Paratha + Bhuna Chicken': '3 ಸಾದಾ ಪರಾಠ + ಭುನಾ ಚಿಕನ್',
  'Jeera Rice + Dhabewala Dal Fry': 'ಜೀರಾ ರೈಸ್ + ಢಾಬೆ ವಾಲಾ ದಾಲ್ ಫ್ರೈ',
}

const CATEGORY_KN = {
  'Classic Paratha': 'ಕ್ಲಾಸಿಕ್ ಪರಾಠ', 'Signature Paratha': 'ಸಿಗ್ನೇಚರ್ ಪರಾಠ', Curry: 'ಕರಿ',
  Starter: 'ಸ್ಟಾರ್ಟರ್', Rice: 'ರೈಸ್', 'Add-on': 'ಆಡ್-ಆನ್', Combos: 'ಕಾಂಬೊ',
}

// Translated dish and category names per language (English needs none).
export const DISH_NAMES = { hi: DISH_HI, kn: DISH_KN }
export const CATEGORY_NAMES = { hi: CATEGORY_HI, kn: CATEGORY_KN }

const STORAGE_KEY = 'pr-lang'
const LangContext = createContext({ lang: 'en', setLang: () => {} })

function readSavedLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return LANGS.includes(saved) ? saved : 'en'
  } catch {
    return 'en'
  }
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(readSavedLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // Storage blocked: the choice just won't be remembered.
    }
  }, [lang])

  const value = useMemo(() => ({ lang, setLang }), [lang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

const lookup = (table, key) => key.split('.').reduce((node, part) => node?.[part], table)

export function useLang() {
  const { lang, setLang } = useContext(LangContext)
  // t('hero.order') → string (or array for titles); {name} placeholders are filled from vars.
  const t = useCallback(
    (key, vars) => {
      const value = lookup(STRINGS[lang], key) ?? lookup(STRINGS.en, key) ?? key
      if (!vars || typeof value !== 'string') return value
      return value.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? '')
    },
    [lang],
  )
  const dish = useCallback((name) => DISH_NAMES[lang]?.[name] || name, [lang])
  const category = useCallback((name) => CATEGORY_NAMES[lang]?.[name] || name, [lang])
  return { lang, setLang, t, dish, category }
}

// Renders a dish name; in Kannada/Hindi the English name follows in small text so it still matches the menu.
export function DishName({ name }) {
  const { lang, dish } = useLang()
  if (!DISH_NAMES[lang]?.[name]) return name
  return (
    <>
      {dish(name)}
      <small className="dish-en" lang="en">{name}</small>
    </>
  )
}

// [plain, highlighted] title → "plain <em>highlighted</em>"
export function Title({ parts }) {
  return (
    <>
      {parts[0]}
      <em>{parts[1]}</em>
    </>
  )
}

const LANG_LABELS = { en: 'EN', kn: 'ಕನ್ನಡ', hi: 'हिं' }

export function LangToggle() {
  const { lang, setLang, t } = useLang()
  return (
    <div className="lang-toggle" role="group" aria-label={t('lang.switch')}>
      {LANGS.map((code) => (
        <button key={code} type="button" aria-pressed={lang === code} onClick={() => setLang(code)} lang={code}>
          {LANG_LABELS[code]}
        </button>
      ))}
    </div>
  )
}
