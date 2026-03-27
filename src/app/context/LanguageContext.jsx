import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(undefined);

export const translations = {
  english: {
    nav: {
      home: 'Home',
      about: 'About Us',
      signIn: 'Sign In',
    },
    hero: {
      badge: 'Next-Gen Agriculture Technology',
      title: 'Transform Your Farming Future',
      description: 'Harness the power of AI to revolutionize your agricultural practices. Get intelligent crop recommendations and instant disease detection for healthier, more productive farms.',
      getStarted: 'Get Started',
      learnMore: 'Learn More',
    },
    features: {
      title: 'Powerful Features',
      subtitle: 'Everything you need to make smarter farming decisions',
      feature1: {
        title: 'AI-Powered Intelligence',
        description: 'Advanced machine learning algorithms for precise crop recommendations',
      },
      feature2: {
        title: 'Disease Detection',
        description: 'Real-time plant disease identification with 95%+ accuracy',
      },
      feature3: {
        title: 'Instant Results',
        description: 'Get actionable insights in seconds, not days',
      },
      feature4: {
        title: 'Yield Optimization',
        description: 'Data-driven decisions to maximize your harvest',
      },
    },
    stats: {
      farmers: 'Active Farmers',
      accuracy: 'Accuracy Rate',
      crops: 'Crops Supported',
      support: 'Support',
    },
    cta: {
      title: 'Ready to Revolutionize',
      subtitle: 'Your Farming Journey',
      description: 'Join thousands of farmers already using FarmAid AI to increase yields and reduce costs.',
      button: 'Start Your Free Trial',
    },
    footer: {
      tagline: 'Empowering farmers with AI-driven agricultural solutions',
    },
    aboutUs: {
      backToHome: 'Back to Home',
      title: 'About FarmAid AI',
      subtitle: 'Revolutionizing Agriculture Through Innovation',
      description: 'We are dedicated to transforming the agricultural industry by leveraging cutting-edge AI technology. Our mission is to empower farmers with intelligent tools that increase productivity, reduce costs, and promote sustainable farming practices.',
      vision: 'Our Vision',
      visionDesc: 'To create a world where every farmer has access to world-class agricultural intelligence, regardless of their location or resources.',
      mission: 'Our Mission',
      missionDesc: 'To provide farmers with AI-powered solutions that enhance crop yields, reduce environmental impact, and ensure food security for future generations.',
      valuesTitle: 'Core Values',
      values: [
        {
          title: 'Passion for Agriculture',
          description: 'We believe in sustainable farming and empowering farmers with cutting-edge technology.',
        },
        {
          title: 'Excellence in AI',
          description: 'Our team consists of leading AI researchers and agricultural experts working together.',
        },
        {
          title: 'Global Impact',
          description: 'Serving farmers across 50+ countries with localized solutions and support.',
        },
        {
          title: 'Continuous Innovation',
          description: 'Constantly evolving our technology to meet the changing needs of modern agriculture.',
        },
      ],
      teamTitle: 'Our Team',
      teamSubtitle: 'Meet the experts behind FarmAid AI',
      milestones: {
        title: 'Our Journey',
        timeline: [
          { year: '2020', event: 'Company Founded' },
          { year: '2021', event: '10K Farmers Onboarded' },
          { year: '2024', event: 'AI Model Launch' },
          { year: '2026', event: '50K+ Active Users' },
        ],
      },
    },
  },
  hindi: {
    nav: {
      home: 'होम',
      about: 'हमारे बारे में',
      signIn: 'साइन इन करें',
    },
    hero: {
      badge: 'अगली पीढ़ी की कृषि प्रौद्योगिकी',
      title: 'अपने खेती के भविष्य को बदलें',
      description: 'कृत्रिम बुद्धिमत्ता की शक्ति का उपयोग करके अपनी कृषि प्रथाओं में क्रांति लाएं। स्वस्थ और अधिक उत्पादक खेतों के लिए बुद्धिमान फसल की सिफारिशें और तत्काल रोग पहचान प्राप्त करें।',
      getStarted: 'शुरुआत करें',
      learnMore: 'और जानें',
    },
    features: {
      title: 'शक्तिशाली विशेषताएं',
      subtitle: 'कृषि निर्णय लेने के लिए आवश्यक सभी कुछ',
      feature1: {
        title: 'कृत्रिम बुद्धिमत्ता संचालित',
        description: 'सटीक फसल सिफारिशों के लिए उन्नत मशीन लर्निंग एल्गोरिदम',
      },
      feature2: {
        title: 'रोग पहचान',
        description: '95% से अधिक सटीकता के साथ वास्तविक समय में पौधों की बीमारी की पहचान',
      },
      feature3: {
        title: 'तत्काल परिणाम',
        description: 'दिनों नहीं, सेकंड में कार्रवाई योग्य अंतर्दृष्टि प्राप्त करें',
      },
      feature4: {
        title: 'पैदावार अनुकूलन',
        description: 'अपनी फसल को अधिकतम करने के लिए डेटा-संचालित निर्णय',
      },
    },
    stats: {
      farmers: 'सक्रिय किसान',
      accuracy: 'सटीकता दर',
      crops: 'समर्थित फसलें',
      support: 'सहायता',
    },
    cta: {
      title: 'क्या आप क्रांतिकारी बनने के लिए तैयार हैं',
      subtitle: 'अपनी कृषि यात्रा',
      description: 'हजारों किसानों के साथ जुड़ें जो पहले से ही उपज बढ़ाने और लागत कम करने के लिए FarmAid AI का उपयोग कर रहे हैं।',
      button: 'अपना मुफ्त परीक्षण शुरू करें',
    },
    footer: {
      tagline: 'कृषकों को कृत्रिम बुद्धिमत्ता-संचालित कृषि समाधानों से सशक्त बनाना',
    },
    aboutUs: {
      backToHome: 'होम पर वापस जाएं',
      title: 'FarmAid AI के बारे में',
      subtitle: 'नवाचार के माध्यम से कृषि में क्रांति',
      description: 'हम अत्याधुनिक कृत्रिम बुद्धिमत्ता प्रौद्योगिकी का लाभ उठाकर कृषि उद्योग को बदलने के लिए समर्पित हैं। हमारा मिशन किसानों को बुद्धिमान उपकरणों से सशक्त बनाना है जो उत्पादकता बढ़ाते हैं, लागत कम करते हैं, और टिकाऊ कृषि प्रथाओं को बढ़ावा देते हैं।',
      vision: 'हमारी दृष्टि',
      visionDesc: 'एक ऐसी दुनिया बनाना जहां हर किसान को, उनके स्थान या संसाधनों की परवाह किए बिना, विश्व-स्तरीय कृषि बुद्धिमत्ता तक पहुंच हो।',
      mission: 'हमारा मिशन',
      missionDesc: 'किसानों को कृत्रिम बुद्धिमत्ता-संचालित समाधान प्रदान करना जो फसल की उपज बढ़ाते हैं, पर्यावरणीय प्रभाव कम करते हैं, और आने वाली पीढ़ियों के लिए खाद्य सुरक्षा सुनिश्चित करते हैं।',
      valuesTitle: 'मूल मूल्य',
      values: [
        {
          title: 'कृषि के प्रति जुनून',
          description: 'हम टिकाऊ खेती में विश्वास करते हैं और किसानों को अत्याधुनिक प्रौद्योगिकी से सशक्त बनाते हैं।',
        },
        {
          title: 'कृत्रिम बुद्धिमत्ता में उत्कृष्टता',
          description: 'हमारी टीम शीर्ष कृत्रिम बुद्धिमत्ता शोधकर्ताओं और कृषि विशेषज्ञों से मिलकर बनी है।',
        },
        {
          title: 'वैश्विक प्रभाव',
          description: '50+ देशों में किसानों को स्थानीयकृत समाधान और सहायता प्रदान करना।',
        },
        {
          title: 'निरंतर नवाचार',
          description: 'आधुनिक कृषि की बदलती जरूरतों को पूरा करने के लिए लगातार प्रौद्योगिकी विकसित करना।',
        },
      ],
      teamTitle: 'हमारी टीम',
      teamSubtitle: 'FarmAid AI के पीछे के विशेषज्ञों से मिलें',
      milestones: {
        title: 'हमारी यात्रा',
        timeline: [
          { year: '2020', event: 'कंपनी की स्थापना' },
          { year: '2021', event: '10K किसान ऑनबोर्ड' },
          { year: '2024', event: 'कृत्रिम बुद्धिमत्ता मॉडल लॉन्च' },
          { year: '2026', event: '50K+ सक्रिय उपयोगकर्ता' },
        ],
      },
    },
  },
  gujarati: {
    nav: {
      home: 'હોમ',
      about: 'આমારા વિશે',
      signIn: 'સાઇન ઇન',
    },
    hero: {
      badge: 'આગલી પેઢીની કૃષિ પ્રોધોગિકી',
      title: 'તમારી ખેતી ભવિષ્યને બદલો',
      description: 'કૃત્રિમ બુદ્ધિમત્તાની શક્તિનો ઉપયોગ કરીને તમારી કૃષિ પદ્ધતિમાં ક્રાંતિ લાવો. સ્વસ્થ અને વધુ ઉત્પાદક ખેતીઓ માટે બુદ્ધિમાન પાકની ભલામણો અને તાત્કાલિક રોગ શોધ પ્રાપ્ત કરો.',
      getStarted: 'શરૂ કરો',
      learnMore: 'વધુ જાણો',
    },
    features: {
      title: 'શક્તિશાળી લક્ષણો',
      subtitle: 'સ્માર્ટ ખેતી નિર્ણય લેવા માટે જરૂરી બધું',
      feature1: {
        title: 'કૃત્રિમ બુદ્ધિમત્તા સંચાલિત',
        description: 'સચોટ પાક ભલામણો માટે અધુનાતન મશીન લર્નિંગ અલ્ગોરિધમ',
      },
      feature2: {
        title: 'રોગ શોધ',
        description: '95% થી વધુ ચોકસાઇ સાથે વાસ્તવિક સમયમાં પૌધ રોગ ઓળખ',
      },
      feature3: {
        title: 'તાત્કાલિક પરિણામો',
        description: 'દિવસોમાં નહીં, સેકન્ડમાં કાર્યશીલ સૂચનાઓ મેળવો',
      },
      feature4: {
        title: 'ઉપજ ઑપ્ટિમાઇઝેશન',
        description: 'તમારી પાક સર્વોચ્ચ કરવા માટે ડેટા-સંચાલિત નિર્ણયો',
      },
    },
    stats: {
      farmers: 'સક્રિય ખેડૂત',
      accuracy: 'ચોકસાઇ દર',
      crops: 'સમર્થિત પાકો',
      support: 'સહાય',
    },
    cta: {
      title: 'તમારા ખેતી સફરને',
      subtitle: 'રુપાંતરિત કરવા તૈયાર છો',
      description: 'હજારો ખેડૂતો સાથે જોડાઓ જેઓ ઉપજ વધારવા અને ખર્ચ ઘટાવવા માટે FarmAid AI નો ઉપયોગ કરી રહ્યા છે.',
      button: 'તમારું મુક્ત ટ્રાયલ શરૂ કરો',
    },
    footer: {
      tagline: 'કૃષકોને કૃત્રિમ બુદ્ધિમત્તા-સંચાલિત કૃષિ સમાધાનો દ્વારા સશક્ત બનાવવું',
    },
    aboutUs: {
      backToHome: 'હોમ પર પાછા ફરો',
      title: 'FarmAid AI વિશે',
      subtitle: 'નવીનતા દ્વારા કૃષિમાં ક્રાંતિ',
      description: 'અમે અત્યાધુનિક કૃત્રિમ બુદ્ધિમત્તા પ્રોધોગિકીનો લાભ લઈને કૃષિ ઉદ્યોગને રૂપાંતરિત કરવા માટે સમર્પિત છીએ. અમારું મિશન ખેડૂતોને બુદ્ધિમાન સાધનો દ્વારા સશક્ત બનાવવું છે જે ઉપજ વધારે છે, ખર્ચ ઘટાવે છે અને ટકાઉ કૃષિ પીધોગિતિને પ્રોત્સાહિત કરે છે.',
      vision: 'આપણી દૃષ્ટિ',
      visionDesc: 'એક એવી દુનિયા બનાવવી જ્યાં દરેક ખેડૂતને તેમના સ્થાન અથવા સંસાધનોને ધ્યાને લીધા વિના વિશ્વ-સ્તરીય કૃષિ બુદ્ધિમત્તાતક પહોંચ હોય.',
      mission: 'આપણું મિશન',
      missionDesc: 'ખેડૂતોને કૃત્રિમ બુદ્ધિમત્તા-સંચાલિત સમાધાનો આપવું જે પાક ઉપજ વધારે છે, પર્યાવરણીય અસર ઘટાવે છે અને આવતા પેઢીઓ માટે ખાણ સુરક્ષા સુનિશ્ચિત કરે છે.',
      valuesTitle: 'મૂળ મૂલ્યો',
      values: [
        {
          title: 'કૃષિ પ્રતિ જુસ્સો',
          description: 'અમે ટકાઉ ખેતીમાં વિશ્વાસ કરીએ છીએ અને ખેડૂતોને અત્યાધુનિક પ્રોધોગિકી દ્વારા સશક્ત બનાવીએ છીએ.',
        },
        {
          title: 'કૃત્રિમ બુદ્ધિમત્તામાં શ્રેષ્ઠતા',
          description: 'અમારી ટીમ અગ્રણી કૃત્રિમ બુદ્ધિમત્તા સંશોધકો અને કૃષિ 專家્ટોથી બનેલી છે.',
        },
        {
          title: 'વૈશ્વિક પ્રભાવ',
          description: '50+ દેશોમાં ખેડૂતોને સ્થાનીયકૃત સમાધાનો અને સહાય આપવી.',
        },
        {
          title: 'સતત નવીનતા',
          description: 'આધુનિક કૃષિની બદલાતી જરૂરિયાતો પૂરી કરવા માટે સતત પ્રોધોગિકી વિકાસ કરવું.',
        },
      ],
      teamTitle: 'આપણી ટીમ',
      teamSubtitle: 'FarmAid AI પાછળના વિશેષજ્ઞોને મળો',
      milestones: {
        title: 'આપણી યાત્રા',
        timeline: [
          { year: '2020', event: 'કંપની સ્થાપનা' },
          { year: '2021', event: '10K ખેડૂત ઓનબોર્ડ' },
          { year: '2024', event: 'AI મોડેલ લોન્ચ' },
          { year: '2026', event: '50K+ સક્રિય વપરાશકર્તાઓ' },
        ],
      },
    },
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('english');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('farmaidLanguage');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
      localStorage.setItem('farmaidLanguage', newLanguage);
    }
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
