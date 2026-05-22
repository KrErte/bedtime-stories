import { Injectable, signal } from '@angular/core';

export interface LandingT {
  // Nav
  signIn: string; tryFree: string;
  // Hero
  heroBadge: string; heroTitle: string; heroHero: string;
  heroPara1: string; heroPara2: string;
  heroCta: string; heroNoCc: string;
  heroLovedBy: string; hero60Langs: string; heroAges: string; heroAudio: string;
  // Pain
  painQuote: string; painText: string; painQuestion: string;
  // How it works
  howTitle: string; howSubtitle: string;
  step1Title: string; step1Desc: string;
  step2Title: string; step2Desc: string;
  step3Title: string; step3Desc: string;
  // Demo
  demoTitle: string; demoSubtitle: string; demoNote: string;
  // Benefits
  benefitsTitle: string;
  b1Title: string; b1Desc: string;
  b2Title: string; b2Desc: string;
  b3Title: string; b3Desc: string;
  b4Title: string; b4Desc: string;
  b5Title: string; b5Desc: string;
  b6Title: string; b6Desc: string;
  // Testimonials
  testimonialsTitle: string; testimonialsSubtitle: string;
  t1Name: string; t1Role: string; t1Quote: string;
  t2Name: string; t2Role: string; t2Quote: string;
  t3Name: string; t3Role: string; t3Quote: string;
  t4Name: string; t4Role: string; t4Quote: string;
  t5Name: string; t5Role: string; t5Quote: string;
  t6Name: string; t6Role: string; t6Quote: string;
  // Pricing
  pricingTitle: string; pricingSubtitle: string;
  freeTier: string; freeForever: string;
  fFeat1: string; fFeat2: string; fFeat3: string; fFeat4NoAudio: string;
  mostPopular: string; proMonthly: string; proTrial: string;
  pFeat1: string; pFeat2: string; pFeat3: string; pFeat4: string; pFeat5: string;
  startFree: string; startTrial: string; priceNote: string;
  // FAQ
  faqTitle: string;
  q1: string; a1: string; q2: string; a2: string;
  q3: string; a3: string; q4: string; a4: string;
  q5: string; a5: string; q6: string; a6: string;
  // CTA
  ctaTitle: string; ctaSubtitle: string; ctaBtn: string; ctaNote: string;
  // Footer
  footerTagline: string; footerCopyright: string;
}

const T: Record<string, LandingT> = {
  en: {
    signIn: 'Sign In', tryFree: 'Try Free Tonight',
    heroBadge: 'Bedtime, reimagined',
    heroTitle: 'Tonight, your child is the', heroHero: 'hero',
    heroPara1: 'Imagine their face when they hear a bedtime story with their name, their favorite animal, and a magical adventure made just for them.',
    heroPara2: 'Personalized stories in 60+ languages. Ready in seconds. With soothing audio narration that guides them gently to sleep.',
    heroCta: 'Create Their First Story Free', heroNoCc: 'No credit card. No commitment. Just magic at bedtime.',
    heroLovedBy: 'Loved by parents', hero60Langs: '60+ languages', heroAges: 'Ages 2–10', heroAudio: 'Audio narration',
    painQuote: '"Read it again!" "One more story!" "But I\'m not sleepy..."',
    painText: 'Sound familiar? You\'re exhausted. They\'re wired. And you\'ve read The Very Hungry Caterpillar 347 times.',
    painQuestion: 'What if every night brought a brand-new story — starring your child?',
    howTitle: 'Ready in under a minute',
    howSubtitle: 'Three taps. That\'s all it takes between "I want a story!" and peaceful silence.',
    step1Title: '1. Tell us about your child', step1Desc: 'Their name, age, what they love — dinosaurs, princesses, space, puppies. We remember it all.',
    step2Title: '2. Choose the adventure', step2Desc: 'Courage, friendship, ocean, space — or tap "Surprise me!" and let the magic decide.',
    step3Title: '3. Press play & relax', step3Desc: 'A warm, soothing voice reads their personal story. Watch their eyes get heavy. Tiptoe out. You\'re free.',
    demoTitle: 'Hear the difference', demoSubtitle: 'This isn\'t a generic fairy tale. This is their story.',
    demoNote: 'Every story features your child\'s name, interests, and favorite animals.',
    benefitsTitle: 'Why parents switch to Dreamlit',
    b1Title: 'They actually fall asleep', b1Desc: 'Calm narration + a story they love = eyes closed in minutes. Not hours. Minutes.',
    b2Title: 'They feel special', b2Desc: '"That\'s MY name!" The look on their face when they\'re the hero is worth everything.',
    b3Title: 'Never the same story twice', b3Desc: 'Fresh adventures every night. No more reading the same book until you can recite it in your sleep.',
    b4Title: 'Stories in their language', b4Desc: '60+ languages — from Estonian to Japanese. Perfect for bilingual families or heritage language practice.',
    b5Title: 'Works for every child', b5Desc: 'Add up to 5 kids. Each gets stories tailored to their age, interests, and personality.',
    b6Title: 'Save your evenings', b6Desc: 'Press play, step away. The story handles bedtime so you can finally have that cup of tea.',
    testimonialsTitle: 'Don\'t take our word for it', testimonialsSubtitle: 'Here\'s what real parents are saying.',
    t1Name: 'Sarah M.', t1Role: 'Mom of 2', t1Quote: 'My daughter now ASKS to go to bed. She runs to her room saying "Is my story ready?" I never thought I\'d see the day.',
    t2Name: 'James K.', t2Role: 'Dad of 1', t2Quote: 'I press play, and he\'s out within 5 minutes. Every. Single. Night. This app has given me my evenings back.',
    t3Name: 'Priya L.', t3Role: 'Mom of 3', t3Quote: 'Three kids, three completely different stories, all at the same time. No more fighting over whose book to read. This is a lifesaver.',
    t4Name: 'Kadri T.', t4Role: 'Mom of 1', t4Quote: 'We use it in Estonian — my son hears his own name in his mother tongue every night. He tells his friends at school about his adventures.',
    t5Name: 'Michael R.', t5Role: 'Dad of 2', t5Quote: 'My kids used to need 45 minutes of negotiation to sleep. Now it\'s one story, lights out, done. Worth every cent of the Pro plan.',
    t6Name: 'Aisha B.', t6Role: 'Mom of 2', t6Quote: 'The story had her name, her cat Mr. Whiskers, AND her obsession with rainbows. She looked at me like I made actual magic. I almost cried.',
    pricingTitle: 'Less than a coffee. More than a bedtime book.',
    pricingSubtitle: 'Start free. Upgrade when you can\'t imagine bedtime without it.',
    freeTier: 'Free', freeForever: 'Forever free',
    fFeat1: '1 personalized story per day', fFeat2: 'Your child\'s name & interests', fFeat3: '1 beautiful illustration', fFeat4NoAudio: 'No audio narration',
    mostPopular: 'Most Popular', proMonthly: '$7.99/mo', proTrial: '7 days free — cancel anytime',
    pFeat1: 'Unlimited stories every day', pFeat2: 'Longer stories (500–600 words)', pFeat3: '3–4 illustrations per story', pFeat4: 'Audio narration — 4 soothing voices', pFeat5: 'PDF keepsakes to print & save',
    startFree: 'Start Free', startTrial: 'Start 7-Day Free Trial', priceNote: "That's $0.26/night for peaceful bedtimes",
    faqTitle: 'Questions parents ask',
    q1: 'How does it work?', a1: 'Tell us your child\'s name, age, and what they love. In seconds, our AI weaves a unique bedtime story starring them. Pro users also get soothing audio narration — just press play and relax.',
    q2: 'Is the free plan really free?', a2: 'Completely. One personalized story every day, no credit card, no catch. Most parents upgrade to Pro after the first week because their kids won\'t let them stop.',
    q3: 'Are the stories safe for kids?', a3: 'Every story is warm, gentle, and ends peacefully. No scary elements, no villains, no nightmares. Just cozy adventures designed to calm little minds before sleep.',
    q4: 'Can I cancel anytime?', a4: 'Yes, instantly. No emails, no phone calls, no guilt trips. Cancel in one click and keep Pro features until your billing period ends.',
    q5: 'What ages is this for?', a5: 'Ages 2–10. The stories automatically adjust — simpler language for toddlers, richer vocabulary for older kids.',
    q6: 'Can I use it in my own language?', a6: 'Yes! Dreamlit supports 60+ languages including Estonian, Finnish, Russian, Spanish, French, German, Chinese, Japanese, Arabic, and many more.',
    ctaTitle: 'Bedtime doesn\'t have to be a battle', ctaSubtitle: 'Tonight could be the night they ask to go to bed. Seriously.',
    ctaBtn: 'Create Their First Story — It\'s Free', ctaNote: 'Takes 30 seconds. No credit card required.',
    footerTagline: 'Making bedtime magical, one story at a time.', footerCopyright: '© 2026 Dreamlit.ee. All rights reserved.',
  },

  et: {
    signIn: 'Logi sisse', tryFree: 'Proovi täna õhtul',
    heroBadge: 'Unejutt, uuesti leiutatud',
    heroTitle: 'Täna õhtul on sinu laps', heroHero: 'kangelane',
    heroPara1: 'Kujuta ette nende nägu, kui nad kuulevad unejuttu oma nimega, oma lemmikloomaga ja seiklusega, mis on loodud just neile.',
    heroPara2: 'Personaliseeritud jutud 60+ keeles. Valmis sekunditega. Rahustava helilooga, mis juhib nad õrnalt unne.',
    heroCta: 'Loo nende esimene lugu tasuta', heroNoCc: 'Ei pangakaarti. Ei kohustusi. Ainult maagia magamaminekuajal.',
    heroLovedBy: 'Vanemate lemmik', hero60Langs: '60+ keelt', heroAges: 'Vanus 2–10', heroAudio: 'Heliloeng',
    painQuote: '"Loe uuesti!" "Veel üks lugu!" "Aga ma ei ole unine..."',
    painText: 'Tuttav kõlab? Sa oled kurnatud. Nad on virged. Ja sa oled lugenud Väga Näljast Rööviku 347 korda.',
    painQuestion: 'Mis oleks, kui iga õhtu tooks uue loo — kus tähed on sinu laps?',
    howTitle: 'Valmis alla minuti',
    howSubtitle: 'Kolm puudutust. See on kõik, mis on vaja "Tahan lugu!" ja rahuliku vaikuse vahel.',
    step1Title: '1. Räägi meile oma lapsest', step1Desc: 'Nende nimi, vanus, mida nad armastavad — dinosaurused, printsessid, kosmos, kutsikas. Me mäletame kõike.',
    step2Title: '2. Vali seiklus', step2Desc: 'Julgus, sõprus, ookean, kosmos — või vajuta "Üllata mind!" ja lase maagia otsustada.',
    step3Title: '3. Vajuta play ja lõdvestu', step3Desc: 'Soe, rahulik hääl loeb nende isiklikku lugu. Vaata, kuidas nende silmad raskeks lähevad. Hiili välja. Sa oled vaba.',
    demoTitle: 'Kuula erinevust', demoSubtitle: 'See pole tavaline muinasjutt. See on nende lugu.',
    demoNote: 'Igas loos on sinu lapse nimi, huvid ja lemmikloomad.',
    benefitsTitle: 'Miks vanemad valivad Dreamliti',
    b1Title: 'Nad jäävad päriselt magama', b1Desc: 'Rahulik loeng + lugu, mida nad armastavad = silmad kinni minutitega. Mitte tundidega. Minutitega.',
    b2Title: 'Nad tunnevad end erilisena', b2Desc: '"See on MINU nimi!" Nende nägu, kui nad on kangelased, on kõike väärt.',
    b3Title: 'Kunagi sama lugu kaks korda', b3Desc: 'Värskeid seiklusi iga õhtu. Ei enam sama raamatu lugemist, kuni suudad seda peast retsiteerida.',
    b4Title: 'Jutud nende keeles', b4Desc: '60+ keelt — eesti keelest jaapani keeleni. Ideaalne kakskeelsetele peredele.',
    b5Title: 'Sobib igale lapsele', b5Desc: 'Lisa kuni 5 last. Igaüks saab loo, mis on kohandatud nende vanusele, huvidele ja iseloomule.',
    b6Title: 'Säästke oma õhtuid', b6Desc: 'Vajuta play, astu kõrvale. Lugu hoolitseb magamamineku eest, et saaksid lõpuks selle tassi teed juua.',
    testimonialsTitle: 'Ärge võtke meie sõna', testimonialsSubtitle: 'Siin on, mida päris vanemad ütlevad.',
    t1Name: 'Sarah M.', t1Role: '2 lapse ema', t1Quote: 'Minu tütar KÜSIB nüüd ise magama minna. Ta jookseb oma tuppa öeldes "Kas mu lugu on valmis?" Ma ei uskunud, et seda päeva näen.',
    t2Name: 'James K.', t2Role: '1 lapse isa', t2Quote: 'Ma vajutan play ja ta on 5 minutiga magama jäänud. Iga. Üksainus. Õhtu. See rakendus on andnud mulle mu õhtud tagasi.',
    t3Name: 'Priya L.', t3Role: '3 lapse ema', t3Quote: 'Kolm last, kolm täiesti erinevat lugu, kõik korraga. Ei enam tülitsemist, kelle raamatut lugeda. See on päästerõngas.',
    t4Name: 'Kadri T.', t4Role: '1 lapse ema', t4Quote: 'Kasutame seda eesti keeles — mu poeg kuuleb oma nime emakeeles iga õhtu. Ta räägib oma seiklustest sõpradele koolis.',
    t5Name: 'Michael R.', t5Role: '2 lapse isa', t5Quote: 'Mu lapsed vajasid varem 45 minutit läbirääkimisi magama jäämiseks. Nüüd on üks lugu, tuled kustutatud, valmis. Iga sendi väärt.',
    t6Name: 'Aisha B.', t6Role: '2 lapse ema', t6Quote: 'Loos oli tema nimi, tema kass härra Vunts JA tema vikerkaarehullus. Ta vaatas mind nii, nagu oleksin päris maagia teinud. Mul läksid peaaegu silmad märjaks.',
    pricingTitle: 'Odavam kui kohv. Väärtuslikum kui unejuturaamat.',
    pricingSubtitle: 'Alusta tasuta. Uuenda, kui sa ei kujuta magamaminekut ilma selleta ette.',
    freeTier: 'Tasuta', freeForever: 'Igavesti tasuta',
    fFeat1: '1 personaliseeritud lugu päevas', fFeat2: 'Lapse nimi ja huvid', fFeat3: '1 ilus illustratsioon', fFeat4NoAudio: 'Heliloenguta',
    mostPopular: 'Populaarseim', proMonthly: '€4,99/kuu', proTrial: '7 päeva tasuta — tühista igal ajal',
    pFeat1: 'Piiramatu arv lugusid iga päev', pFeat2: 'Pikemad jutud (500–600 sõna)', pFeat3: '3–4 illustratsiooni loo kohta', pFeat4: 'Heliloeng — 4 rahulikku häält', pFeat5: 'PDF-mälestused printimiseks ja salvestamiseks',
    startFree: 'Alusta tasuta', startTrial: 'Alusta 7-päevast tasuta prooviperioodi', priceNote: 'See on €0,17/õhtu rahulike magamaminekute eest',
    faqTitle: 'Küsimused, mida vanemad esitavad',
    q1: 'Kuidas see töötab?', a1: 'Räägi meile lapse nimi, vanus ja mida ta armastab. Sekunditega loob meie tehisintellekt ainulaadse unejutu, kus ta on tähtis. Pro kasutajad saavad ka rahustavat heliloengut — vajuta lihtsalt play ja lõdvestu.',
    q2: 'Kas tasuta plaan on tõesti tasuta?', a2: 'Täiesti. Üks personaliseeritud lugu iga päev, ilma pangakaardita, ilma nippideta. Enamik vanemaid uuendab Pro-le esimese nädala jooksul, sest lapsed ei lase neil lõpetada.',
    q3: 'Kas lood on lastele ohutud?', a3: 'Iga lugu on soe, õrn ja lõpeb rahulikult. Ei hirmutavaid elemente, ei kurjategijaid, ei õudusunenägusid. Ainult hubased seiklused, mis on loodud rahulikult laste meeli enne magamaminekut.',
    q4: 'Kas saan igal ajal tühistada?', a4: 'Jah, koheselt. Ei kirju, ei kõnesid, ei süütunnet. Tühista ühe klõpsuga ja kasuta Pro funktsioone kuni arvestusperioodi lõpuni.',
    q5: 'Mis vanusele see mõeldud on?', a5: 'Vanusele 2–10. Jutud kohanduvad automaatselt — lihtsam keel väikelastele, rikkam sõnavara vanematele lastele.',
    q6: 'Kas saan kasutada oma keeles?', a6: 'Jah! Dreamlit toetab 60+ keelt, sealhulgas eesti, soome, vene, hispaania, prantsuse, saksa, hiina, jaapani, araabia ja palju muud.',
    ctaTitle: 'Magaminek ei pea olema lahing', ctaSubtitle: 'Täna õhtu võib olla see öö, kus nad ise paluvad magama minna. Tõsiselt.',
    ctaBtn: 'Loo nende esimene lugu — see on tasuta', ctaNote: 'Võtab 30 sekundit. Pangakaarti ei vajata.',
    footerTagline: 'Muudame magamamineku maagiliseks, üks lugu korraga.', footerCopyright: '© 2026 Dreamlit.ee. Kõik õigused kaitstud.',
  },

  ru: {
    signIn: 'Войти', tryFree: 'Попробовать бесплатно',
    heroBadge: 'Время сна, переосмысленное',
    heroTitle: 'Этой ночью твой ребёнок —', heroHero: 'герой',
    heroPara1: 'Представьте их лицо, когда они услышат сказку перед сном со своим именем, любимым животным и волшебным приключением, созданным специально для них.',
    heroPara2: 'Персонализированные истории на 60+ языках. Готово за секунды. С успокаивающей аудионарративом, который мягко убаюкивает их.',
    heroCta: 'Создать первую историю бесплатно', heroNoCc: 'Без карты. Без обязательств. Только волшебство перед сном.',
    heroLovedBy: 'Любимое у родителей', hero60Langs: '60+ языков', heroAges: 'Возраст 2–10', heroAudio: 'Аудионарратив',
    painQuote: '"Ещё раз!" "Ещё одну историю!" "Но я не хочу спать..."',
    painText: 'Знакомо? Вы устали. Они не хотят спать. И вы прочитали «Очень голодную гусеницу» 347 раз.',
    painQuestion: 'А что если каждый вечер приносил бы новую историю — где главный герой ваш ребёнок?',
    howTitle: 'Готово менее чем за минуту',
    howSubtitle: 'Три нажатия. Это всё, что нужно между «Хочу сказку!» и тишиной.',
    step1Title: '1. Расскажите о своём ребёнке', step1Desc: 'Имя, возраст, что они любят — динозавры, принцессы, космос, щенки. Мы всё запомним.',
    step2Title: '2. Выберите приключение', step2Desc: 'Смелость, дружба, океан, космос — или нажмите «Удиви меня!» и позвольте магии решить.',
    step3Title: '3. Нажмите play и расслабьтесь', step3Desc: 'Тёплый, успокаивающий голос читает их личную историю. Смотрите, как тяжелеют их глаза. Выйдите на цыпочках. Вы свободны.',
    demoTitle: 'Почувствуйте разницу', demoSubtitle: 'Это не обычная сказка. Это их история.',
    demoNote: 'В каждой истории есть имя вашего ребёнка, интересы и любимые животные.',
    benefitsTitle: 'Почему родители выбирают Dreamlit',
    b1Title: 'Они действительно засыпают', b1Desc: 'Спокойный нарратив + история, которую они любят = глаза закрыты через минуты. Не часы. Минуты.',
    b2Title: 'Они чувствуют себя особенными', b2Desc: '"Это МОЁ имя!" Их лицо, когда они главные герои, стоит всего.',
    b3Title: 'Никогда одна история дважды', b3Desc: 'Новые приключения каждый вечер. Больше не нужно читать одну книгу, пока не выучишь её наизусть.',
    b4Title: 'Истории на их языке', b4Desc: '60+ языков — от эстонского до японского. Идеально для двуязычных семей.',
    b5Title: 'Подходит каждому ребёнку', b5Desc: 'Добавьте до 5 детей. Каждый получает истории, адаптированные к возрасту и интересам.',
    b6Title: 'Сэкономьте вечера', b6Desc: 'Нажмите play, отойдите. История берёт на себя укладывание, чтобы вы наконец могли выпить чашку чая.',
    testimonialsTitle: 'Не верьте нам на слово', testimonialsSubtitle: 'Вот что говорят настоящие родители.',
    t1Name: 'Сара М.', t1Role: 'Мама двоих детей', t1Quote: 'Моя дочь теперь САМА просится спать. Она бежит в комнату: «Моя история готова?» Я не думала, что доживу до этого дня.',
    t2Name: 'Джеймс К.', t2Role: 'Папа одного ребёнка', t2Quote: 'Нажимаю play — и он засыпает за 5 минут. Каждый. Единственный. Вечер. Это приложение вернуло мне мои вечера.',
    t3Name: 'Прия Л.', t3Role: 'Мама троих детей', t3Quote: 'Три ребёнка, три совершенно разные истории одновременно. Больше никаких споров, чью книгу читать. Это спасение.',
    t4Name: 'Кадри Т.', t4Role: 'Мама одного ребёнка', t4Quote: 'Мы используем на эстонском — мой сын слышит своё имя на родном языке каждый вечер. Он рассказывает друзьям в школе о своих приключениях.',
    t5Name: 'Михаил Р.', t5Role: 'Папа двоих детей', t5Quote: 'Раньше детям нужно было 45 минут переговоров, чтобы заснуть. Теперь одна история, свет выключен, готово. Стоит каждого цента Pro-плана.',
    t6Name: 'Айша Б.', t6Role: 'Мама двоих детей', t6Quote: 'В истории было её имя, её кот Усатик И её увлечение радугами. Она смотрела на меня так, будто я сотворила настоящую магию. Я чуть не заплакала.',
    pricingTitle: 'Дешевле кофе. Ценнее книги для сна.',
    pricingSubtitle: 'Начните бесплатно. Обновитесь, когда не сможете представить сон без этого.',
    freeTier: 'Бесплатно', freeForever: 'Навсегда бесплатно',
    fFeat1: '1 персонализированная история в день', fFeat2: 'Имя и интересы ребёнка', fFeat3: '1 красивая иллюстрация', fFeat4NoAudio: 'Без аудионарратива',
    mostPopular: 'Самый популярный', proMonthly: '€4,99/мес', proTrial: '7 дней бесплатно — отмена в любой момент',
    pFeat1: 'Безлимитные истории каждый день', pFeat2: 'Более длинные истории (500–600 слов)', pFeat3: '3–4 иллюстрации к истории', pFeat4: 'Аудионарратив — 4 успокаивающих голоса', pFeat5: 'PDF-сувениры для печати и сохранения',
    startFree: 'Начать бесплатно', startTrial: 'Начать 7-дневный бесплатный период', priceNote: 'Это €0,17/ночь за спокойный сон',
    faqTitle: 'Вопросы родителей',
    q1: 'Как это работает?', a1: 'Расскажите имя ребёнка, возраст и что он любит. За секунды наш ИИ создаёт уникальную сказку, где он звезда. Пользователи Pro также получают успокаивающий аудионарратив.',
    q2: 'Бесплатный план действительно бесплатный?', a2: 'Полностью. Одна персонализированная история каждый день, без банковской карты. Большинство родителей переходят на Pro после первой недели — дети не дают остановиться.',
    q3: 'Безопасны ли истории для детей?', a3: 'Каждая история тёплая, нежная и заканчивается мирно. Никаких страшных элементов, злодеев, кошмаров. Только уютные приключения.',
    q4: 'Могу ли я отменить в любой момент?', a4: 'Да, мгновенно. Никаких писем, звонков, чувства вины. Отмените одним кликом и пользуйтесь Pro до конца расчётного периода.',
    q5: 'Для какого возраста это?', a5: 'Возраст 2–10. Истории автоматически адаптируются — проще для малышей, богаче для детей постарше.',
    q6: 'Могу ли я использовать на своём языке?', a6: 'Да! Dreamlit поддерживает 60+ языков: эстонский, финский, русский, испанский, французский, немецкий, китайский, японский, арабский и многие другие.',
    ctaTitle: 'Укладывание спать не должно быть битвой', ctaSubtitle: 'Сегодня вечером может быть та ночь, когда они сами попросятся спать. Серьёзно.',
    ctaBtn: 'Создать первую историю — это бесплатно', ctaNote: 'Занимает 30 секунд. Банковская карта не нужна.',
    footerTagline: 'Делаем время сна волшебным, одну историю за раз.', footerCopyright: '© 2026 Dreamlit.ee. Все права защищены.',
  },

  de: {
    signIn: 'Anmelden', tryFree: 'Heute Nacht kostenlos testen',
    heroBadge: 'Gute Nacht, neu erfunden',
    heroTitle: 'Heute Nacht ist dein Kind der', heroHero: 'Held',
    heroPara1: 'Stell dir ihr Gesicht vor, wenn sie eine Gutenachtgeschichte mit ihrem Namen, ihrem Lieblingstier und einem Abenteuer hören, das nur für sie gemacht ist.',
    heroPara2: 'Personalisierte Geschichten in 60+ Sprachen. In Sekunden fertig. Mit beruhigender Audioerzählung, die sie sanft in den Schlaf begleitet.',
    heroCta: 'Erste Geschichte kostenlos erstellen', heroNoCc: 'Keine Kreditkarte. Kein Abo. Nur Magie zur Schlafenszeit.',
    heroLovedBy: 'Eltern lieben es', hero60Langs: '60+ Sprachen', heroAges: 'Alter 2–10', heroAudio: 'Audioerzählung',
    painQuote: '"Nochmal!" "Noch eine Geschichte!" "Aber ich bin nicht müde..."',
    painText: 'Bekannt? Du bist erschöpft. Sie sind hellwach. Und du hast Die kleine Raupe Nimmersatt 347 Mal gelesen.',
    painQuestion: 'Was wäre, wenn jede Nacht eine brandneue Geschichte käme — mit deinem Kind als Hauptfigur?',
    howTitle: 'Fertig in unter einer Minute',
    howSubtitle: 'Drei Tipps. Das ist alles zwischen „Ich will eine Geschichte!" und friedlicher Stille.',
    step1Title: '1. Erzähl uns von deinem Kind', step1Desc: 'Name, Alter, was sie lieben — Dinosaurier, Prinzessinnen, Weltraum, Welpen. Wir merken uns alles.',
    step2Title: '2. Wähle das Abenteuer', step2Desc: 'Mut, Freundschaft, Ozean, Weltraum — oder tippe auf „Überrasch mich!" und lass die Magie entscheiden.',
    step3Title: '3. Play drücken & entspannen', step3Desc: 'Eine warme, beruhigende Stimme liest ihre persönliche Geschichte. Sieh, wie ihre Augen schwer werden. Schleich hinaus. Du bist frei.',
    demoTitle: 'Hör den Unterschied', demoSubtitle: 'Das ist kein gewöhnliches Märchen. Das ist ihre Geschichte.',
    demoNote: 'Jede Geschichte enthält den Namen deines Kindes, Interessen und Lieblingstiere.',
    benefitsTitle: 'Warum Eltern zu Dreamlit wechseln',
    b1Title: 'Sie schlafen wirklich ein', b1Desc: 'Ruhige Erzählung + eine Geschichte, die sie lieben = Augen zu in Minuten. Nicht Stunden. Minuten.',
    b2Title: 'Sie fühlen sich besonders', b2Desc: '"Das ist MEIN Name!" Der Blick in ihrem Gesicht, wenn sie der Held sind, ist alles wert.',
    b3Title: 'Nie dieselbe Geschichte zweimal', b3Desc: 'Frische Abenteuer jeden Abend. Nie wieder dasselbe Buch lesen, bis man es auswendig kann.',
    b4Title: 'Geschichten in ihrer Sprache', b4Desc: '60+ Sprachen — von Estnisch bis Japanisch. Perfekt für zweisprachige Familien.',
    b5Title: 'Für jedes Kind geeignet', b5Desc: 'Füge bis zu 5 Kinder hinzu. Jedes bekommt Geschichten, die auf sein Alter und Interessen zugeschnitten sind.',
    b6Title: 'Spare deine Abende', b6Desc: 'Play drücken, zurückziehen. Die Geschichte kümmert sich ums Schlafengehen, damit du endlich diese Tasse Tee trinken kannst.',
    testimonialsTitle: 'Vertrau uns nicht einfach so', testimonialsSubtitle: 'Das sagen echte Eltern.',
    t1Name: 'Sarah M.', t1Role: 'Mutter von 2', t1Quote: 'Meine Tochter BITTET jetzt von selbst ins Bett zu gehen. Sie rennt in ihr Zimmer: „Ist meine Geschichte fertig?" Das hätte ich nie gedacht.',
    t2Name: 'James K.', t2Role: 'Vater von 1', t2Quote: 'Ich drücke Play, und er schläft innerhalb von 5 Minuten ein. Jeden. Einzigen. Abend. Diese App hat mir meine Abende zurückgegeben.',
    t3Name: 'Priya L.', t3Role: 'Mutter von 3', t3Quote: 'Drei Kinder, drei völlig verschiedene Geschichten gleichzeitig. Kein Streit mehr darüber, wessen Buch gelesen wird. Ein Lebensretter.',
    t4Name: 'Kadri T.', t4Role: 'Mutter von 1', t4Quote: 'Wir nutzen es auf Estnisch — mein Sohn hört seinen Namen jeden Abend in seiner Muttersprache. Er erzählt seinen Schulfreunden von seinen Abenteuern.',
    t5Name: 'Michael R.', t5Role: 'Vater von 2', t5Quote: 'Meine Kinder brauchten früher 45 Minuten Verhandeln zum Einschlafen. Jetzt: eine Geschichte, Licht aus, fertig. Jeden Cent des Pro-Plans wert.',
    t6Name: 'Aisha B.', t6Role: 'Mutter von 2', t6Quote: 'Die Geschichte hatte ihren Namen, ihre Katze Frau Schnurrbart UND ihre Regenbogenbegeisterung. Sie schaute mich an, als hätte ich echte Magie gemacht. Ich hätte fast geweint.',
    pricingTitle: 'Günstiger als ein Kaffee. Wertvoller als ein Gutenachtbuch.',
    pricingSubtitle: 'Fang kostenlos an. Upgrade, wenn du dir Schlafenszeit ohne Dreamlit nicht mehr vorstellen kannst.',
    freeTier: 'Kostenlos', freeForever: 'Für immer kostenlos',
    fFeat1: '1 personalisierte Geschichte pro Tag', fFeat2: 'Name & Interessen deines Kindes', fFeat3: '1 schöne Illustration', fFeat4NoAudio: 'Keine Audioerzählung',
    mostPopular: 'Beliebteste', proMonthly: '€4,99/Monat', proTrial: '7 Tage kostenlos — jederzeit kündbar',
    pFeat1: 'Unbegrenzte Geschichten täglich', pFeat2: 'Längere Geschichten (500–600 Wörter)', pFeat3: '3–4 Illustrationen pro Geschichte', pFeat4: 'Audioerzählung — 4 beruhigende Stimmen', pFeat5: 'PDF-Erinnerungen zum Drucken & Speichern',
    startFree: 'Kostenlos starten', startTrial: '7-tägige Gratisphase starten', priceNote: 'Das sind €0,17/Nacht für ruhige Schlafenszeiten',
    faqTitle: 'Fragen von Eltern',
    q1: 'Wie funktioniert das?', a1: 'Erzähl uns Namen, Alter und was dein Kind liebt. In Sekunden webt unsere KI eine einzigartige Gutenachtgeschichte. Pro-Nutzer erhalten auch beruhigende Audioerzählung.',
    q2: 'Ist der kostenlose Plan wirklich kostenlos?', a2: 'Vollständig. Eine personalisierte Geschichte täglich, keine Kreditkarte, kein Haken. Die meisten Eltern upgraden nach der ersten Woche, weil ihre Kinder nicht aufhören wollen.',
    q3: 'Sind die Geschichten sicher für Kinder?', a3: 'Jede Geschichte ist warm, sanft und endet friedlich. Keine gruseligen Elemente, keine Bösewichte, keine Albträume. Nur gemütliche Abenteuer.',
    q4: 'Kann ich jederzeit kündigen?', a4: 'Ja, sofort. Keine E-Mails, keine Anrufe, kein schlechtes Gewissen. Ein Klick und du behältst Pro-Funktionen bis zum Ende des Abrechnungszeitraums.',
    q5: 'Für welches Alter ist das?', a5: 'Alter 2–10. Die Geschichten passen sich automatisch an — einfachere Sprache für Kleinkinder, reicherer Wortschatz für ältere Kinder.',
    q6: 'Kann ich es in meiner Sprache nutzen?', a6: 'Ja! Dreamlit unterstützt 60+ Sprachen: Estnisch, Finnisch, Russisch, Spanisch, Französisch, Deutsch, Chinesisch, Japanisch, Arabisch und viele mehr.',
    ctaTitle: 'Schlafenszeit muss keine Schlacht sein', ctaSubtitle: 'Heute Nacht könnte die Nacht sein, an der sie von selbst ins Bett wollen. Wirklich.',
    ctaBtn: 'Erste Geschichte erstellen — kostenlos', ctaNote: 'Dauert 30 Sekunden. Keine Kreditkarte erforderlich.',
    footerTagline: 'Schlafenszeit magisch machen, eine Geschichte nach der anderen.', footerCopyright: '© 2026 Dreamlit.ee. Alle Rechte vorbehalten.',
  },

  fi: {
    signIn: 'Kirjaudu sisään', tryFree: 'Kokeile tänä iltana',
    heroBadge: 'Nukkumaanmeno, uudelleenkuviteltuna',
    heroTitle: 'Tänä yönä lapsesi on', heroHero: 'sankari',
    heroPara1: 'Kuvittele heidän ilmeensä, kun he kuulevat iltasadun omalla nimellään, lempieläimellään ja seikkailulla, joka on tehty juuri heille.',
    heroPara2: 'Henkilökohtaistettuja tarinoita 60+ kielellä. Valmis sekunneissa. Rauhoittavalla ääninarraatiolla, joka ohjaa heidät uneen.',
    heroCta: 'Luo heidän ensimmäinen tarinansa ilmaiseksi', heroNoCc: 'Ei luottokorttia. Ei sitoutumista. Vain taikaa nukkumaanmenoon.',
    heroLovedBy: 'Vanhempien suosikki', hero60Langs: '60+ kieltä', heroAges: 'Ikä 2–10', heroAudio: 'Ääninarraatio',
    painQuote: '"Lue uudelleen!" "Yksi tarina lisää!" "Mutta en ole uninen..."',
    painText: 'Kuulostaako tutulta? Olet uupunut. He ovat energisiä. Ja olet lukenut Nälkäisen toukan 347 kertaa.',
    painQuestion: 'Entä jos joka ilta toisi uuden tarinan — jossa sinun lapsesi on päähenkilö?',
    howTitle: 'Valmis alle minuutissa',
    howSubtitle: 'Kolme napautusta. Se on kaikki mitä tarvitaan "Haluan tarinan!" ja rauhallisen hiljaisuuden välillä.',
    step1Title: '1. Kerro lapsestasi', step1Desc: 'Nimi, ikä, mitä he rakastavat — dinosaurukset, prinsessat, avaruus, pennut. Muistamme kaiken.',
    step2Title: '2. Valitse seikkailu', step2Desc: 'Rohkeus, ystävyys, valtameri, avaruus — tai napauta "Yllätä minut!" ja anna magian päättää.',
    step3Title: '3. Paina play ja rentoudu', step3Desc: 'Lämmin, rauhoittava ääni lukee heidän henkilökohtaisen tarinansa. Katso, kun silmät sulkeutuvat. Liiku äänettömästi ulos. Olet vapaa.',
    demoTitle: 'Kuule ero', demoSubtitle: 'Tämä ei ole tavallinen satu. Tämä on heidän tarinansa.',
    demoNote: 'Jokaisessa tarinassa on lapsesi nimi, kiinnostuksen kohteet ja lemmikkieläimet.',
    benefitsTitle: 'Miksi vanhemmat valitsevat Dreamlitin',
    b1Title: 'He oikeasti nukahtavat', b1Desc: 'Rauhallinen kerronta + tarina, jota he rakastavat = silmät kiinni minuuteissa. Ei tunneissa. Minuuteissa.',
    b2Title: 'He tuntevat itsensä erityisiksi', b2Desc: '"Se on MINUN nimeni!" Heidän ilmeensä, kun he ovat sankareita, on kaiken arvoinen.',
    b3Title: 'Ei koskaan sama tarina kahdesti', b3Desc: 'Tuoreita seikkailuja joka ilta. Ei enää saman kirjan lukemista niin monta kertaa, että sen voi lausua ulkoa.',
    b4Title: 'Tarinoita heidän kielellään', b4Desc: '60+ kieltä — virosta japaniin. Täydellinen kaksikielisille perheille.',
    b5Title: 'Sopii jokaiselle lapselle', b5Desc: 'Lisää jopa 5 lasta. Jokainen saa tarinoita, jotka on räätälöity heidän iälleen ja kiinnostuksen kohteillensa.',
    b6Title: 'Säästä iltasi', b6Desc: 'Paina play, astu sivuun. Tarina hoitaa nukkumaanmenon, jotta voit vihdoin juoda sen kupin teetä.',
    testimonialsTitle: 'Älä usko vain meitä', testimonialsSubtitle: 'Tässä mitä oikeat vanhemmat sanovat.',
    t1Name: 'Sarah M.', t1Role: '2 lapsen äiti', t1Quote: 'Tyttäreni nyt PYYTÄÄ mennä nukkumaan. Hän juoksee huoneeseensa sanoen "Onko tarinani valmis?" En uskonut näkeväni tätä päivää.',
    t2Name: 'James K.', t2Role: '1 lapsen isä', t2Quote: 'Painan play ja hän nukahtaa 5 minuutissa. Joka. Ainoa. Ilta. Tämä sovellus on antanut minulle iltani takaisin.',
    t3Name: 'Priya L.', t3Role: '3 lapsen äiti', t3Quote: 'Kolme lasta, kolme täysin erilaista tarinaa samanaikaisesti. Ei enää riitoja siitä, kenen kirjaa luetaan. Tämä on pelastus.',
    t4Name: 'Kadri T.', t4Role: '1 lapsen äiti', t4Quote: 'Käytämme sitä viroksi — poikani kuulee nimensä äidinkielellään joka ilta. Hän kertoo koulukavereilleen seikkailuistaan.',
    t5Name: 'Michael R.', t5Role: '2 lapsen isä', t5Quote: 'Lapseni tarvitsivat ennen 45 minuuttia neuvotteluja nukahtaakseen. Nyt yksi tarina, valot pois, valmis. Jokaisen sentin arvoinen.',
    t6Name: 'Aisha B.', t6Role: '2 lapsen äiti', t6Quote: 'Tarinassa oli hänen nimensä, hänen kissansa herra Viikset JA hänen sateenkaaripakkomielteensä. Hän katsoi minua kuin olisin tehnyt oikeaa taikuutta. Melkein itkin.',
    pricingTitle: 'Halvempi kuin kahvi. Arvokkaampi kuin iltasaturaamat.',
    pricingSubtitle: 'Aloita ilmaiseksi. Päivitä, kun et voi kuvitella nukkumaanmenoa ilman sitä.',
    freeTier: 'Ilmainen', freeForever: 'Ikuisesti ilmainen',
    fFeat1: '1 henkilökohtaistettu tarina päivässä', fFeat2: 'Lapsesi nimi ja kiinnostuksen kohteet', fFeat3: '1 kaunis kuvitus', fFeat4NoAudio: 'Ei ääninarraatiota',
    mostPopular: 'Suosituin', proMonthly: '€4,99/kk', proTrial: '7 päivää ilmaiseksi — peruuta milloin tahansa',
    pFeat1: 'Rajoittamattomat tarinat päivittäin', pFeat2: 'Pidemmät tarinat (500–600 sanaa)', pFeat3: '3–4 kuvitusta per tarina', pFeat4: 'Ääninarraatio — 4 rauhoittavaa ääntä', pFeat5: 'PDF-muistot tulostettavaksi ja tallennettavaksi',
    startFree: 'Aloita ilmaiseksi', startTrial: 'Aloita 7 päivän ilmainen kokeilu', priceNote: 'Se on €0,17/yö rauhallisille nukkumaanmenoille',
    faqTitle: 'Vanhempien kysymyksiä',
    q1: 'Miten se toimii?', a1: 'Kerro lapsesi nimi, ikä ja mitä he rakastavat. Sekunneissa tekoälymme luo ainutlaatuisen iltasadun. Pro-käyttäjät saavat myös rauhoittavan ääninarraation.',
    q2: 'Onko ilmainen suunnitelma todella ilmainen?', a2: 'Täysin. Yksi henkilökohtaistettu tarina joka päivä, ilman luottokorttia. Useimmat vanhemmat päivittävät Prohon ensimmäisen viikon jälkeen, koska lapset eivät anna lopettaa.',
    q3: 'Ovatko tarinat turvallisia lapsille?', a3: 'Jokainen tarina on lämmin, lempeä ja päättyy rauhallisesti. Ei pelottavia elementtejä, pahiksia tai painajaisia.',
    q4: 'Voinko peruuttaa milloin tahansa?', a4: 'Kyllä, välittömästi. Ei sähköposteja, puheluja tai syyllisyyttä. Peruuta yhdellä napsautuksella.',
    q5: 'Mille iälle tämä sopii?', a5: 'Ikä 2–10. Tarinat sopeutuvat automaattisesti — yksinkertaisempi kieli taaperoille, rikkaampi sanasto vanhemmille lapsille.',
    q6: 'Voinko käyttää omalla kielelläni?', a6: 'Kyllä! Dreamlit tukee 60+ kieltä: viro, suomi, venäjä, espanja, ranska, saksa, kiina, japani, arabia ja paljon muuta.',
    ctaTitle: 'Nukkumaanmenon ei tarvitse olla taistelu', ctaSubtitle: 'Tänä yönä voi olla se yö, kun he itse pyytävät mennä nukkumaan. Tosissaan.',
    ctaBtn: 'Luo heidän ensimmäinen tarinansa — se on ilmainen', ctaNote: 'Vie 30 sekuntia. Luottokorttia ei tarvita.',
    footerTagline: 'Teemme nukkumaanmenosta taianomaista, yksi tarina kerrallaan.', footerCopyright: '© 2026 Dreamlit.ee. Kaikki oikeudet pidätetään.',
  },

  fr: {
    signIn: 'Se connecter', tryFree: 'Essayer gratuitement ce soir',
    heroBadge: 'L\'heure du coucher, réinventée',
    heroTitle: 'Ce soir, votre enfant est le', heroHero: 'héros',
    heroPara1: 'Imaginez leur visage quand ils entendent une histoire du soir avec leur prénom, leur animal préféré et une aventure magique créée juste pour eux.',
    heroPara2: 'Histoires personnalisées en 60+ langues. Prêtes en secondes. Avec une narration audio apaisante qui les guide doucement vers le sommeil.',
    heroCta: 'Créer leur première histoire gratuitement', heroNoCc: 'Sans carte. Sans engagement. Juste de la magie à l\'heure du coucher.',
    heroLovedBy: 'Adoré des parents', hero60Langs: '60+ langues', heroAges: 'Âge 2–10', heroAudio: 'Narration audio',
    painQuote: '"Encore !" "Encore une histoire !" "Mais je n\'ai pas sommeil..."',
    painText: 'Ça vous parle ? Vous êtes épuisé(e). Ils sont surexcités. Et vous avez lu La Chenille qui fait des trous 347 fois.',
    painQuestion: 'Et si chaque soir apportait une toute nouvelle histoire — avec votre enfant comme héros ?',
    howTitle: 'Prêt en moins d\'une minute',
    howSubtitle: 'Trois appuis. C\'est tout ce qu\'il faut entre « Je veux une histoire ! » et le silence paisible.',
    step1Title: '1. Parlez-nous de votre enfant', step1Desc: 'Son prénom, son âge, ce qu\'il adore — dinosaures, princesses, espace, chiots. On retient tout.',
    step2Title: '2. Choisissez l\'aventure', step2Desc: 'Courage, amitié, océan, espace — ou appuyez sur « Surprends-moi ! » et laissez la magie décider.',
    step3Title: '3. Appuyer sur play & se détendre', step3Desc: 'Une voix douce et apaisante lit leur histoire personnelle. Regardez leurs yeux s\'alourdir. Sortez sur la pointe des pieds. Vous êtes libre.',
    demoTitle: 'Entendez la différence', demoSubtitle: 'Ce n\'est pas un conte ordinaire. C\'est leur histoire.',
    demoNote: 'Chaque histoire contient le prénom de votre enfant, ses centres d\'intérêt et ses animaux préférés.',
    benefitsTitle: 'Pourquoi les parents choisissent Dreamlit',
    b1Title: 'Ils s\'endorment vraiment', b1Desc: 'Narration calme + une histoire qu\'ils adorent = yeux fermés en quelques minutes. Pas des heures. Des minutes.',
    b2Title: 'Ils se sentent spéciaux', b2Desc: '"C\'est MON prénom !" Leur regard quand ils sont le héros vaut tout.',
    b3Title: 'Jamais la même histoire deux fois', b3Desc: 'De nouvelles aventures chaque soir. Finis les mêmes livres relus jusqu\'à les connaître par cœur.',
    b4Title: 'Histoires dans leur langue', b4Desc: '60+ langues — de l\'estonien au japonais. Parfait pour les familles bilingues.',
    b5Title: 'Convient à chaque enfant', b5Desc: 'Ajoutez jusqu\'à 5 enfants. Chacun reçoit des histoires adaptées à son âge et ses intérêts.',
    b6Title: 'Libérez vos soirées', b6Desc: 'Appuyez sur play, sortez. L\'histoire gère le coucher pour que vous puissiez enfin boire cette tasse de thé.',
    testimonialsTitle: 'Ne nous croyez pas sur parole', testimonialsSubtitle: 'Voici ce que disent de vrais parents.',
    t1Name: 'Sarah M.', t1Role: 'Maman de 2', t1Quote: 'Ma fille DEMANDE maintenant à aller se coucher. Elle court dans sa chambre en disant "Mon histoire est prête ?" Je n\'aurais jamais cru voir ça.',
    t2Name: 'James K.', t2Role: 'Papa de 1', t2Quote: 'J\'appuie sur play et il est endormi en 5 minutes. Chaque. Soir. Sans. Exception. Cette appli m\'a rendu mes soirées.',
    t3Name: 'Priya L.', t3Role: 'Maman de 3', t3Quote: 'Trois enfants, trois histoires complètement différentes en même temps. Plus de disputes pour savoir quel livre lire. C\'est une bouée de sauvetage.',
    t4Name: 'Kadri T.', t4Role: 'Maman de 1', t4Quote: 'On l\'utilise en estonien — mon fils entend son prénom dans sa langue maternelle chaque soir. Il raconte ses aventures à ses amis à l\'école.',
    t5Name: 'Michael R.', t5Role: 'Papa de 2', t5Quote: 'Mes enfants avaient besoin de 45 minutes de négociations pour s\'endormir. Maintenant c\'est une histoire, éteignez les lumières, terminé. Chaque centime du plan Pro en vaut la peine.',
    t6Name: 'Aisha B.', t6Role: 'Maman de 2', t6Quote: 'L\'histoire avait son prénom, son chat Monsieur Moustaches ET son obsession pour les arcs-en-ciel. Elle m\'a regardée comme si j\'avais fait de la vraie magie. J\'ai failli pleurer.',
    pricingTitle: 'Moins cher qu\'un café. Plus précieux qu\'un livre du soir.',
    pricingSubtitle: 'Commencez gratuitement. Passez en Pro quand vous ne pouvez plus vous passer du coucher avec Dreamlit.',
    freeTier: 'Gratuit', freeForever: 'Gratuit pour toujours',
    fFeat1: '1 histoire personnalisée par jour', fFeat2: 'Le prénom & les intérêts de votre enfant', fFeat3: '1 belle illustration', fFeat4NoAudio: 'Sans narration audio',
    mostPopular: 'Le plus populaire', proMonthly: '€4,99/mois', proTrial: '7 jours gratuits — annulez à tout moment',
    pFeat1: 'Histoires illimitées chaque jour', pFeat2: 'Histoires plus longues (500–600 mots)', pFeat3: '3–4 illustrations par histoire', pFeat4: 'Narration audio — 4 voix apaisantes', pFeat5: 'Souvenirs PDF à imprimer & sauvegarder',
    startFree: 'Commencer gratuitement', startTrial: 'Commencer l\'essai gratuit de 7 jours', priceNote: 'Soit €0,17/nuit pour des couchers sereins',
    faqTitle: 'Questions des parents',
    q1: 'Comment ça marche ?', a1: 'Dites-nous le prénom, l\'âge et ce que votre enfant aime. En secondes, notre IA crée une histoire unique. Les utilisateurs Pro ont aussi la narration audio.',
    q2: 'L\'offre gratuite est vraiment gratuite ?', a2: 'Complètement. Une histoire personnalisée chaque jour, sans carte bancaire. La plupart des parents passent en Pro dès la première semaine car leurs enfants ne veulent plus arrêter.',
    q3: 'Les histoires sont-elles sûres pour les enfants ?', a3: 'Chaque histoire est chaleureuse, douce et se termine paisiblement. Pas d\'éléments effrayants, de méchants ou de cauchemars.',
    q4: 'Puis-je annuler à tout moment ?', a4: 'Oui, instantanément. Pas d\'e-mails, pas d\'appels, pas de culpabilité. Annulez en un clic et gardez les fonctionnalités Pro jusqu\'à la fin de la période de facturation.',
    q5: 'Pour quel âge est-ce ?', a5: 'Âge 2–10. Les histoires s\'adaptent automatiquement — langage plus simple pour les tout-petits, vocabulaire plus riche pour les grands.',
    q6: 'Puis-je l\'utiliser dans ma langue ?', a6: 'Oui ! Dreamlit prend en charge 60+ langues : estonien, finnois, russe, espagnol, français, allemand, chinois, japonais, arabe et bien d\'autres.',
    ctaTitle: 'L\'heure du coucher n\'a pas à être une bataille', ctaSubtitle: 'Ce soir pourrait être la nuit où ils demandent à aller se coucher. Vraiment.',
    ctaBtn: 'Créer leur première histoire — c\'est gratuit', ctaNote: 'Prend 30 secondes. Aucune carte bancaire requise.',
    footerTagline: 'Rendre le coucher magique, une histoire à la fois.', footerCopyright: '© 2026 Dreamlit.ee. Tous droits réservés.',
  },

  es: {
    signIn: 'Iniciar sesión', tryFree: 'Probar gratis esta noche',
    heroBadge: 'La hora de dormir, reinventada',
    heroTitle: 'Esta noche, tu hijo es el', heroHero: 'héroe',
    heroPara1: 'Imagina su cara cuando escuchen un cuento con su nombre, su animal favorito y una aventura mágica hecha solo para ellos.',
    heroPara2: 'Cuentos personalizados en 60+ idiomas. Listos en segundos. Con narración de audio relajante que los guía suavemente al sueño.',
    heroCta: 'Crea su primer cuento gratis', heroNoCc: 'Sin tarjeta. Sin compromiso. Solo magia a la hora de dormir.',
    heroLovedBy: 'Amado por los padres', hero60Langs: '60+ idiomas', heroAges: 'Edades 2–10', heroAudio: 'Narración de audio',
    painQuote: '"¡Otra vez!" "¡Un cuento más!" "Pero no tengo sueño..."',
    painText: '¿Te suena familiar? Estás agotado/a. Ellos están activos. Y has leído La Oruga Muy Hambrienta 347 veces.',
    painQuestion: '¿Y si cada noche traía un cuento completamente nuevo, con tu hijo como protagonista?',
    howTitle: 'Listo en menos de un minuto',
    howSubtitle: 'Tres toques. Eso es todo lo que hay entre "¡Quiero un cuento!" y el silencio tranquilo.',
    step1Title: '1. Cuéntanos sobre tu hijo', step1Desc: 'Su nombre, edad, lo que aman — dinosaurios, princesas, espacio, cachorros. Lo recordamos todo.',
    step2Title: '2. Elige la aventura', step2Desc: 'Valentía, amistad, océano, espacio — o toca "¡Sorpréndeme!" y deja que la magia decida.',
    step3Title: '3. Dale a play y relájate', step3Desc: 'Una voz cálida y tranquilizadora lee su historia personal. Mira cómo se les cierran los ojos. Sal de puntillas. Eres libre.',
    demoTitle: 'Escucha la diferencia', demoSubtitle: 'Este no es un cuento genérico. Es su historia.',
    demoNote: 'Cada cuento incluye el nombre de tu hijo, sus intereses y animales favoritos.',
    benefitsTitle: 'Por qué los padres eligen Dreamlit',
    b1Title: 'Realmente se duermen', b1Desc: 'Narración tranquila + un cuento que aman = ojos cerrados en minutos. No horas. Minutos.',
    b2Title: 'Se sienten especiales', b2Desc: '"¡Ese es MI nombre!" Su cara cuando son el héroe lo vale todo.',
    b3Title: 'Nunca el mismo cuento dos veces', b3Desc: 'Nuevas aventuras cada noche. Sin más leer el mismo libro hasta memorizarlo.',
    b4Title: 'Cuentos en su idioma', b4Desc: '60+ idiomas — del estonio al japonés. Perfecto para familias bilingües.',
    b5Title: 'Para cada niño', b5Desc: 'Agrega hasta 5 niños. Cada uno recibe cuentos adaptados a su edad e intereses.',
    b6Title: 'Recupera tus noches', b6Desc: 'Dale a play y retírate. El cuento se encarga de la hora de dormir para que puedas tomar esa taza de té.',
    testimonialsTitle: 'No nos creas a nosotros', testimonialsSubtitle: 'Esto es lo que dicen los padres reales.',
    t1Name: 'Sarah M.', t1Role: 'Mamá de 2', t1Quote: 'Mi hija ahora PIDE irse a la cama. Corre a su habitación diciendo "¿Está mi cuento listo?" Nunca pensé que vería ese día.',
    t2Name: 'James K.', t2Role: 'Papá de 1', t2Quote: 'Doy a play y se duerme en 5 minutos. Cada. Única. Noche. Esta app me ha devuelto mis noches.',
    t3Name: 'Priya L.', t3Role: 'Mamá de 3', t3Quote: 'Tres niños, tres historias completamente diferentes al mismo tiempo. Sin más peleas sobre qué libro leer. Es un salvavidas.',
    t4Name: 'Kadri T.', t4Role: 'Mamá de 1', t4Quote: 'Lo usamos en estonio — mi hijo escucha su nombre en su lengua materna cada noche. Les cuenta a sus amigos del colegio sobre sus aventuras.',
    t5Name: 'Michael R.', t5Role: 'Papá de 2', t5Quote: 'Mis hijos necesitaban 45 minutos de negociaciones para dormir. Ahora es un cuento, luces apagadas, listo. Vale cada céntimo del plan Pro.',
    t6Name: 'Aisha B.', t6Role: 'Mamá de 2', t6Quote: 'El cuento tenía su nombre, su gato Sr. Bigotes Y su obsesión con los arcoíris. Me miró como si hubiera hecho magia de verdad. Casi lloré.',
    pricingTitle: 'Más barato que un café. Más valioso que un libro de cuentos.',
    pricingSubtitle: 'Empieza gratis. Mejora cuando no puedas imaginar dormir sin ello.',
    freeTier: 'Gratis', freeForever: 'Gratis para siempre',
    fFeat1: '1 cuento personalizado por día', fFeat2: 'Nombre e intereses de tu hijo', fFeat3: '1 hermosa ilustración', fFeat4NoAudio: 'Sin narración de audio',
    mostPopular: 'Más popular', proMonthly: '€4,99/mes', proTrial: '7 días gratis — cancela cuando quieras',
    pFeat1: 'Cuentos ilimitados cada día', pFeat2: 'Cuentos más largos (500–600 palabras)', pFeat3: '3–4 ilustraciones por cuento', pFeat4: 'Narración de audio — 4 voces tranquilizadoras', pFeat5: 'Recuerdos en PDF para imprimir y guardar',
    startFree: 'Empezar gratis', startTrial: 'Iniciar prueba gratuita de 7 días', priceNote: 'Son €0,17/noche para una hora de dormir tranquila',
    faqTitle: 'Preguntas de los padres',
    q1: '¿Cómo funciona?', a1: 'Cuéntanos el nombre, edad y lo que le gusta a tu hijo. En segundos, nuestra IA crea un cuento único. Los usuarios Pro también reciben narración de audio.',
    q2: '¿El plan gratuito es realmente gratis?', a2: 'Completamente. Un cuento personalizado cada día, sin tarjeta de crédito. La mayoría de los padres mejoran a Pro después de la primera semana.',
    q3: '¿Son los cuentos seguros para los niños?', a3: 'Cada cuento es cálido, suave y termina tranquilamente. Sin elementos aterradores, villanos ni pesadillas.',
    q4: '¿Puedo cancelar en cualquier momento?', a4: 'Sí, al instante. Sin correos, sin llamadas, sin culpa. Cancela con un clic.',
    q5: '¿Para qué edades es esto?', a5: 'Edades 2–10. Los cuentos se adaptan automáticamente — lenguaje más simple para los pequeños, vocabulario más rico para los mayores.',
    q6: '¿Puedo usarlo en mi idioma?', a6: '¡Sí! Dreamlit admite 60+ idiomas: estonio, finlandés, ruso, español, francés, alemán, chino, japonés, árabe y muchos más.',
    ctaTitle: 'La hora de dormir no tiene que ser una batalla', ctaSubtitle: 'Esta noche podría ser la noche en que pidan irse a la cama. De verdad.',
    ctaBtn: 'Crea su primer cuento — es gratis', ctaNote: 'Toma 30 segundos. No se requiere tarjeta de crédito.',
    footerTagline: 'Haciendo mágica la hora de dormir, un cuento a la vez.', footerCopyright: '© 2026 Dreamlit.ee. Todos los derechos reservados.',
  },
};

// Shorter fallbacks for remaining languages (use EN as base, override key strings)
const makeT = (overrides: Partial<LandingT>): LandingT => ({ ...T['en'], ...overrides });

T['lv'] = makeT({ signIn: 'Pieteikties', tryFree: 'Izmēģini šovakar', heroBadge: 'Gulētiešanas laiks, no jauna izdomāts', heroTitle: 'Šovakar tavs bērns ir', heroHero: 'varonis', heroCta: 'Izveidot pirmo stāstu bez maksas', heroNoCc: 'Bez kartes. Bez saistībām. Tikai maģija.', heroLovedBy: 'Vecāku mīļākais', startFree: 'Sākt bez maksas', startTrial: 'Sākt 7 dienu bezmaksas izmēģinājumu', mostPopular: 'Populārākais', proTrial: '7 dienas bezmaksas — atcelt jebkurā laikā', faqTitle: 'Vecāku jautājumi', ctaTitle: 'Gulētiešanai nav jābūt cīņai', ctaBtn: 'Izveidot pirmo stāstu — bez maksas', footerTagline: 'Padarām gulētiešanas laiku maģisku, vienu stāstu vienlaikus.', footerCopyright: '© 2026 Dreamlit.ee. Visas tiesības aizsargātas.' });
T['lt'] = makeT({ signIn: 'Prisijungti', tryFree: 'Išbandyti šį vakarą', heroBadge: 'Miegas, iš naujo erdamas', heroTitle: 'Šį vakarą tavo vaikas yra', heroHero: 'didvyris', heroCta: 'Sukurti pirmą istoriją nemokamai', heroNoCc: 'Be kortelės. Be įsipareigojimų. Tik magija.', heroLovedBy: 'Tėvų mėgstamiausia', startFree: 'Pradėti nemokamai', startTrial: 'Pradėti 7 dienų nemokamą bandymą', mostPopular: 'Populiariausias', proTrial: '7 dienos nemokamai — atšaukti bet kada', faqTitle: 'Tėvų klausimai', ctaTitle: 'Miegas neturi būti kova', ctaBtn: 'Sukurti pirmą istoriją — nemokamai', footerTagline: 'Darome miegą stebuklingu, po vieną istoriją.', footerCopyright: '© 2026 Dreamlit.ee. Visos teisės saugomos.' });
T['it'] = makeT({ signIn: 'Accedi', tryFree: 'Prova gratis stasera', heroBadge: 'L\'ora di dormire, reinventata', heroTitle: 'Stanotte tuo figlio è l\'', heroHero: 'eroe', heroCta: 'Crea la prima storia gratis', heroNoCc: 'Senza carta. Senza impegni. Solo magia.', heroLovedBy: 'Amato dai genitori', startFree: 'Inizia gratis', startTrial: 'Inizia la prova gratuita di 7 giorni', mostPopular: 'Il più popolare', proTrial: '7 giorni gratis — annulla quando vuoi', faqTitle: 'Domande dei genitori', ctaTitle: 'L\'ora di dormire non deve essere una battaglia', ctaBtn: 'Crea la prima storia — è gratis', footerTagline: 'Rendiamo l\'ora di dormire magica, una storia alla volta.', footerCopyright: '© 2026 Dreamlit.ee. Tutti i diritti riservati.' });
T['pl'] = makeT({ signIn: 'Zaloguj się', tryFree: 'Wypróbuj dziś wieczór', heroBadge: 'Czas spania, na nowo', heroTitle: 'Dziś wieczór twoje dziecko jest', heroHero: 'bohaterem', heroCta: 'Stwórz pierwszą historię za darmo', heroNoCc: 'Bez karty. Bez zobowiązań. Tylko magia.', heroLovedBy: 'Ulubione przez rodziców', startFree: 'Zacznij za darmo', startTrial: 'Rozpocznij 7-dniowy bezpłatny okres', mostPopular: 'Najpopularniejszy', proTrial: '7 dni bezpłatnie — anuluj w dowolnym momencie', faqTitle: 'Pytania rodziców', ctaTitle: 'Pora spania nie musi być bitwą', ctaBtn: 'Stwórz pierwszą historię — to jest bezpłatne', footerTagline: 'Sprawiamy, że czas spania jest magiczny, jedną historię na raz.', footerCopyright: '© 2026 Dreamlit.ee. Wszelkie prawa zastrzeżone.' });
T['nl'] = makeT({ signIn: 'Inloggen', tryFree: 'Vanavond gratis proberen', heroBadge: 'Bedtijd, opnieuw uitgevonden', heroTitle: 'Vanavond is jouw kind de', heroHero: 'held', heroCta: 'Maak hun eerste verhaal gratis', heroNoCc: 'Geen kaart. Geen verplichtingen. Alleen magie.', heroLovedBy: 'Geliefd bij ouders', startFree: 'Gratis starten', startTrial: 'Start 7 dagen gratis', mostPopular: 'Meest populair', proTrial: '7 dagen gratis — altijd opzegbaar', faqTitle: 'Vragen van ouders', ctaTitle: 'Bedtijd hoeft geen gevecht te zijn', ctaBtn: 'Maak hun eerste verhaal — het is gratis', footerTagline: 'Bedtijd magisch maken, één verhaal tegelijk.', footerCopyright: '© 2026 Dreamlit.ee. Alle rechten voorbehouden.' });
T['sv'] = makeT({ signIn: 'Logga in', tryFree: 'Prova gratis ikväll', heroBadge: 'Läggdags, omtänkt', heroTitle: 'Ikväll är ditt barn', heroHero: 'hjälten', heroCta: 'Skapa deras första berättelse gratis', heroNoCc: 'Inget kort. Inga åtaganden. Bara magi.', heroLovedBy: 'Älskat av föräldrar', startFree: 'Börja gratis', startTrial: 'Starta 7 dagars gratis provperiod', mostPopular: 'Mest populär', proTrial: '7 dagar gratis — avsluta när som helst', faqTitle: 'Frågor från föräldrar', ctaTitle: 'Läggdags behöver inte vara en strid', ctaBtn: 'Skapa deras första berättelse — det är gratis', footerTagline: 'Gör läggdags magisk, en berättelse i taget.', footerCopyright: '© 2026 Dreamlit.ee. Alla rättigheter förbehållna.' });
T['no'] = makeT({ signIn: 'Logg inn', tryFree: 'Prøv gratis i kveld', heroBadge: 'Leggetid, nytenkt', heroTitle: 'I kveld er barnet ditt', heroHero: 'helten', heroCta: 'Lag deres første historie gratis', heroNoCc: 'Ingen kort. Ingen forpliktelser. Bare magi.', heroLovedBy: 'Elsket av foreldre', startFree: 'Start gratis', startTrial: 'Start 7 dagers gratis prøveperiode', mostPopular: 'Mest populær', proTrial: '7 dager gratis — avbryt når som helst', faqTitle: 'Spørsmål fra foreldre', ctaTitle: 'Leggetid trenger ikke å være en kamp', ctaBtn: 'Lag deres første historie — det er gratis', footerTagline: 'Gjør leggetid magisk, én historie om gangen.', footerCopyright: '© 2026 Dreamlit.ee. Alle rettigheter forbeholdt.' });
T['pt'] = makeT({ signIn: 'Entrar', tryFree: 'Experimente grátis esta noite', heroBadge: 'Hora de dormir, reinventada', heroTitle: 'Esta noite, seu filho é o', heroHero: 'herói', heroCta: 'Crie a primeira história de graça', heroNoCc: 'Sem cartão. Sem compromisso. Só magia.', heroLovedBy: 'Amado pelos pais', startFree: 'Começar grátis', startTrial: 'Iniciar teste gratuito de 7 dias', mostPopular: 'Mais popular', proTrial: '7 dias grátis — cancele quando quiser', faqTitle: 'Perguntas dos pais', ctaTitle: 'A hora de dormir não precisa ser uma batalha', ctaBtn: 'Crie a primeira história — é grátis', footerTagline: 'Tornando a hora de dormir mágica, uma história de cada vez.', footerCopyright: '© 2026 Dreamlit.ee. Todos os direitos reservados.' });

const SUPPORTED = ['en','et','ru','de','fi','fr','es','lv','lt','it','pl','nl','sv','no','pt'];

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private _lang = signal(this._detect());

  get lang() { return this._lang(); }
  get translations(): LandingT { return T[this._lang()] ?? T['en']; }
  get supported() { return SUPPORTED; }

  set(lang: string) { if (SUPPORTED.includes(lang)) this._lang.set(lang); }

  private _detect(): string {
    try {
      const l = (navigator.language || 'en').split('-')[0].toLowerCase();
      return SUPPORTED.includes(l) ? l : 'en';
    } catch { return 'en'; }
  }
}
