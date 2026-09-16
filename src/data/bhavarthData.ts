/**
 * Curated Authentic Bhavarth (भावार्थ व संदर्भा) Data
 * Provides verse-by-verse devotional meaning for iconic hymns.
 */

export interface StanzaBhavarth {
  stanzaNumber: number;
  marathi: string;
  english: string;
  keyInsights?: string[];
}

export interface HymnBhavarthProfile {
  hymnSlug: string;
  title: string;
  stanzas: StanzaBhavarth[];
}

export const BHAVARTH_REGISTRY: Record<string, HymnBhavarthProfile> = {
  'sukhkarta-dukhharta': {
    hymnSlug: 'sukhkarta-dukhharta',
    title: 'सुखकर्ता दुःखहर्ता (श्री गणपती आरती)',
    stanzas: [
      {
        stanzaNumber: 1,
        marathi:
          'सुख देणारा, दुःखाचे हरण करणारा आणि सर्व संकटांचे निवारण करणारा असा हा विघ्नहर्ता गणपती आहे. ज्याच्या भेटीने अंतःकरणाला नितांत प्रेम व आनंद प्राप्त होतो. सर्वांगाला लावलेली शेंदूराची उटी झळाळते आणि कंठात मोत्यांची सुंदर माळ शोभून दिसते.',
        english:
          'Lord Ganesha is the bestower of joy, the remover of all afflictions, and the dispeller of distress. Beholding Him fills the heart with pure divine love. His body radiates with auspicious vermilion (shendur), adorned with a resplendent pearl necklace.',
        keyInsights: ['आनंददाता', 'संकटनिवारक', 'शेंदूरविराजीत'],
      },
      {
        stanzaNumber: 2,
        marathi:
          'रत्नांनी जडलेला सुंदर सुवर्णमुकुट ज्याच्या मस्तकावर शोभतो, दोन्ही चरणांमध्ये रुणझुणणारे पैंजण वाजतात. रामदास स्वामी म्हणतात, हे मंगलमूर्ती! मी अत्यंत आतुरतेने तुमच्या दर्शनाची वाट पाहत आहे; माझ्यावर अखंड कृपादृष्टी ठेवावी.',
        english:
          'A golden crown studded with precious gems adorns His head, while bells chime melodiously at His lotus feet. Sant Ramdas declares: "O Lord of auspiciousness, I eagerly await Your divine sight; shower Your eternal grace upon me."',
        keyInsights: ['मुकुटमणी', 'नूपुर ध्वनी', 'समर्थ रामदास कृत'],
      },
      {
        stanzaNumber: 3,
        marathi:
          'ज्याचे उदर विशाल आहे, अंगावर पितांबर परिधान केले आहे आणि वक्र सोंड शेंदूराने सुंदर दिसते. त्रिनयनांचा (शंकराचा) पुत्र जो दासांवर प्रसन्न होऊन मनोरथ पूर्ण करतो. संकटात रक्षण करून शेवटपर्यंत उद्धार करतो.',
        english:
          'With His grand belly, golden-hued silk garments (pitambar), and elegant curved trunk anointed with vermilion, the three-eyed Lord Shiva\'s beloved Son fulfills the cherished wishes of His devotees and rescues them in times of peril.',
        keyInsights: ['लंबोदर', 'पितांबरधारी', 'शंकरसुत'],
      },
    ],
  },
  'lavthavti-vikrala': {
    hymnSlug: 'lavthavti-vikrala',
    title: 'लवथवती विक्राळा (महादेव आरती)',
    stanzas: [
      {
        stanzaNumber: 1,
        marathi:
          'ज्याच्या भाळावर विक्राळ त्रिनेत्र चमकतो, गळ्यात हलाहल विषाचा निळा डाग शोभतो. कपाळावर चंद्रकोर शीतल प्रकाश देते. अंगाला चिताभस्म चर्चिले असून मस्तक शुभ्र आणि डोळे आरक्त आहेत. अशा देवाधिदेव महादेवाची आम्ही भक्तीभावाने आरती करतो.',
        english:
          'The fierce third eye sparkles on His forehead, and the blue stain of cosmic poison (Halahala) adorns His throat. The crescent moon radiates cool divine peace, while sacred ash adorns His transcendent form.',
        keyInsights: ['त्रिनेत्र', 'नीलकंठ', 'चंद्रशेखर'],
      },
      {
        stanzaNumber: 2,
        marathi:
          'जटांच्या गंगेचा पवित्र प्रवाह वाहतो, गळ्यात सर्पांचे हार डुलतात. नंदी ज्याचे पवित्र वाहन आहे. रामदास स्वामी म्हणतात, हे शंभो कैलासपती! तुमच्या चरणी नतमस्तक होऊन मी जन्म-मरणाच्या फेऱ्यातून मुक्तीची याचना करतो.',
        english:
          'The holy Ganga cascades through His matted locks, serpents coil gracefully around His neck, and the loyal Nandi awaits His command. Sant Ramdas surrenders at Lord Shiva\'s lotus feet for liberation from worldly sorrow.',
        keyInsights: ['गंगाधर', 'भुजंगभूषण', 'नंदीवाहन'],
      },
      {
        stanzaNumber: 3,
        marathi:
          'हातात त्रिशूळ आणि डमरू धारण करून जो तांडव नृत्यात मग्न होतो. पार्वतीच्या समवेत जो कैलास पर्वतावर भक्तांच्या कल्याणासाठी सदैव तत्पर असतो.',
        english:
          'Holding the trident (Trishul) and the cosmic drum (Damaru), Lord Shiva dances in divine ecstasy with Mother Parvati, protecting and blessing all beings on Mount Kailash.',
        keyInsights: ['त्रिशूळपाणी', 'डमरूधर', 'कैलासपती'],
      },
    ],
  },
  'durge-durgat-bhari': {
    hymnSlug: 'durge-durgat-bhari',
    title: 'दुर्गे दुर्घट भारी (श्री तुळजाभवानी आरती)',
    stanzas: [
      {
        stanzaNumber: 1,
        marathi:
          'दुर्गा देवी संकटांचे निवारण करणारी आहे. संकटात सापडलेल्या भक्तांना तिची आठवण होताच ती त्वरित धावून येते. महिषासुरासारख्या बलाढ्य दैत्याचा संहार करून तिने विश्वाला अभय दिले.',
        english:
          'Mother Durga removes the most insurmountable hardships. The moment a distressed devotee calls upon Her, She rushes to protect them, having vanquished mighty demons like Mahishasura to restore universal harmony.',
        keyInsights: ['दुर्गा', 'संकटनाशिनी', 'महिषासुरमर्दिनी'],
      },
      {
        stanzaNumber: 2,
        marathi:
          'तुळजापूरची अधिष्ठात्री जगदंबा अष्टभुजांमध्ये विविध आयुधे धारण करते. रामदास स्वामी मातेला प्रार्थना करतात की, हे माते, अज्ञानाचा अंधकार दूर करून आम्हा भक्तांना तुझ्या चरणकमलांची सेवा दे.',
        english:
          'The supreme mother of Tuljapur, seated with eight weapons in Her divine hands, protects the universe. Sant Ramdas prays for Her loving shelter and eternal devotional wisdom.',
        keyInsights: ['तुळजापूर भवानी', 'अष्टभुजा', 'भक्तवत्सल'],
      },
    ],
  },
  'yuge-atthavis': {
    hymnSlug: 'yuge-atthavis',
    title: 'युगें अठ्ठावीस (श्री विठ्ठल आरती)',
    stanzas: [
      {
        stanzaNumber: 1,
        marathi:
          'अठ्ठावीस युगे लोटली तरी भक्त पुंडलिकासाठी विठ्ठल कटेवर हात ठेवून विटेवर उभा आहे. वामभागी रुक्मिणी माता शोभून दिसते. भीमा नदीच्या तीरावर चंद्रभागेच्या वाळवंटात सर्व संतांचा मेळा जमला आहे.',
        english:
          'For twenty-eight divine eons, Lord Vitthala has been standing on a humble brick for His devotee Pundalik with hands resting gracefully on His hips. Mother Rukmini graces His left, while on the banks of Chandrabhaga, saints gather in pure bliss.',
        keyInsights: ['अठ्ठावीस युगे', 'पुंडलिक वरद', 'चंद्रभागा तीर'],
      },
      {
        stanzaNumber: 2,
        marathi:
          'गळ्यात तुळशीची मंजिरी माळ आणि वैजयंती हार शोभतो. कानांमध्ये मत्स्याकार मकरकुंडले तळपतात. पीतांबर परिधान केलेल्या सावळ्या परब्रह्माचे रूप डोळ्यात साठवून नामदेव महाराज कृतज्ञतेने ओवाळतात.',
        english:
          'Adorned with fragrant Tulsi garlands and shining fish-shaped earrings, the dark-complexioned Supreme Reality stands in golden silk. Sant Namdev joyfully offers the holy aarti in deep devotional surrender.',
        keyInsights: ['तुळशीहार', 'मकरकुंडले', 'विष्णुदास नामा'],
      },
    ],
  },
  'aarti-sai-baba-saukhyadata': {
    hymnSlug: 'aarti-sai-baba-saukhyadata',
    title: 'आरती साई बाबा (सौख्यदातार जीवा)',
    stanzas: [
      {
        stanzaNumber: 1,
        marathi:
          'सर्व जीवांना परमानंदाचे सुख देणारे साईबाबा! तुमच्या चरणकमलांच्या धुळीमध्ये आम्हा दासांना व भक्तांना सदैव विश्रांती व समाधान लाभावे.',
        english:
          'O Sai Baba, giver of sublime peace to all souls! May Your devotees find eternal rest and solace at the sacred dust of Your lotus feet.',
        keyInsights: ['सौख्यदाता', 'चरणरज विसावा', 'शिर्डी महाआरती'],
      },
      {
        stanzaNumber: 2,
        marathi:
          'कामक्रोधादी विकार जाळून टाकून जे अखंड आत्मस्वरूपात लीन राहिले; आणि मुमुक्षु साधकांना साक्षात भगवंताचे (श्रीरंगाचे) दर्शन घडवून आणले.',
        english:
          'Having consumed worldly desires in the fire of detachment, He remains absorbed in the Supreme Self, revealing the divine vision of God to spiritual seekers.',
        keyInsights: ['आत्मलीन', 'अनंगदहन', 'मुमुक्षुतारक'],
      },
      {
        stanzaNumber: 3,
        marathi:
          'ज्याच्या मनात जसा शुद्ध भाव असेल, त्याला तसाच साक्षात प्रत्यय येतो. हे दयाघना, अशी तुमची अद्भुत आणि अगाध लीला आहे.',
        english:
          'Whatever pure faith a devotee holds in their heart, exactly such is their divine experience. Such is Your incomprehensible and compassionate play, O ocean of mercy.',
        keyInsights: ['जैसा भाव तैसा अनुभव', 'दयाघन'],
      },
    ],
  },
  'maruti-stotra-bhimrupi': {
    hymnSlug: 'maruti-stotra-bhimrupi',
    title: 'भीमरूपी महारुद्रा (मारुती स्तोत्र)',
    stanzas: [
      {
        stanzaNumber: 1,
        marathi:
          'भीमकाय महारुद्र, वज्रासारखे अभेद्य शरीर असलेले अंजनीसुत आणि प्रभू श्रीरामाचे निष्ठावान दूत श्री हनुमान! जे शक्तीचे सागर आणि सर्व प्राणांचे रक्षणकर्ते आहेत.',
        english:
          'The formidable Rudra incarnation with a diamond-indestructible body, the beloved son of Anjani and supreme messenger of Lord Rama! He restores vitality and dispels all planetary and evil afflictions.',
        keyInsights: ['वज्रदेह', 'अंजनीसुत', 'रामदूत'],
      },
      {
        stanzaNumber: 2,
        marathi:
          'विद्युल्लतेसारखी चपळ गती असणारे, ज्यांच्या एका उड्डाणाने मेरू व द्रोणागिरी पर्वत सहज उचलले गेले. अशा मारुतीरायांचे नित्य स्मरण केल्याने भूत, पिशाच, भय व सर्व रोगव्याधी नष्ट होतात.',
        english:
          'Swift as lightning, capable of lifting mount Dronagiri across worlds in moments. Reciting His praises destroys fear, negative energies, physical ailments, and spiritual distress.',
        keyInsights: ['विद्युद्गती', 'द्रोणाद्रि उत्पाटन', 'भयनिवारक'],
      },
    ],
  },
  'pasayadan-dnyaneshwar': {
    hymnSlug: 'pasayadan-dnyaneshwar',
    title: 'पसायदान (संत ज्ञानेश्वर महाराज)',
    stanzas: [
      {
        stanzaNumber: 1,
        marathi:
          'जगाचा जो विश्वात्मक परमेश्वर आहे, त्याने माझ्या या ज्ञानरूपी यज्ञाने संतुष्ट व्हावे आणि मला हे कल्याणकारी पसायदान (प्रसाद) द्यावे.',
        english:
          'May the universal Supreme Consciousness, pleased with this offering of the Dnyaneshwari discourse, bestow upon me this sacred gift (Pasayadan) of universal blessing.',
        keyInsights: ['विश्वात्मक देव', 'पसायदान', 'ज्ञानेश्वर माउली'],
      },
      {
        stanzaNumber: 2,
        marathi:
          'दुर्जनांच्या अंतःकरणातील दुष्ट बुद्धी नाहीशी व्हावी, सर्वांना सत्कर्माची गोडी लागावी आणि सर्व प्राणिमात्रांमध्ये एकमेकांविषयी बंधुभावाची मैत्री निर्माण व्हावी.',
        english:
          'May the wickedness of evil minds vanish; may all beings cultivate an earnest love for righteousness, and may universal friendship blossom among all living souls.',
        keyInsights: ['खळांची व्यंकटी सांडो', 'सत्कर्म प्रीती', 'भूतां परस्परें जडो मैत्री'],
      },
    ],
  },
};
