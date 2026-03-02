// 15 explicitly-defined quizzes: 5 per level (A1, A2, B1).
// First 3 per level are free; last 2 are premium.
export const QUIZZES = {
  A1: [
    // ── FREE ────────────────────────────────────────────────────────────────
    {
      id: 'a1-1',
      name: 'Quiz 1',
      premium: false,
      questions: [
        {
          question: 'How do you say "Good morning" in German?',
          correct: 'Guten Morgen',
          options: ['Guten Morgen', 'Guten Abend', 'Gute Nacht', 'Guten Tag'],
        },
        {
          question: 'What does "Wie geht es Ihnen?" mean?',
          correct: 'How are you? (formal)',
          options: ['Where are you from?', 'What is your name?', 'How are you? (formal)', 'How old are you?'],
        },
        {
          question: 'How do you introduce yourself with "My name is..."?',
          correct: 'Ich heiße ...',
          options: ['Ich bin ...', 'Ich heiße ...', 'Ich komme aus ...', 'Ich wohne in ...'],
        },
        {
          question: 'What is the formal "you" in German?',
          correct: 'Sie',
          options: ['du', 'ihr', 'Sie', 'man'],
        },
        {
          question: 'How do you say "Please" in German?',
          correct: 'Bitte',
          options: ['Danke', 'Bitte', 'Tschüss', 'Entschuldigung'],
        },
        {
          question: 'What does "Danke schön" mean?',
          correct: 'Thank you very much',
          options: ['You are welcome', 'Thank you very much', 'Good day', 'See you soon'],
        },
        {
          question: 'How do you say "Goodbye" formally?',
          correct: 'Auf Wiedersehen',
          options: ['Tschüss', 'Ciao', 'Auf Wiedersehen', 'Gute Nacht'],
        },
        {
          question: 'What does "Entschuldigung" mean?',
          correct: 'Excuse me / Sorry',
          options: ['Please', 'Thank you', 'Excuse me / Sorry', 'Good luck'],
        },
        {
          question: 'How do you say "Yes" in German?',
          correct: 'Ja',
          options: ['Nein', 'Ja', 'Vielleicht', 'Natürlich'],
        },
        {
          question: 'What does "Nein" mean?',
          correct: 'No',
          options: ['Yes', 'No', 'Maybe', 'Never'],
        },
        {
          question: 'How do you say "Good evening"?',
          correct: 'Guten Abend',
          options: ['Guten Morgen', 'Guten Tag', 'Guten Abend', 'Gute Nacht'],
        },
        {
          question: 'What does "Ich verstehe nicht" mean?',
          correct: 'I don\'t understand',
          options: ['I don\'t know', 'I don\'t understand', 'I can\'t hear', 'I don\'t speak German'],
        },
        {
          question: 'How do you say "Where are you from?" informally?',
          correct: 'Woher kommst du?',
          options: ['Wo wohnst du?', 'Wie heißt du?', 'Woher kommst du?', 'Wie alt bist du?'],
        },
      ],
    },
    {
      id: 'a1-2',
      name: 'Quiz 2',
      premium: false,
      questions: [
        {
          question: 'What is "fünf" in English?',
          correct: '5',
          options: ['4', '5', '6', '7'],
        },
        {
          question: 'How do you say "20" in German?',
          correct: 'zwanzig',
          options: ['dreißig', 'zwanzig', 'vierzig', 'zehn'],
        },
        {
          question: 'What is "Montag"?',
          correct: 'Monday',
          options: ['Sunday', 'Monday', 'Tuesday', 'Wednesday'],
        },
        {
          question: 'How do you ask "What time is it?"',
          correct: 'Wie spät ist es?',
          options: ['Was ist die Zeit?', 'Wie spät ist es?', 'Wann ist es?', 'Um wie viel Uhr?'],
        },
        {
          question: 'What does "halb drei" mean?',
          correct: '2:30',
          options: ['3:30', '2:30', '3:00', '2:15'],
        },
        {
          question: 'How do you say "100" in German?',
          correct: 'hundert',
          options: ['tausend', 'hundert', 'millionen', 'zwanzig'],
        },
        {
          question: 'What is "Mittwoch"?',
          correct: 'Wednesday',
          options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        },
        {
          question: 'How do you say "15" in German?',
          correct: 'fünfzehn',
          options: ['fünfzig', 'fünfzehn', 'fünf', 'fünfhundert'],
        },
        {
          question: 'What does "Viertel nach vier" mean?',
          correct: '4:15',
          options: ['4:30', '4:45', '4:15', '3:45'],
        },
        {
          question: 'How do you say "tomorrow" in German?',
          correct: 'morgen',
          options: ['heute', 'gestern', 'morgen', 'übermorgen'],
        },
        {
          question: 'What is "Freitag"?',
          correct: 'Friday',
          options: ['Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
        {
          question: 'How do you say "1000" in German?',
          correct: 'tausend',
          options: ['hundert', 'tausend', 'million', 'zehntausend'],
        },
        {
          question: 'What does "übermorgen" mean?',
          correct: 'the day after tomorrow',
          options: ['yesterday', 'tomorrow', 'the day after tomorrow', 'next week'],
        },
      ],
    },
    {
      id: 'a1-3',
      name: 'Quiz 3',
      premium: false,
      questions: [
        {
          question: 'What does "die Mutter" mean?',
          correct: 'mother',
          options: ['father', 'sister', 'mother', 'grandmother'],
        },
        {
          question: 'How do you say "brother" in German?',
          correct: 'der Bruder',
          options: ['die Schwester', 'der Vater', 'der Bruder', 'der Sohn'],
        },
        {
          question: 'What is "das Kind"?',
          correct: 'the child',
          options: ['the baby', 'the child', 'the teenager', 'the student'],
        },
        {
          question: 'How do you say "grandparents" in German?',
          correct: 'die Großeltern',
          options: ['die Großmutter', 'die Eltern', 'die Großeltern', 'die Geschwister'],
        },
        {
          question: 'What does "der Ehemann" mean?',
          correct: 'husband',
          options: ['boyfriend', 'brother', 'husband', 'father'],
        },
        {
          question: 'How do you say "wife" in German?',
          correct: 'die Ehefrau',
          options: ['die Freundin', 'die Ehefrau', 'die Schwester', 'die Tochter'],
        },
        {
          question: 'What is "die Tochter"?',
          correct: 'the daughter',
          options: ['the son', 'the sister', 'the daughter', 'the niece'],
        },
        {
          question: 'How do you say "uncle" in German?',
          correct: 'der Onkel',
          options: ['der Cousin', 'der Onkel', 'der Neffe', 'der Opa'],
        },
        {
          question: 'What does "die Nichte" mean?',
          correct: 'niece',
          options: ['aunt', 'cousin', 'niece', 'granddaughter'],
        },
        {
          question: 'How do you say "I have two siblings"?',
          correct: 'Ich habe zwei Geschwister',
          options: ['Ich habe zwei Kinder', 'Ich habe zwei Geschwister', 'Ich habe zwei Freunde', 'Ich habe zwei Eltern'],
        },
        {
          question: 'What does "der Enkel" mean?',
          correct: 'grandson',
          options: ['grandfather', 'uncle', 'grandson', 'nephew'],
        },
        {
          question: 'How do you say "parents" in German?',
          correct: 'die Eltern',
          options: ['die Geschwister', 'die Eltern', 'die Großeltern', 'die Verwandten'],
        },
        {
          question: 'What does "die Schwiegermutter" mean?',
          correct: 'mother-in-law',
          options: ['stepmother', 'godmother', 'mother-in-law', 'grandmother'],
        },
      ],
    },
    // ── PREMIUM ─────────────────────────────────────────────────────────────
    {
      id: 'a1-4',
      name: 'Quiz 4',
      premium: true,
      questions: [
        {
          question: 'How do you say "blue" in German?',
          correct: 'blau',
          options: ['gelb', 'blau', 'grün', 'rot'],
        },
        {
          question: 'What color is "gelb"?',
          correct: 'yellow',
          options: ['green', 'orange', 'yellow', 'gold'],
        },
        {
          question: 'How do you say "big" in German?',
          correct: 'groß',
          options: ['klein', 'groß', 'lang', 'breit'],
        },
        {
          question: 'What does "klein" mean?',
          correct: 'small',
          options: ['short', 'thin', 'small', 'young'],
        },
        {
          question: 'How do you say "beautiful" in German?',
          correct: 'schön',
          options: ['hässlich', 'schön', 'gut', 'toll'],
        },
        {
          question: 'What does "alt" mean?',
          correct: 'old',
          options: ['new', 'young', 'old', 'ancient'],
        },
        {
          question: 'How do you say "new" in German?',
          correct: 'neu',
          options: ['alt', 'frisch', 'neu', 'modern'],
        },
        {
          question: 'What does "weiß" mean?',
          correct: 'white',
          options: ['black', 'grey', 'white', 'silver'],
        },
        {
          question: 'How do you say "black" in German?',
          correct: 'schwarz',
          options: ['dunkel', 'braun', 'grau', 'schwarz'],
        },
        {
          question: 'What does "schnell" mean?',
          correct: 'fast / quick',
          options: ['slow', 'fast / quick', 'loud', 'quiet'],
        },
        {
          question: 'How do you say "expensive" in German?',
          correct: 'teuer',
          options: ['billig', 'teuer', 'günstig', 'kostspielig'],
        },
        {
          question: 'What does "billig" mean?',
          correct: 'cheap',
          options: ['expensive', 'cheap', 'free', 'on sale'],
        },
        {
          question: 'How do you say "green" in German?',
          correct: 'grün',
          options: ['blau', 'grün', 'gelb', 'lila'],
        },
      ],
    },
    {
      id: 'a1-5',
      name: 'Quiz 5',
      premium: true,
      questions: [
        {
          question: 'What does "das Brot" mean?',
          correct: 'bread',
          options: ['cake', 'bread', 'roll', 'biscuit'],
        },
        {
          question: 'How do you say "water" in German?',
          correct: 'das Wasser',
          options: ['der Saft', 'die Milch', 'das Wasser', 'der Tee'],
        },
        {
          question: 'What is "das Fleisch"?',
          correct: 'meat',
          options: ['fish', 'meat', 'cheese', 'egg'],
        },
        {
          question: 'How do you say "I\'m hungry" in German?',
          correct: 'Ich habe Hunger',
          options: ['Ich bin satt', 'Ich habe Durst', 'Ich habe Hunger', 'Ich esse gern'],
        },
        {
          question: 'What does "das Frühstück" mean?',
          correct: 'breakfast',
          options: ['lunch', 'breakfast', 'dinner', 'snack'],
        },
        {
          question: 'How do you say "coffee" in German?',
          correct: 'der Kaffee',
          options: ['der Tee', 'der Kaffee', 'die Milch', 'der Kakao'],
        },
        {
          question: 'What does "das Abendessen" mean?',
          correct: 'dinner',
          options: ['breakfast', 'lunch', 'dinner', 'supper'],
        },
        {
          question: 'How do you say "I would like a beer"?',
          correct: 'Ich möchte ein Bier',
          options: ['Ich trinke ein Bier', 'Ich möchte ein Bier', 'Gib mir ein Bier', 'Ich kaufe ein Bier'],
        },
        {
          question: 'What is "das Gemüse"?',
          correct: 'vegetables',
          options: ['fruit', 'vegetables', 'salad', 'herbs'],
        },
        {
          question: 'How do you say "cheese" in German?',
          correct: 'der Käse',
          options: ['die Butter', 'der Käse', 'das Ei', 'die Wurst'],
        },
        {
          question: 'What does "das Obst" mean?',
          correct: 'fruit',
          options: ['vegetables', 'nuts', 'fruit', 'berries'],
        },
        {
          question: 'How do you say "delicious" in German?',
          correct: 'lecker',
          options: ['süß', 'scharf', 'lecker', 'salzig'],
        },
        {
          question: 'What does "Die Rechnung, bitte!" mean?',
          correct: 'The bill, please!',
          options: ['The menu, please!', 'The bill, please!', 'More water, please!', 'One more, please!'],
        },
      ],
    },
  ],

  A2: [
    // ── FREE ────────────────────────────────────────────────────────────────
    {
      id: 'a2-1',
      name: 'Quiz 1',
      premium: false,
      questions: [
        {
          question: 'How do you say "to wake up" in German?',
          correct: 'aufwachen',
          options: ['aufstehen', 'aufwachen', 'einschlafen', 'schlafen'],
        },
        {
          question: 'What does "sich duschen" mean?',
          correct: 'to shower',
          options: ['to wash up', 'to bathe', 'to shower', 'to dry off'],
        },
        {
          question: 'How do you say "I take the bus to work"?',
          correct: 'Ich fahre mit dem Bus zur Arbeit',
          options: [
            'Ich gehe zu Fuß zur Arbeit',
            'Ich fahre mit dem Bus zur Arbeit',
            'Ich fahre mit dem Auto zur Arbeit',
            'Ich nehme die U-Bahn',
          ],
        },
        {
          question: 'What does "frühstücken" mean?',
          correct: 'to eat breakfast',
          options: ['to eat lunch', 'to cook', 'to eat breakfast', 'to go grocery shopping'],
        },
        {
          question: 'How do you say "to go to bed" in German?',
          correct: 'ins Bett gehen',
          options: ['schlafen legen', 'ins Bett gehen', 'sich hinlegen', 'ruhen gehen'],
        },
        {
          question: 'What does "aufräumen" mean?',
          correct: 'to tidy up',
          options: ['to clean the windows', 'to tidy up', 'to mop the floor', 'to do laundry'],
        },
        {
          question: 'How do you say "to cook" in German?',
          correct: 'kochen',
          options: ['backen', 'braten', 'kochen', 'grillen'],
        },
        {
          question: 'What does "sich beeilen" mean?',
          correct: 'to hurry',
          options: ['to wait', 'to hurry', 'to rest', 'to slow down'],
        },
        {
          question: 'How do you say "to go shopping" in German?',
          correct: 'einkaufen gehen',
          options: ['shoppen gehen', 'einkaufen gehen', 'kaufen gehen', 'Markt gehen'],
        },
        {
          question: 'What does "fernsehen" mean?',
          correct: 'to watch TV',
          options: ['to read', 'to listen to music', 'to watch TV', 'to play games'],
        },
        {
          question: 'How do you say "I get up at 7 o\'clock"?',
          correct: 'Ich stehe um 7 Uhr auf',
          options: ['Ich wache um 7 Uhr auf', 'Ich stehe um 7 Uhr auf', 'Ich bin um 7 Uhr auf', 'Um 7 Uhr stehe ich'],
        },
        {
          question: 'What does "entspannen" mean?',
          correct: 'to relax',
          options: ['to exercise', 'to relax', 'to rest', 'to sleep'],
        },
        {
          question: 'How do you say "to brush teeth" in German?',
          correct: 'Zähne putzen',
          options: ['Zähne waschen', 'Mund spülen', 'Zähne putzen', 'Zähne pflegen'],
        },
      ],
    },
    {
      id: 'a2-2',
      name: 'Quiz 2',
      premium: false,
      questions: [
        {
          question: 'What does "der Bahnhof" mean?',
          correct: 'train station',
          options: ['airport', 'bus stop', 'train station', 'subway'],
        },
        {
          question: 'How do you say "I need a ticket to Berlin"?',
          correct: 'Ich brauche eine Fahrkarte nach Berlin',
          options: [
            'Ich will nach Berlin fahren',
            'Ich brauche eine Fahrkarte nach Berlin',
            'Geben Sie mir ein Ticket nach Berlin',
            'Ich reise nach Berlin',
          ],
        },
        {
          question: 'What is "das Flugzeug"?',
          correct: 'airplane',
          options: ['helicopter', 'airplane', 'rocket', 'glider'],
        },
        {
          question: 'How do you ask "Where is the next bus stop?"',
          correct: 'Wo ist die nächste Bushaltestelle?',
          options: [
            'Wo fährt der Bus ab?',
            'Wann kommt der Bus?',
            'Wo ist die nächste Bushaltestelle?',
            'Wie lange dauert die Fahrt?',
          ],
        },
        {
          question: 'What does "der Reisepass" mean?',
          correct: 'passport',
          options: ['boarding pass', 'train ticket', 'passport', 'ID card'],
        },
        {
          question: 'How do you say "single ticket" in German?',
          correct: 'einfache Fahrt',
          options: ['Einzelticket', 'einfache Fahrt', 'Gruppenfahrkarte', 'Tageskarte'],
        },
        {
          question: 'What does "die Abfahrt" mean?',
          correct: 'departure',
          options: ['arrival', 'departure', 'delay', 'platform'],
        },
        {
          question: 'How do you say "to book a hotel room"?',
          correct: 'ein Hotelzimmer buchen',
          options: ['ein Hotel suchen', 'ein Hotelzimmer buchen', 'im Hotel übernachten', 'ein Hotel reservieren'],
        },
        {
          question: 'What does "der Zug" mean?',
          correct: 'train',
          options: ['bus', 'tram', 'train', 'subway'],
        },
        {
          question: 'How do you say "round trip" in German?',
          correct: 'Hin- und Rückfahrt',
          options: ['einfache Fahrt', 'Hin- und Rückfahrt', 'Tagesticket', 'Wochenfahrkarte'],
        },
        {
          question: 'What does "die Ankunft" mean?',
          correct: 'arrival',
          options: ['departure', 'arrival', 'platform', 'connection'],
        },
        {
          question: 'How do you say "to miss the train"?',
          correct: 'den Zug verpassen',
          options: ['den Zug verlieren', 'den Zug verpassen', 'den Zug vergessen', 'den Zug nehmen'],
        },
        {
          question: 'What does "das Gepäck" mean?',
          correct: 'luggage',
          options: ['suitcase', 'backpack', 'luggage', 'bag'],
        },
      ],
    },
    {
      id: 'a2-3',
      name: 'Quiz 3',
      premium: false,
      questions: [
        {
          question: 'How do you say "How much does this cost?"',
          correct: 'Was kostet das?',
          options: ['Was ist der Preis?', 'Was kostet das?', 'Wie teuer ist das?', 'Was bezahle ich?'],
        },
        {
          question: 'What does "das Sonderangebot" mean?',
          correct: 'special offer',
          options: ['standard price', 'special offer', 'new arrival', 'clearance'],
        },
        {
          question: 'How do you say "I\'ll take it"?',
          correct: 'Ich nehme es',
          options: ['Das gefällt mir', 'Ich will das', 'Ich nehme es', 'Das kaufe ich'],
        },
        {
          question: 'What does "die Kreditkarte" mean?',
          correct: 'credit card',
          options: ['debit card', 'credit card', 'gift card', 'membership card'],
        },
        {
          question: 'How do you say "too expensive" in German?',
          correct: 'zu teuer',
          options: ['sehr teuer', 'zu teuer', 'zu billig', 'nicht günstig'],
        },
        {
          question: 'What does "der Rabatt" mean?',
          correct: 'discount',
          options: ['tax', 'discount', 'surcharge', 'tip'],
        },
        {
          question: 'How do you ask "Can I pay by card?"',
          correct: 'Kann ich mit Karte bezahlen?',
          options: [
            'Akzeptieren Sie Kreditkarten?',
            'Kann ich mit Karte bezahlen?',
            'Haben Sie ein Kartenlesegerät?',
            'Ich zahle mit Karte',
          ],
        },
        {
          question: 'What does "die Quittung" mean?',
          correct: 'receipt',
          options: ['bill', 'receipt', 'invoice', 'voucher'],
        },
        {
          question: 'How do you say "I\'m looking for a blue jacket"?',
          correct: 'Ich suche eine blaue Jacke',
          options: ['Ich brauche eine blaue Jacke', 'Ich suche eine blaue Jacke', 'Ich kaufe eine blaue Jacke', 'Ich mag blaue Jacken'],
        },
        {
          question: 'What does "die Umkleidekabine" mean?',
          correct: 'fitting room',
          options: ['checkout', 'fitting room', 'stockroom', 'customer service'],
        },
        {
          question: 'How do you ask "Do you have this in size M?"',
          correct: 'Haben Sie das in Größe M?',
          options: [
            'Gibt es das in Größe M?',
            'Haben Sie das in Größe M?',
            'Ist das in Größe M verfügbar?',
            'Kann ich das in Größe M haben?',
          ],
        },
        {
          question: 'What does "ausverkauft" mean?',
          correct: 'sold out',
          options: ['on sale', 'sold out', 'reserved', 'unavailable'],
        },
        {
          question: 'How do you say "I\'d like to return this"?',
          correct: 'Ich möchte das zurückgeben',
          options: [
            'Ich möchte das umtauschen',
            'Ich möchte das zurückgeben',
            'Das passt mir nicht',
            'Ich brauche das nicht',
          ],
        },
      ],
    },
    // ── PREMIUM ─────────────────────────────────────────────────────────────
    {
      id: 'a2-4',
      name: 'Quiz 4',
      premium: true,
      questions: [
        {
          question: 'What does "der Arzt / die Ärztin" mean?',
          correct: 'doctor',
          options: ['nurse', 'pharmacist', 'doctor', 'surgeon'],
        },
        {
          question: 'How do you say "I work as a teacher"?',
          correct: 'Ich arbeite als Lehrer/in',
          options: ['Ich bin Lehrer/in', 'Ich arbeite als Lehrer/in', 'Ich lehre', 'Mein Beruf ist Lehrer/in'],
        },
        {
          question: 'What does "der Kollege" mean?',
          correct: 'colleague (male)',
          options: ['boss', 'employee', 'colleague (male)', 'assistant'],
        },
        {
          question: 'How do you say "part-time job" in German?',
          correct: 'Teilzeitjob',
          options: ['Vollzeitjob', 'Nebenjob', 'Teilzeitjob', 'Minijob'],
        },
        {
          question: 'What does "das Gehalt" mean?',
          correct: 'salary',
          options: ['bonus', 'salary', 'commission', 'wages'],
        },
        {
          question: 'How do you say "to be unemployed" in German?',
          correct: 'arbeitslos sein',
          options: ['joblos sein', 'arbeitslos sein', 'ohne Arbeit sein', 'freigestellt sein'],
        },
        {
          question: 'What does "die Bewerbung" mean?',
          correct: 'job application',
          options: ['job offer', 'job application', 'job interview', 'recommendation letter'],
        },
        {
          question: 'How do you say "overtime" in German?',
          correct: 'Überstunden',
          options: ['Extrazeit', 'Mehrarbeit', 'Überstunden', 'Zusatzstunden'],
        },
        {
          question: 'What does "die Besprechung" mean?',
          correct: 'meeting',
          options: ['conversation', 'presentation', 'meeting', 'conference'],
        },
        {
          question: 'How do you say "to resign / quit job"?',
          correct: 'kündigen',
          options: ['entlassen werden', 'kündigen', 'aufhören', 'pensionieren'],
        },
        {
          question: 'What does "der Urlaub" mean?',
          correct: 'vacation',
          options: ['sick leave', 'weekend', 'vacation', 'break'],
        },
        {
          question: 'How do you say "I have a meeting at 3 PM"?',
          correct: 'Ich habe um 15 Uhr eine Besprechung',
          options: [
            'Ich treffe mich um 15 Uhr',
            'Um 15 Uhr habe ich frei',
            'Ich habe um 15 Uhr eine Besprechung',
            'Um 3 Uhr bin ich beschäftigt',
          ],
        },
        {
          question: 'What does "die Ausbildung" mean?',
          correct: 'vocational training',
          options: ['university degree', 'secondary school', 'vocational training', 'internship'],
        },
      ],
    },
    {
      id: 'a2-5',
      name: 'Quiz 5',
      premium: true,
      questions: [
        {
          question: 'What does "der Kopf" mean?',
          correct: 'head',
          options: ['arm', 'leg', 'head', 'back'],
        },
        {
          question: 'How do you say "I have a headache"?',
          correct: 'Ich habe Kopfschmerzen',
          options: ['Mein Kopf tut weh', 'Ich habe Kopfschmerzen', 'Ich habe Schmerzen', 'Mir ist schwindelig'],
        },
        {
          question: 'What does "der Arzttermin" mean?',
          correct: 'doctor\'s appointment',
          options: ['prescription', 'check-up', 'doctor\'s appointment', 'medical report'],
        },
        {
          question: 'How do you say "to be sick" in German?',
          correct: 'krank sein',
          options: ['nicht gesund sein', 'krank sein', 'unwohl sein', 'Fieber haben'],
        },
        {
          question: 'What does "das Rezept" mean?',
          correct: 'prescription / recipe',
          options: ['medication', 'diagnosis', 'prescription / recipe', 'treatment'],
        },
        {
          question: 'How do you say "I have a fever"?',
          correct: 'Ich habe Fieber',
          options: ['Ich bin krank', 'Ich friere', 'Ich habe Fieber', 'Mir ist heiß'],
        },
        {
          question: 'What does "die Apotheke" mean?',
          correct: 'pharmacy',
          options: ['hospital', 'doctor\'s office', 'pharmacy', 'clinic'],
        },
        {
          question: 'How do you say "to take medication" in German?',
          correct: 'Medikamente nehmen',
          options: ['Tabletten schlucken', 'Medikamente nehmen', 'Pillen einnehmen', 'Mittel nehmen'],
        },
        {
          question: 'What does "der Husten" mean?',
          correct: 'cough',
          options: ['cold', 'fever', 'cough', 'sore throat'],
        },
        {
          question: 'How do you say "I need to see a doctor"?',
          correct: 'Ich muss zum Arzt gehen',
          options: ['Ich brauche einen Arzt', 'Ich muss zum Arzt gehen', 'Ich sollte einen Arzt besuchen', 'Ruf den Arzt an'],
        },
        {
          question: 'What does "die Allergie" mean?',
          correct: 'allergy',
          options: ['intolerance', 'allergy', 'sensitivity', 'reaction'],
        },
        {
          question: 'How do you ask "Where does it hurt?"',
          correct: 'Wo tut es weh?',
          options: ['Was schmerzt?', 'Haben Sie Schmerzen?', 'Wo tut es weh?', 'Was ist passiert?'],
        },
        {
          question: 'What does "die Krankenversicherung" mean?',
          correct: 'health insurance',
          options: ['life insurance', 'health insurance', 'accident insurance', 'disability insurance'],
        },
      ],
    },
  ],

  B1: [
    // ── FREE ────────────────────────────────────────────────────────────────
    {
      id: 'b1-1',
      name: 'Quiz 1',
      premium: false,
      questions: [
        {
          question: 'Which case follows the preposition "mit"?',
          correct: 'Dative',
          options: ['Nominative', 'Accusative', 'Dative', 'Genitive'],
        },
        {
          question: 'What grammatical case is used for the direct object?',
          correct: 'Accusative',
          options: ['Nominative', 'Accusative', 'Dative', 'Genitive'],
        },
        {
          question: 'What does "der" become in the accusative case (masculine)?',
          correct: 'den',
          options: ['dem', 'den', 'des', 'der'],
        },
        {
          question: 'What does the article "des" indicate?',
          correct: 'Genitive case (masculine/neuter)',
          options: [
            'Dative case (feminine)',
            'Accusative case (masculine)',
            'Genitive case (masculine/neuter)',
            'Nominative case (neuter)',
          ],
        },
        {
          question: 'Which case follows the preposition "wegen" (because of)?',
          correct: 'Genitive',
          options: ['Nominative', 'Accusative', 'Dative', 'Genitive'],
        },
        {
          question: 'What is the dative form of the feminine article "die"?',
          correct: 'der',
          options: ['die', 'den', 'dem', 'der'],
        },
        {
          question: 'Which case answers the question "Wessen?" (Whose)?',
          correct: 'Genitive',
          options: ['Nominative', 'Accusative', 'Dative', 'Genitive'],
        },
        {
          question: 'What does the contraction "im" stand for?',
          correct: 'in dem (dative)',
          options: ['in das (accusative)', 'in dem (dative)', 'in die (accusative)', 'in den (dative)'],
        },
        {
          question: 'Which case is used after "in" when expressing location (Wo?)?',
          correct: 'Dative',
          options: ['Nominative', 'Accusative', 'Dative', 'Genitive'],
        },
        {
          question: 'What is the genitive of the masculine article "der"?',
          correct: 'des',
          options: ['dem', 'den', 'des', 'der'],
        },
        {
          question: 'Which preposition always takes the accusative case?',
          correct: 'durch (through)',
          options: ['mit (with)', 'seit (since)', 'durch (through)', 'von (from)'],
        },
        {
          question: 'What does "ans" stand for?',
          correct: 'an das (accusative)',
          options: ['an dem (dative)', 'an das (accusative)', 'an den (dative)', 'an die (accusative)'],
        },
        {
          question: 'Which case is used after "in" when expressing direction (Wohin?)?',
          correct: 'Accusative',
          options: ['Nominative', 'Accusative', 'Dative', 'Genitive'],
        },
      ],
    },
    {
      id: 'b1-2',
      name: 'Quiz 2',
      premium: false,
      questions: [
        {
          question: 'What does "Das ist mir Wurst" mean?',
          correct: 'I don\'t care',
          options: ['I love sausage', 'I don\'t care', 'That\'s strange', 'No problem'],
        },
        {
          question: 'What does "Ich drücke die Daumen" mean?',
          correct: 'I\'m keeping my fingers crossed',
          options: ['I\'m pressing my thumbs down', 'I\'m keeping my fingers crossed', 'I\'m clapping for you', 'I\'m pointing at you'],
        },
        {
          question: 'What does "auf dem Holzweg sein" mean?',
          correct: 'to be on the wrong track',
          options: ['to be lost in the woods', 'to be on the wrong track', 'to go hiking', 'to take a detour'],
        },
        {
          question: 'What does "Hals- und Beinbruch!" mean?',
          correct: 'Good luck! / Break a leg!',
          options: ['Be careful!', 'That\'s terrible!', 'Good luck! / Break a leg!', 'Stay healthy!'],
        },
        {
          question: 'What does "die Nase voll haben" mean?',
          correct: 'to be fed up',
          options: ['to have a cold', 'to be nosy', 'to be fed up', 'to smell something bad'],
        },
        {
          question: 'What does "Das ist nicht mein Bier" mean?',
          correct: 'That\'s not my problem',
          options: ['I don\'t drink beer', 'That\'s not my problem', 'I didn\'t order that', 'That\'s too much'],
        },
        {
          question: 'What does "ins Fettnäpfchen treten" mean?',
          correct: 'to put your foot in your mouth',
          options: ['to step in grease', 'to put your foot in your mouth', 'to make a mess', 'to slip and fall'],
        },
        {
          question: 'How do you say "to sleep on it" in German?',
          correct: 'eine Nacht darüber schlafen',
          options: ['damit schlafen', 'darüber nachdenken', 'eine Nacht darüber schlafen', 'es bis morgen warten'],
        },
        {
          question: 'What does "Es geht mir auf die Nerven" mean?',
          correct: 'It\'s getting on my nerves',
          options: ['It\'s making me nervous', 'It\'s getting on my nerves', 'It surprises me', 'It worries me'],
        },
        {
          question: 'What does "um den heißen Brei reden" mean?',
          correct: 'to beat around the bush',
          options: ['to gossip', 'to complain', 'to beat around the bush', 'to talk too much'],
        },
        {
          question: 'What does "Schmetterlinge im Bauch haben" mean?',
          correct: 'to have butterflies in your stomach',
          options: [
            'to have stomach pain',
            'to feel nervous before a test',
            'to have butterflies in your stomach',
            'to feel nauseous',
          ],
        },
        {
          question: 'What does "jetzt reicht\'s" mean?',
          correct: 'That\'s enough now',
          options: ['Just a moment', 'Now it\'s my turn', 'That\'s enough now', 'Now it starts'],
        },
        {
          question: 'How do you say "to cost an arm and a leg" in German?',
          correct: 'ein Vermögen kosten',
          options: ['sehr teuer sein', 'ein Vermögen kosten', 'viel Geld brauchen', 'unbezahlbar sein'],
        },
      ],
    },
    {
      id: 'b1-3',
      name: 'Quiz 3',
      premium: false,
      questions: [
        {
          question: 'What does "weil" (because) do to word order?',
          correct: 'Sends the verb to the end of the clause',
          options: [
            'No change to word order',
            'Sends the verb to the end of the clause',
            'Inverts subject and verb',
            'Moves the verb to position 2',
          ],
        },
        {
          question: 'What does "obwohl" mean?',
          correct: 'although / even though',
          options: ['because', 'therefore', 'although / even though', 'if'],
        },
        {
          question: 'What does "damit" mean as a conjunction?',
          correct: 'so that / in order that',
          options: ['because of that', 'with it', 'so that / in order that', 'therefore'],
        },
        {
          question: 'What is the key difference between "weil" and "denn" (both mean "because")?',
          correct: '"weil" sends verb to end; "denn" keeps main clause word order',
          options: [
            '"weil" is formal; "denn" is informal',
            '"weil" is written; "denn" is spoken',
            '"weil" sends verb to end; "denn" keeps main clause word order',
            '"weil" is stronger; "denn" is weaker',
          ],
        },
        {
          question: 'How do you say "as soon as" in German?',
          correct: 'sobald',
          options: ['solange', 'sobald', 'seitdem', 'nachdem'],
        },
        {
          question: 'What does "solange" mean?',
          correct: 'as long as',
          options: ['as soon as', 'since then', 'as long as', 'until'],
        },
        {
          question: 'What does "trotzdem" mean?',
          correct: 'nevertheless / despite this',
          options: ['therefore', 'however', 'nevertheless / despite this', 'instead'],
        },
        {
          question: 'How do you introduce an indirect yes/no question in German?',
          correct: 'ob (whether)',
          options: ['was (what)', 'ob (whether)', 'dass (that)', 'wie (how)'],
        },
        {
          question: 'What does "weshalb" mean?',
          correct: 'why / for what reason',
          options: ['therefore', 'although', 'how', 'why / for what reason'],
        },
        {
          question: 'How do you say "instead of" in German (with genitive)?',
          correct: 'statt / anstatt',
          options: ['anstelle', 'statt / anstatt', 'außer', 'ohne'],
        },
        {
          question: 'What word connects two contrasting main clauses meaning "but"?',
          correct: 'aber',
          options: ['doch', 'aber', 'sondern', 'jedoch'],
        },
        {
          question: 'What does "sofern" mean?',
          correct: 'provided that / as long as',
          options: ['as far as', 'even if', 'provided that / as long as', 'unless'],
        },
        {
          question: 'What conjunction is used after a negation meaning "but rather"?',
          correct: 'sondern',
          options: ['aber', 'jedoch', 'sondern', 'denn'],
        },
      ],
    },
    // ── PREMIUM ─────────────────────────────────────────────────────────────
    {
      id: 'b1-4',
      name: 'Quiz 4',
      premium: true,
      questions: [
        {
          question: 'What is Germany\'s official name?',
          correct: 'Bundesrepublik Deutschland',
          options: ['Deutsches Reich', 'Bundesrepublik Deutschland', 'Deutsche Demokratische Republik', 'Deutsches Bundesland'],
        },
        {
          question: 'What does "Karneval / Fasching" celebrate?',
          correct: 'Pre-Lent carnival festivities',
          options: ['Harvest season', 'Pre-Lent carnival festivities', 'New Year', 'Midsummer'],
        },
        {
          question: 'What is "das Oktoberfest"?',
          correct: 'The world\'s largest folk festival, held in Munich',
          options: [
            'A beer brand from Berlin',
            'A German harvest festival',
            'The world\'s largest folk festival, held in Munich',
            'A traditional Bavarian dance competition',
          ],
        },
        {
          question: 'Who wrote "Faust"?',
          correct: 'Johann Wolfgang von Goethe',
          options: ['Friedrich Schiller', 'Heinrich Heine', 'Johann Wolfgang von Goethe', 'Thomas Mann'],
        },
        {
          question: 'What is "der Tag der Deutschen Einheit" (October 3rd)?',
          correct: 'German Unity Day',
          options: ['German Constitution Day', 'German Unity Day', 'Liberation Day', 'Republic Day'],
        },
        {
          question: 'What does "Wanderlust" mean?',
          correct: 'A strong desire to travel / wander',
          options: [
            'Love of hiking in forests',
            'A strong desire to travel / wander',
            'Restlessness at night',
            'Admiration of nature',
          ],
        },
        {
          question: 'What is the meaning of "Schadenfreude"?',
          correct: 'Taking pleasure in someone else\'s misfortune',
          options: [
            'Feeling shame for your actions',
            'Sadness over damage',
            'Taking pleasure in someone else\'s misfortune',
            'Joy at someone\'s success',
          ],
        },
        {
          question: 'What does "Weltanschauung" mean?',
          correct: 'World view / Philosophy of life',
          options: ['World exhibition', 'Global news', 'World view / Philosophy of life', 'International outlook'],
        },
        {
          question: 'What major river flows through Cologne and Düsseldorf?',
          correct: 'der Rhein (Rhine)',
          options: ['die Donau (Danube)', 'die Elbe', 'der Main', 'der Rhein (Rhine)'],
        },
        {
          question: 'What does "Bildung" mean in the German educational context?',
          correct: 'Education, culture, and self-development',
          options: ['School grades', 'Professional training', 'Education, culture, and self-development', 'Academic certificates'],
        },
        {
          question: 'What is "die soziale Marktwirtschaft"?',
          correct: 'Germany\'s social market economy model',
          options: ['A socialist government policy', 'A welfare programme', 'Germany\'s social market economy model', 'A trade union agreement'],
        },
        {
          question: 'Who composed "Beethoven\'s 9th Symphony"?',
          correct: 'Ludwig van Beethoven',
          options: ['Johann Sebastian Bach', 'Wolfgang Amadeus Mozart', 'Ludwig van Beethoven', 'Franz Schubert'],
        },
        {
          question: 'What is "die Berliner Mauer" historically?',
          correct: 'The wall that divided East and West Berlin (1961–1989)',
          options: [
            'A medieval fortification around Berlin',
            'The wall that divided East and West Berlin (1961–1989)',
            'A famous art installation in Berlin',
            'The outer wall of the Berlin Parliament',
          ],
        },
      ],
    },
    {
      id: 'b1-5',
      name: 'Quiz 5',
      premium: true,
      questions: [
        {
          question: 'What is the difference between "sagen" and "behaupten"?',
          correct: '"sagen" = to say; "behaupten" = to claim / assert',
          options: [
            '"sagen" is formal; "behaupten" is informal',
            '"sagen" = to say; "behaupten" = to claim / assert',
            '"sagen" is written; "behaupten" is spoken',
            'They are exact synonyms',
          ],
        },
        {
          question: 'What does "unverzüglich" mean?',
          correct: 'immediately / without delay',
          options: ['slowly', 'carefully', 'immediately / without delay', 'eventually'],
        },
        {
          question: 'What does "die Bescheinigung" mean?',
          correct: 'certificate / written confirmation',
          options: ['description', 'certificate / written confirmation', 'identification', 'application'],
        },
        {
          question: 'What is "die Aufenthaltserlaubnis"?',
          correct: 'residence permit',
          options: ['work permit', 'travel document', 'residence permit', 'citizenship certificate'],
        },
        {
          question: 'What does "gemäß" mean?',
          correct: 'in accordance with / according to',
          options: ['despite', 'regarding', 'in accordance with / according to', 'instead of'],
        },
        {
          question: 'How do you say "enclosed herewith" in formal German writing?',
          correct: 'anbei / in der Anlage',
          options: ['hier ist', 'als Anhang', 'anbei / in der Anlage', 'beigefügt'],
        },
        {
          question: 'What does "hiermit" mean in formal writing?',
          correct: 'herewith / hereby',
          options: ['from here', 'herewith / hereby', 'at this point', 'attached'],
        },
        {
          question: 'What is "die Meldepflicht"?',
          correct: 'obligation to register with authorities',
          options: ['reporting requirement for crimes', 'obligation to register with authorities', 'mandatory military service', 'compulsory voting'],
        },
        {
          question: 'What does "in Kraft treten" mean?',
          correct: 'to come into effect',
          options: ['to step in forcefully', 'to come into effect', 'to apply strength', 'to gain momentum'],
        },
        {
          question: 'How do you say "with reference to" in business German?',
          correct: 'bezüglich / mit Bezug auf',
          options: ['mit Rücksicht auf', 'in Bezug auf das Schreiben', 'bezüglich / mit Bezug auf', 'gemäß Ihrem Schreiben'],
        },
        {
          question: 'How do you say "to achieve / attain" formally in German?',
          correct: 'erzielen / erreichen',
          options: ['bekommen', 'kriegen', 'erzielen / erreichen', 'gewinnen'],
        },
        {
          question: 'What does "unterliegen" (+ dative) mean in legal language?',
          correct: 'to be subject to',
          options: ['to be inferior to', 'to be subject to', 'to lie under', 'to be governed by force'],
        },
        {
          question: 'How do you say "to correspond" (exchange letters/emails) in formal German?',
          correct: 'korrespondieren',
          options: ['antworten', 'schreiben', 'korrespondieren', 'kommunizieren'],
        },
      ],
    },
  ],
}
