import './App.css'

import { useCallback, useEffect, useMemo, useState } from 'react'

const LEVELS = ['A1', 'A2', 'B1']
const STORAGE_KEY = 'german-learning-game-progress-v1'

// Category ranges [start, count] per level - used to filter flashcards by topic
const FLASHCARD_CATEGORIES = {
  A1: [
    { id: 'all', name: 'All categories', start: 0, count: null },
    { id: 'original', name: 'Basics', start: 0, count: 6 },
    { id: 'greetings', name: 'Greetings & Politeness', start: 6, count: 50 },
    { id: 'personal', name: 'Personal Information', start: 56, count: 60 },
    { id: 'numbers', name: 'Numbers, Dates & Time', start: 116, count: 80 },
    { id: 'everyday', name: 'Everyday Activities & Verbs', start: 196, count: 150 },
    { id: 'food', name: 'Food & Drink', start: 346, count: 100 },
    { id: 'house', name: 'House, Home & Furniture', start: 446, count: 80 },
    { id: 'travel', name: 'Travel & Transportation', start: 526, count: 100 },
    { id: 'nature', name: 'Nature & Weather', start: 626, count: 80 },
  ],
  A2: [
    { id: 'all', name: 'All categories', start: 0, count: null },
    { id: 'original', name: 'Basics', start: 0, count: 5 },
    { id: 'daily', name: 'Daily Routines & Time', start: 5, count: 80 },
    { id: 'work-edu', name: 'Work & Education', start: 85, count: 80 },
    { id: 'health', name: 'Health & Body', start: 165, count: 80 },
    { id: 'leisure', name: 'Leisure & Hobbies', start: 245, count: 100 },
    { id: 'shopping', name: 'Shopping & Services', start: 345, count: 80 },
    { id: 'relationships', name: 'Relationships & Social Life', start: 425, count: 80 },
    { id: 'communication', name: 'Communication & Technology', start: 505, count: 70 },
    { id: 'city', name: 'City Life & Directions', start: 575, count: 80 },
    { id: 'past', name: 'Past Experiences & Biographical', start: 655, count: 80 },
    { id: 'feelings', name: 'Feelings & Opinions', start: 735, count: 80 },
  ],
  B1: [
    { id: 'all', name: 'All categories', start: 0, count: null },
    { id: 'original', name: 'Basics', start: 0, count: 4 },
    { id: 'work-career', name: 'Work & Career', start: 4, count: 80 },
    { id: 'education', name: 'Education & Learning', start: 84, count: 70 },
    { id: 'society', name: 'Society & Citizenship', start: 154, count: 70 },
    { id: 'media', name: 'Media & Communication', start: 224, count: 70 },
    { id: 'environment', name: 'Environment & Nature', start: 294, count: 70 },
    { id: 'technology', name: 'Technology & Innovation', start: 364, count: 70 },
    { id: 'health-med', name: 'Health & Medicine', start: 434, count: 70 },
    { id: 'feelings-emotions', name: 'Feelings & Emotions', start: 504, count: 80 },
    { id: 'opinions', name: 'Opinions & Arguments', start: 584, count: 80 },
    { id: 'abstract', name: 'Abstract Concepts', start: 664, count: 80 },
  ],
}

const WORD_SETS = {
  A1: {
    flashcards: [
      // Original entries (6)
      {
        de: 'Guten Morgen',
        en: 'Good morning',
        hint: 'Standard morning greeting',
        examples: [
          {
            de: 'Guten Morgen, wie geht es dir?',
            en: 'Good morning, how are you?',
          },
        ],
      },
      {
        de: 'Danke',
        en: 'Thank you',
        hint: 'You say this after getting help',
        examples: [
          {
            de: 'Danke für deine Hilfe.',
            en: 'Thank you your help.',
          },
        ],
      },
      {
        de: 'Bitte',
        en: 'Please / You’re welcome',
        hint: 'Polite word, two main meanings',
        examples: [
          {
            de: 'Eine Cola, bitte.',
            en: 'A cola, please.',
          },
          {
            de: 'Danke! – Bitte!',
            en: 'Thank you! – You’re welcome!',
          },
        ],
      },
      {
        de: 'Entschuldigung',
        en: 'Excuse me / Sorry',
        hint: 'Use in a bus or if you bump into someone',
        examples: [
          {
            de: 'Entschuldigung, ist dieser Platz frei?',
            en: 'Excuse me, is this seat free?',
          },
        ],
      },
      {
        de: 'Wie heißt du?',
        en: 'What is your name?',
        hint: 'Small talk question',
        examples: [
          {
            de: 'Hallo, wie heißt du?',
            en: 'Hi, what is your name?',
          },
        ],
      },
      {
        de: 'Ich komme aus …',
        en: 'I am from …',
        hint: 'Talking about your country',
        examples: [
          {
            de: 'Ich komme aus Deutschland.',
            en: 'I am from Germany.',
          },
        ],
      },
      // New A1 Flashcards (994 additional) - Total A1: 1000
      // Greetings & Politeness (50)
      { de: 'Guten Abend', en: 'Good evening', hint: 'Evening greeting', examples: [{ de: 'Guten Abend, wie war Ihr Tag?', en: 'Good evening, how was your day?' }] },
      { de: 'Gute Nacht', en: 'Good night', hint: 'Said before sleeping', examples: [{ de: 'Gute Nacht, schlaf gut!', en: 'Good night, sleep well!' }] },
      { de: 'Hallo', en: 'Hello', hint: 'Informal greeting', examples: [{ de: 'Hallo, wie geht\'s?', en: 'Hello, how are you?' }] },
      { de: 'Tschüss', en: 'Bye', hint: 'Informal goodbye', examples: [{ de: 'Tschüss, bis morgen!', en: 'Bye, see you tomorrow!' }] },
      { de: 'Auf Wiedersehen', en: 'Goodbye', hint: 'Formal goodbye', examples: [{ de: 'Auf Wiedersehen, Frau Müller.', en: 'Goodbye, Mrs. Müller.' }] },
      { de: 'Bis bald', en: 'See you soon', hint: 'Saying you\'ll meet again soon', examples: [{ de: 'Ich muss los. Bis bald!', en: 'I have to go. See you soon!' }] },
      { de: 'Bis später', en: 'See you later', hint: 'If you\'ll meet later the same day', examples: [{ de: 'Ich gehe einkaufen. Bis später!', en: 'I\'m going shopping. See you later!' }] },
      { de: 'Bis morgen', en: 'See you tomorrow', hint: 'Goodbye until next day', examples: [{ de: 'Bis morgen in der Schule.', en: 'See you tomorrow at school.' }] },
      { de: 'Servus', en: 'Hi/Bye', hint: 'Bavarian/Austrian greeting', examples: [{ de: 'Servus, wie geht\'s?', en: 'Hi, how are you?' }] },
      { de: 'Wie geht es Ihnen?', en: 'How are you? (formal)', hint: 'Formal version', examples: [{ de: 'Guten Tag, wie geht es Ihnen?', en: 'Hello, how are you?' }] },
      { de: 'Wie geht es dir?', en: 'How are you? (informal)', hint: 'Informal version', examples: [{ de: 'Hallo Maria, wie geht es dir?', en: 'Hi Maria, how are you?' }] },
      { de: 'Mir geht es gut', en: 'I am fine', hint: 'Standard positive answer', examples: [{ de: 'Danke, mir geht es gut.', en: 'Thanks, I am fine.' }] },
      { de: 'Und dir?', en: 'And you? (informal)', hint: 'Returning the question', examples: [{ de: 'Mir geht es gut. Und dir?', en: 'I\'m fine. And you?' }] },
      { de: 'Und Ihnen?', en: 'And you? (formal)', hint: 'Returning the question formally', examples: [{ de: 'Gut, danke. Und Ihnen?', en: 'Good, thanks. And you?' }] },
      { de: 'Sehr gut', en: 'Very good', hint: 'Emphasizing good', examples: [{ de: 'Das Essen ist sehr gut.', en: 'The food is very good.' }] },
      { de: 'Es geht', en: 'So-so', hint: 'Neutral or okay', examples: [{ de: 'Wie geht\'s? Es geht.', en: 'How are you? So-so.' }] },
      { de: 'Nicht so gut', en: 'Not so good', hint: 'When feeling bad', examples: [{ de: 'Mir geht es heute nicht so gut.', en: 'I\'m not feeling so good today.' }] },
      { de: 'Willkommen', en: 'Welcome', hint: 'Greeting a guest', examples: [{ de: 'Willkommen in Berlin!', en: 'Welcome to Berlin!' }] },
      { de: 'Guten Appetit', en: 'Enjoy your meal', hint: 'Said before eating', examples: [{ de: 'Das Essen ist fertig. Guten Appetit!', en: 'Food is ready. Enjoy your meal!' }] },
      { de: 'Prost', en: 'Cheers', hint: 'When drinking with others', examples: [{ de: 'Prost! Auf deine Gesundheit!', en: 'Cheers! To your health!' }] },
      { de: 'Gesundheit', en: 'Bless you', hint: 'After someone sneezes', examples: [{ de: 'Hatschi! – Gesundheit!', en: 'Achoo! – Bless you!' }] },
      { de: 'Herzlichen Glückwunsch', en: 'Congratulations', hint: 'For birthdays or achievements', examples: [{ de: 'Herzlichen Glückwunsch zum Geburtstag!', en: 'Happy birthday!' }] },
      { de: 'Alles Gute', en: 'All the best', hint: 'Good wishes', examples: [{ de: 'Alles Gute zum neuen Jahr!', en: 'Happy New Year!' }] },
      { de: 'Viel Glück', en: 'Good luck', hint: 'Wishing luck', examples: [{ de: 'Viel Glück bei der Prüfung!', en: 'Good luck with your exam!' }] },
      { de: 'Viel Erfolg', en: 'Good success', hint: 'Wishing success', examples: [{ de: 'Viel Erfolg im neuen Job!', en: 'Good luck in your new job!' }] },
      { de: 'Gute Reise', en: 'Have a good trip', hint: 'When someone travels', examples: [{ de: 'Gute Reise und komm gesund wieder!', en: 'Have a good trip and come back safe!' }] },
      { de: 'Gute Besserung', en: 'Get well soon', hint: 'To someone ill', examples: [{ de: 'Ich höre, du bist krank. Gute Besserung!', en: 'I hear you\'re sick. Get well soon!' }] },
      { de: 'Ja', en: 'Yes', hint: 'Affirmation', examples: [{ de: 'Ja, ich verstehe.', en: 'Yes, I understand.' }] },
      { de: 'Nein', en: 'No', hint: 'Negation', examples: [{ de: 'Nein, ich habe keine Zeit.', en: 'No, I don\'t have time.' }] },
      { de: 'Vielleicht', en: 'Maybe', hint: 'Expressing possibility', examples: [{ de: 'Vielleicht gehe ich ins Kino.', en: 'Maybe I\'ll go to the cinema.' }] },
      { de: 'OK', en: 'Okay', hint: 'Agreement', examples: [{ de: 'OK, das klingt gut.', en: 'Okay, that sounds good.' }] },
      { de: 'Kein Problem', en: 'No problem', hint: 'Informal agreement', examples: [{ de: 'Kannst du helfen? Kein Problem!', en: 'Can you help? No problem!' }] },
      { de: 'Wie bitte?', en: 'Pardon?', hint: 'When you didn\'t hear/understand', examples: [{ de: 'Wie bitte? Ich habe dich nicht verstanden.', en: 'Pardon? I didn\'t understand you.' }] },
      { de: 'Einen Moment, bitte', en: 'One moment, please', hint: 'Asking to wait', examples: [{ de: 'Einen Moment, bitte. Ich komme gleich.', en: 'One moment, please. I\'ll be right there.' }] },
      { de: 'Das macht nichts', en: 'It doesn\'t matter', hint: 'Reassuring someone', examples: [{ de: 'Oh, Entschuldigung! – Das macht nichts.', en: 'Oh, sorry! – It doesn\'t matter.' }] },
      { de: 'Leider', en: 'Unfortunately', hint: 'Expressing regret', examples: [{ de: 'Leider habe ich keine Zeit.', en: 'Unfortunately, I have no time.' }] },
      { de: 'Sehr gerne', en: 'Very gladly / With pleasure', hint: 'Positive response to a request', examples: [{ de: 'Kannst du mir helfen? – Sehr gerne.', en: 'Can you help me? – With pleasure.' }] },
      { de: 'Natürlich', en: 'Of course', hint: 'Strong agreement', examples: [{ de: 'Kann ich hereinkommen? – Natürlich!', en: 'Can I come in? – Of course!' }] },
      { de: 'Genau', en: 'Exactly', hint: 'Agreeing precisely', examples: [{ de: 'Also, das ist die U-Bahn? – Genau.', en: 'So, this is the subway? – Exactly.' }] },
      { de: 'Stimmt', en: 'That\'s right', hint: 'Confirming correctness', examples: [{ de: 'Berlin ist die Hauptstadt, stimmt\'s? – Stimmt.', en: 'Berlin is the capital, right? – That\'s right.' }] },
      { de: 'Echt?', en: 'Really?', hint: 'Expressing surprise', examples: [{ de: 'Ich bin 30 Jahre alt. – Echt? Ich dachte, du bist jünger.', en: 'I\'m 30 years old. – Really? I thought you were younger.' }] },
      { de: 'Toll!', en: 'Great!', hint: 'Enthusiasm', examples: [{ de: 'Wir fahren nach Italien! – Toll!', en: 'We\'re going to Italy! – Great!' }] },
      { de: 'Super!', en: 'Super!', hint: 'Very positive', examples: [{ de: 'Ich habe die Prüfung bestanden. – Super!', en: 'I passed the exam. – Super!' }] },
      { de: 'Prima!', en: 'Great!', hint: 'Excellent', examples: [{ de: 'Prima Idee!', en: 'Great idea!' }] },
      { de: 'Schade!', en: 'Too bad!', hint: 'Expressing disappointment', examples: [{ de: 'Ich kann nicht kommen. – Schade!', en: 'I can\'t come. – Too bad!' }] },
      { de: 'Ach so', en: 'Oh, I see', hint: 'When you suddenly understand', examples: [{ de: 'Er ist mein Bruder. – Ach so, jetzt verstehe ich.', en: 'He\'s my brother. – Oh, I see, now I understand.' }] },
      { de: 'Naja', en: 'Well...', hint: 'Hesitation or resignation', examples: [{ de: 'Wie war der Film? – Naja, nicht so gut.', en: 'How was the movie? – Well, not so good.' }] },
      { de: 'Eigentlich', en: 'Actually', hint: 'To express a fact', examples: [{ de: 'Eigentlich mag ich Tee lieber.', en: 'Actually, I prefer tea.' }] },
      { de: 'Gleichfalls', en: 'Likewise', hint: 'Returning a wish', examples: [{ de: 'Schönen Tag! – Gleichfalls!', en: 'Have a nice day! – Likewise!' }] },
      { de: 'Danke schön', en: 'Thank you very much', hint: 'More formal thanks', examples: [{ de: 'Hier ist Ihr Kaffee. – Danke schön!', en: 'Here is your coffee. – Thank you very much!' }] },
      { de: 'Vielen Dank', en: 'Many thanks', hint: 'Expressing gratitude', examples: [{ de: 'Vielen Dank für Ihre Hilfe.', en: 'Many thanks for your help.' }] },

      // Personal Information (60)
      { de: 'Ich', en: 'I', hint: 'First person singular', examples: [{ de: 'Ich heiße Anna.', en: 'My name is Anna.' }] },
      { de: 'Du', en: 'You (informal singular)', hint: 'Addressing a friend', examples: [{ de: 'Du bist mein Freund.', en: 'You are my friend.' }] },
      { de: 'Er', en: 'He', hint: 'Third person masculine', examples: [{ de: 'Er ist Lehrer.', en: 'He is a teacher.' }] },
      { de: 'Sie (singular)', en: 'She', hint: 'Third person feminine', examples: [{ de: 'Sie heißt Maria.', en: 'She is called Maria.' }] },
      { de: 'Es', en: 'It', hint: 'Third person neuter', examples: [{ de: 'Das ist ein Haus. Es ist groß.', en: 'That is a house. It is big.' }] },
      { de: 'Wir', en: 'We', hint: 'First person plural', examples: [{ de: 'Wir sind aus Spanien.', en: 'We are from Spain.' }] },
      { de: 'Ihr', en: 'You (plural informal)', hint: 'Addressing a group of friends', examples: [{ de: 'Ihr seid sehr nett.', en: 'You (all) are very nice.' }] },
      { de: 'Sie (plural)', en: 'They', hint: 'Third person plural', examples: [{ de: 'Sie kommen aus Berlin.', en: 'They come from Berlin.' }] },
      { de: 'Sie (formal)', en: 'You (formal singular/plural)', hint: 'Polite address', examples: [{ de: 'Sie, Herr Schmidt, sind willkommen.', en: 'You, Mr. Schmidt, are welcome.' }] },
      { de: 'Mein Name ist ...', en: 'My name is ...', hint: 'Introducing yourself', examples: [{ de: 'Mein Name ist Peter Meier.', en: 'My name is Peter Meier.' }] },
      { de: 'Ich heiße ...', en: 'I am called ...', hint: 'Introducing your name', examples: [{ de: 'Ich heiße Lisa.', en: 'My name is Lisa.' }] },
      { de: 'Wie heißen Sie?', en: 'What is your name? (formal)', hint: 'Asking formally', examples: [{ de: 'Entschuldigung, wie heißen Sie?', en: 'Excuse me, what is your name?' }] },
      { de: 'Wie ist Ihr Name?', en: 'What is your name? (formal)', hint: 'Another formal way', examples: [{ de: 'Wie ist Ihr Name, bitte?', en: 'What is your name, please?' }] },
      { de: 'Woher kommst du?', en: 'Where do you come from? (informal)', hint: 'Asking about origin', examples: [{ de: 'Du sprichst gut Deutsch. Woher kommst du?', en: 'You speak German well. Where are you from?' }] },
      { de: 'Woher kommen Sie?', en: 'Where do you come from? (formal)', hint: 'Formal version', examples: [{ de: 'Woher kommen Sie, Herr Brown?', en: 'Where are you from, Mr. Brown?' }] },
      { de: 'Ich wohne in ...', en: 'I live in ...', hint: 'Saying where you live', examples: [{ de: 'Ich wohne in Köln.', en: 'I live in Cologne.' }] },
      { de: 'Ich bin ... Jahre alt', en: 'I am ... years old', hint: 'Telling your age', examples: [{ de: 'Ich bin fünfundzwanzig Jahre alt.', en: 'I am twenty-five years old.' }] },
      { de: 'Wie alt bist du?', en: 'How old are you? (informal)', hint: 'Asking age informally', examples: [{ de: 'Wie alt bist du? – Ich bin achtzehn.', en: 'How old are you? – I am eighteen.' }] },
      { de: 'Ich wohne in einer Wohnung', en: 'I live in an apartment', hint: 'Describing your home', examples: [{ de: 'Ich wohne in einer Wohnung im Zentrum.', en: 'I live in an apartment in the center.' }] },
      { de: 'Ich wohne in einem Haus', en: 'I live in a house', hint: 'Describing your home', examples: [{ de: 'Ich wohne in einem Haus mit Garten.', en: 'I live in a house with a garden.' }] },
      { de: 'Meine Adresse ist ...', en: 'My address is ...', hint: 'Giving your address', examples: [{ de: 'Meine Adresse ist Hauptstraße 12.', en: 'My address is 12 Main Street.' }] },
      { de: 'Meine Telefonnummer ist ...', en: 'My phone number is ...', hint: 'Giving your number', examples: [{ de: 'Meine Telefonnummer ist 0176 123456.', en: 'My phone number is 0176 123456.' }] },
      { de: 'der Vorname', en: 'first name', hint: 'Your given name', examples: [{ de: 'Mein Vorname ist Thomas.', en: 'My first name is Thomas.' }] },
      { de: 'der Nachname', en: 'last name', hint: 'Your family name', examples: [{ de: 'Mein Nachname ist Schmidt.', en: 'My last name is Schmidt.' }] },
      { de: 'verheiratet', en: 'married', hint: 'Marital status', examples: [{ de: 'Ich bin verheiratet.', en: 'I am married.' }] },
      { de: 'ledig', en: 'single', hint: 'Not married', examples: [{ de: 'Er ist ledig.', en: 'He is single.' }] },
      { de: 'geschieden', en: 'divorced', hint: 'Marital status', examples: [{ de: 'Sie ist geschieden.', en: 'She is divorced.' }] },
      { de: 'verwitwet', en: 'widowed', hint: 'Marital status', examples: [{ de: 'Mein Opa ist verwitwet.', en: 'My grandpa is widowed.' }] },
      { de: 'die Familie', en: 'family', hint: 'Your relatives', examples: [{ de: 'Meine Familie ist groß.', en: 'My family is big.' }] },
      { de: 'der Vater', en: 'father', hint: 'Dad', examples: [{ de: 'Mein Vater heißt Klaus.', en: 'My father is called Klaus.' }] },
      { de: 'die Mutter', en: 'mother', hint: 'Mom', examples: [{ de: 'Meine Mutter ist Ärztin.', en: 'My mother is a doctor.' }] },
      { de: 'der Bruder', en: 'brother', hint: 'Male sibling', examples: [{ de: 'Ich habe einen Bruder.', en: 'I have a brother.' }] },
      { de: 'die Schwester', en: 'sister', hint: 'Female sibling', examples: [{ de: 'Meine Schwester ist jünger.', en: 'My sister is younger.' }] },
      { de: 'der Sohn', en: 'son', hint: 'Male child', examples: [{ de: 'Unser Sohn geht zur Schule.', en: 'Our son goes to school.' }] },
      { de: 'die Tochter', en: 'daughter', hint: 'Female child', examples: [{ de: 'Meine Tochter ist fünf.', en: 'My daughter is five.' }] },
      { de: 'der Großvater', en: 'grandfather', hint: 'Grandpa', examples: [{ de: 'Mein Großvater ist schon alt.', en: 'My grandfather is already old.' }] },
      { de: 'die Großmutter', en: 'grandmother', hint: 'Grandma', examples: [{ de: 'Meine Großmutter kocht gut.', en: 'My grandmother cooks well.' }] },
      { de: 'die Eltern', en: 'parents', hint: 'Mother and father', examples: [{ de: 'Meine Eltern wohnen in Hamburg.', en: 'My parents live in Hamburg.' }] },
      { de: 'die Kinder', en: 'children', hint: 'Sons and daughters', examples: [{ de: 'Wir haben zwei Kinder.', en: 'We have two children.' }] },
      { de: 'der Beruf', en: 'profession', hint: 'Your job', examples: [{ de: 'Was ist dein Beruf?', en: 'What is your job?' }] },
      { de: 'arbeiten', en: 'to work', hint: 'Doing a job', examples: [{ de: 'Ich arbeite in einer Firma.', en: 'I work in a company.' }] },
      { de: 'der Arzt / die Ärztin', en: 'doctor (m/f)', hint: 'Medical professional', examples: [{ de: 'Mein Vater ist Arzt.', en: 'My father is a doctor.' }] },
      { de: 'der Lehrer / die Lehrerin', en: 'teacher (m/f)', hint: 'Works at school', examples: [{ de: 'Meine Schwester ist Lehrerin.', en: 'My sister is a teacher.' }] },
      { de: 'der Student / die Studentin', en: 'student (university)', hint: 'Studies at university', examples: [{ de: 'Ich bin Student. Ich studiere Medizin.', en: 'I am a student. I study medicine.' }] },
      { de: 'der Schüler / die Schülerin', en: 'student (school)', hint: 'Goes to school', examples: [{ de: 'Die Schüler lernen Deutsch.', en: 'The students learn German.' }] },
      { de: 'der Ingenieur / die Ingenieurin', en: 'engineer (m/f)', hint: 'Technical profession', examples: [{ de: 'Er ist Ingenieur bei BMW.', en: 'He is an engineer at BMW.' }] },
      { de: 'der Verkäufer / die Verkäuferin', en: 'salesperson (m/f)', hint: 'Works in a shop', examples: [{ de: 'Die Verkäuferin ist sehr freundlich.', en: 'The salesperson is very friendly.' }] },
      { de: 'zu Hause', en: 'at home', hint: 'Location at your home', examples: [{ de: 'Ich bin heute zu Hause.', en: 'I am at home today.' }] },
      { de: 'ledig', en: 'single', hint: 'Not married', examples: [{ de: 'Er ist ledig, aber er hat eine Freundin.', en: 'He is single, but he has a girlfriend.' }] },

      // Numbers, Dates, Time (80)
      { de: 'null', en: 'zero', hint: 'Number 0', examples: [{ de: 'Die Zahl ist null.', en: 'The number is zero.' }] },
      { de: 'eins', en: 'one', hint: 'Number 1', examples: [{ de: 'Ich habe einen Bruder.', en: 'I have one brother.' }] },
      { de: 'zwei', en: 'two', hint: 'Number 2', examples: [{ de: 'Wir haben zwei Kinder.', en: 'We have two children.' }] },
      { de: 'drei', en: 'three', hint: 'Number 3', examples: [{ de: 'Er hat drei Schwestern.', en: 'He has three sisters.' }] },
      { de: 'vier', en: 'four', hint: 'Number 4', examples: [{ de: 'Das kostet vier Euro.', en: 'That costs four euros.' }] },
      { de: 'fünf', en: 'five', hint: 'Number 5', examples: [{ de: 'Ich habe fünf Finger.', en: 'I have five fingers.' }] },
      { de: 'sechs', en: 'six', hint: 'Number 6', examples: [{ de: 'Wir treffen uns um sechs.', en: 'We\'re meeting at six.' }] },
      { de: 'sieben', en: 'seven', hint: 'Number 7', examples: [{ de: 'Eine Woche hat sieben Tage.', en: 'A week has seven days.' }] },
      { de: 'acht', en: 'eight', hint: 'Number 8', examples: [{ de: 'Ich arbeite acht Stunden.', en: 'I work eight hours.' }] },
      { de: 'neun', en: 'nine', hint: 'Number 9', examples: [{ de: 'Der Kurs beginnt um neun.', en: 'The course starts at nine.' }] },
      { de: 'zehn', en: 'ten', hint: 'Number 10', examples: [{ de: 'Zehn Euro, bitte.', en: 'Ten euros, please.' }] },
      { de: 'elf', en: 'eleven', hint: 'Number 11', examples: [{ de: 'Die Mannschaft hat elf Spieler.', en: 'The team has eleven players.' }] },
      { de: 'zwölf', en: 'twelve', hint: 'Number 12', examples: [{ de: 'Es ist zwölf Uhr mittags.', en: 'It\'s twelve noon.' }] },
      { de: 'dreizehn', en: 'thirteen', hint: 'Number 13', examples: [{ de: 'Dreizehn gilt als Unglückszahl.', en: 'Thirteen is considered unlucky.' }] },
      { de: 'vierzehn', en: 'fourteen', hint: 'Number 14', examples: [{ de: 'Sie ist vierzehn Jahre alt.', en: 'She is fourteen years old.' }] },
      { de: 'fünfzehn', en: 'fifteen', hint: 'Number 15', examples: [{ de: 'Fünfzehn Minuten Pause.', en: 'Fifteen minutes break.' }] },
      { de: 'sechzehn', en: 'sixteen', hint: 'Number 16', examples: [{ de: 'Mit sechzehn darf man Moped fahren.', en: 'At sixteen you can ride a moped.' }] },
      { de: 'siebzehn', en: 'seventeen', hint: 'Number 17', examples: [{ de: 'Ich habe siebzehn Bücher.', en: 'I have seventeen books.' }] },
      { de: 'achtzehn', en: 'eighteen', hint: 'Number 18', examples: [{ de: 'Mit achtzehn ist man volljährig.', en: 'At eighteen you are of age.' }] },
      { de: 'neunzehn', en: 'nineteen', hint: 'Number 19', examples: [{ de: 'Heute ist der neunzehnte Mai.', en: 'Today is the nineteenth of May.' }] },
      { de: 'zwanzig', en: 'twenty', hint: 'Number 20', examples: [{ de: 'Das Buch kostet zwanzig Euro.', en: 'The book costs twenty euros.' }] },
      { de: 'einundzwanzig', en: 'twenty-one', hint: 'Number 21', examples: [{ de: 'Sie ist einundzwanzig Jahre alt.', en: 'She is twenty-one years old.' }] },
      { de: 'zweiundzwanzig', en: 'twenty-two', hint: 'Number 22', examples: [{ de: 'Wir haben zweiundzwanzig Gäste.', en: 'We have twenty-two guests.' }] },
      { de: 'dreißig', en: 'thirty', hint: 'Number 30', examples: [{ de: 'Er ist dreißig Jahre alt.', en: 'He is thirty years old.' }] },
      { de: 'vierzig', en: 'forty', hint: 'Number 40', examples: [{ de: 'Die Geschwindigkeit ist vierzig km/h.', en: 'The speed is forty km/h.' }] },
      { de: 'fünfzig', en: 'fifty', hint: 'Number 50', examples: [{ de: 'Meine Oma ist fünfzig.', en: 'My grandma is fifty.' }] },
      { de: 'sechzig', en: 'sixty', hint: 'Number 60', examples: [{ de: 'Eine Minute hat sechzig Sekunden.', en: 'A minute has sixty seconds.' }] },
      { de: 'siebzig', en: 'seventy', hint: 'Number 70', examples: [{ de: 'Das Auto fährt siebzig.', en: 'The car goes seventy.' }] },
      { de: 'achtzig', en: 'eighty', hint: 'Number 80', examples: [{ de: 'Mein Opa ist achtzig Jahre alt.', en: 'My grandpa is eighty years old.' }] },
      { de: 'neunzig', en: 'ninety', hint: 'Number 90', examples: [{ de: 'Der Preis liegt bei neunzig Euro.', en: 'The price is ninety euros.' }] },
      { de: 'hundert', en: 'hundred', hint: 'Number 100', examples: [{ de: 'Das sind hundert Euro.', en: 'That\'s one hundred euros.' }] },
      { de: 'einhundert', en: 'one hundred', hint: 'Number 100', examples: [{ de: 'Einhundert Menschen sind hier.', en: 'One hundred people are here.' }] },
      { de: 'zweihundert', en: 'two hundred', hint: 'Number 200', examples: [{ de: 'Das Zimmer kostet zweihundert Euro.', en: 'The room costs two hundred euros.' }] },
      { de: 'tausend', en: 'thousand', hint: 'Number 1000', examples: [{ de: 'Das kostet tausend Euro.', en: 'That costs one thousand euros.' }] },
      { de: 'die Nummer', en: 'number', hint: 'For phone or house', examples: [{ de: 'Meine Telefonnummer ist...', en: 'My phone number is...' }] },
      { de: 'die Uhrzeit', en: 'time (of day)', hint: 'What time it is', examples: [{ de: 'Wie spät ist die Uhrzeit?', en: 'What time is it?' }] },
      { de: 'Wie spät ist es?', en: 'What time is it?', hint: 'Asking the time', examples: [{ de: 'Entschuldigung, wie spät ist es?', en: 'Excuse me, what time is it?' }] },
      { de: 'Es ist ... Uhr', en: 'It is ... o\'clock', hint: 'Telling the hour', examples: [{ de: 'Es ist drei Uhr.', en: 'It is three o\'clock.' }] },
      { de: 'Um wie viel Uhr?', en: 'At what time?', hint: 'Asking when something happens', examples: [{ de: 'Um wie viel Uhr treffen wir uns?', en: 'What time are we meeting?' }] },
      { de: 'Um acht Uhr', en: 'At eight o\'clock', hint: 'Specifying time', examples: [{ de: 'Der Kurs beginnt um acht Uhr.', en: 'The course starts at eight o\'clock.' }] },
      { de: 'Viertel nach', en: 'quarter past', hint: '15 minutes past', examples: [{ de: 'Es ist Viertel nach zehn.', en: 'It is quarter past ten.' }] },
      { de: 'halb', en: 'half (past)', hint: '30 minutes past the hour', examples: [{ de: 'Es ist halb fünf. (4:30)', en: 'It is half past four.' }] },
      { de: 'Viertel vor', en: 'quarter to', hint: '15 minutes to the hour', examples: [{ de: 'Es ist Viertel vor acht.', en: 'It is quarter to eight.' }] },
      { de: 'fünf nach', en: 'five past', hint: '5 minutes past', examples: [{ de: 'Es ist fünf nach zwei.', en: 'It is five past two.' }] },
      { de: 'zehn vor', en: 'ten to', hint: '10 minutes to', examples: [{ de: 'Es ist zehn vor elf.', en: 'It is ten to eleven.' }] },
      { de: 'der Morgen', en: 'morning', hint: 'Early day part', examples: [{ de: 'Am Morgen trinke ich Kaffee.', en: 'In the morning I drink coffee.' }] },
      { de: 'der Vormittag', en: 'late morning', hint: 'Time before noon', examples: [{ de: 'Am Vormittag arbeite ich.', en: 'In the late morning I work.' }] },
      { de: 'der Mittag', en: 'noon', hint: '12 o\'clock', examples: [{ de: 'Um zwölf Uhr ist Mittag.', en: 'At twelve o\'clock it\'s noon.' }] },
      { de: 'der Nachmittag', en: 'afternoon', hint: 'After noon', examples: [{ de: 'Am Nachmittag gehe ich einkaufen.', en: 'In the afternoon I go shopping.' }] },
      { de: 'der Abend', en: 'evening', hint: 'Late day part', examples: [{ de: 'Am Abend sehe ich fern.', en: 'In the evening I watch TV.' }] },
      { de: 'die Nacht', en: 'night', hint: 'When you sleep', examples: [{ de: 'In der Nacht schlafe ich.', en: 'At night I sleep.' }] },
      { de: 'heute', en: 'today', hint: 'This day', examples: [{ de: 'Heute ist Montag.', en: 'Today is Monday.' }] },
      { de: 'morgen', en: 'tomorrow', hint: 'The next day', examples: [{ de: 'Morgen habe ich frei.', en: 'Tomorrow I am off.' }] },
      { de: 'gestern', en: 'yesterday', hint: 'The day before today', examples: [{ de: 'Gestern war ich im Kino.', en: 'Yesterday I was at the cinema.' }] },
      { de: 'jetzt', en: 'now', hint: 'At this moment', examples: [{ de: 'Jetzt lerne ich Deutsch.', en: 'Now I am learning German.' }] },
      { de: 'später', en: 'later', hint: 'Not now, future', examples: [{ de: 'Wir können später essen.', en: 'We can eat later.' }] },
      { de: 'früh', en: 'early', hint: 'At an early time', examples: [{ de: 'Ich stehe früh auf.', en: 'I get up early.' }] },
      { de: 'spät', en: 'late', hint: 'At a late time', examples: [{ de: 'Komm nicht zu spät!', en: 'Don\'t come too late!' }] },
      { de: 'der Tag', en: 'day', hint: '24 hours', examples: [{ de: 'Ein Tag hat 24 Stunden.', en: 'A day has 24 hours.' }] },
      { de: 'die Woche', en: 'week', hint: '7 days', examples: [{ de: 'Eine Woche hat sieben Tage.', en: 'A week has seven days.' }] },
      { de: 'das Wochenende', en: 'weekend', hint: 'Saturday and Sunday', examples: [{ de: 'Am Wochenende arbeite ich nicht.', en: 'I don\'t work on the weekend.' }] },
      { de: 'der Monat', en: 'month', hint: '30 or 31 days', examples: [{ de: 'Der Monat Mai ist schön.', en: 'The month of May is nice.' }] },
      { de: 'das Jahr', en: 'year', hint: '12 months', examples: [{ de: 'Ein Jahr hat zwölf Monate.', en: 'A year has twelve months.' }] },
      { de: 'Montag', en: 'Monday', hint: 'First workday', examples: [{ de: 'Am Montag beginnt die Woche.', en: 'The week begins on Monday.' }] },
      { de: 'Dienstag', en: 'Tuesday', hint: 'Second day', examples: [{ de: 'Dienstag ist mein zweiter Arbeitstag.', en: 'Tuesday is my second workday.' }] },
      { de: 'Mittwoch', en: 'Wednesday', hint: 'Midweek', examples: [{ de: 'Mittwoch ist die Mitte der Woche.', en: 'Wednesday is the middle of the week.' }] },
      { de: 'Donnerstag', en: 'Thursday', hint: 'Fourth day', examples: [{ de: 'Donnerstag habe ich einen Termin.', en: 'I have an appointment on Thursday.' }] },
      { de: 'Freitag', en: 'Friday', hint: 'Last workday', examples: [{ de: 'Freitagabend gehe ich aus.', en: 'Friday evening I go out.' }] },
      { de: 'Samstag', en: 'Saturday', hint: 'First weekend day', examples: [{ de: 'Samstag ist mein freier Tag.', en: 'Saturday is my day off.' }] },
      { de: 'Sonntag', en: 'Sunday', hint: 'Second weekend day', examples: [{ de: 'Sonntag gehe ich in die Kirche.', en: 'Sunday I go to church.' }] },
      { de: 'Januar', en: 'January', hint: 'First month', examples: [{ de: 'Januar ist der erste Monat.', en: 'January is the first month.' }] },
      { de: 'Februar', en: 'February', hint: 'Second month', examples: [{ de: 'Februar hat oft nur 28 Tage.', en: 'February often has only 28 days.' }] },
      { de: 'März', en: 'March', hint: 'Third month', examples: [{ de: 'Im März beginnt der Frühling.', en: 'Spring begins in March.' }] },
      { de: 'April', en: 'April', hint: 'Fourth month', examples: [{ de: 'April, April, der macht was er will.', en: 'April does what it wants.' }] },
      { de: 'Mai', en: 'May', hint: 'Fifth month', examples: [{ de: 'Im Mai ist es oft warm.', en: 'It is often warm in May.' }] },
      { de: 'Juni', en: 'June', hint: 'Sixth month', examples: [{ de: 'Im Juni beginnt der Sommer.', en: 'Summer begins in June.' }] },
      { de: 'Juli', en: 'July', hint: 'Seventh month', examples: [{ de: 'Im Juli sind die Tage lang.', en: 'The days are long in July.' }] },
      { de: 'August', en: 'August', hint: 'Eighth month', examples: [{ de: 'Im August habe ich Urlaub.', en: 'I have vacation in August.' }] },
      { de: 'September', en: 'September', hint: 'Ninth month', examples: [{ de: 'Im September beginnt die Schule.', en: 'School begins in September.' }] },
      { de: 'Oktober', en: 'October', hint: 'Tenth month', examples: [{ de: 'Im Oktober ist Oktoberfest.', en: 'Oktoberfest is in October.' }] },
      { de: 'November', en: 'November', hint: 'Eleventh month', examples: [{ de: 'Im November ist es oft neblig.', en: 'It is often foggy in November.' }] },
      { de: 'Dezember', en: 'December', hint: 'Twelfth month', examples: [{ de: 'Im Dezember feiern wir Weihnachten.', en: 'We celebrate Christmas in December.' }] },
      { de: 'im Jahr 2024', en: 'in the year 2024', hint: 'Specifying year', examples: [{ de: 'Wir sind im Jahr 2024.', en: 'We are in the year 2024.' }] },

      // Everyday Activities & Verbs (150)
      { de: 'sein', en: 'to be', hint: 'Most important verb', examples: [{ de: 'Ich bin müde.', en: 'I am tired.' }] },
      { de: 'haben', en: 'to have', hint: 'To possess', examples: [{ de: 'Ich habe ein Auto.', en: 'I have a car.' }] },
      { de: 'werden', en: 'to become', hint: 'Future/transformation', examples: [{ de: 'Ich werde Lehrer.', en: 'I become a teacher.' }] },
      { de: 'können', en: 'can, to be able to', hint: 'Modal verb for ability', examples: [{ de: 'Ich kann gut schwimmen.', en: 'I can swim well.' }] },
      { de: 'möchten', en: 'would like to', hint: 'Polite wish', examples: [{ de: 'Ich möchte ein Eis.', en: 'I would like an ice cream.' }] },
      { de: 'müssen', en: 'must, to have to', hint: 'Necessity', examples: [{ de: 'Ich muss jetzt gehen.', en: 'I have to go now.' }] },
      { de: 'wollen', en: 'to want', hint: 'Desire', examples: [{ de: 'Ich will Deutsch lernen.', en: 'I want to learn German.' }] },
      { de: 'sollen', en: 'should, ought to', hint: 'Duty/advice', examples: [{ de: 'Du sollst mehr trinken.', en: 'You should drink more.' }] },
      { de: 'dürfen', en: 'may, to be allowed', hint: 'Permission', examples: [{ de: 'Darf ich hier parken?', en: 'May I park here?' }] },
      { de: 'mögen', en: 'to like', hint: 'Liking something', examples: [{ de: 'Ich mag Schokolade.', en: 'I like chocolate.' }] },
      { de: 'gehen', en: 'to go', hint: 'Movement on foot', examples: [{ de: 'Ich gehe nach Hause.', en: 'I\'m going home.' }] },
      { de: 'kommen', en: 'to come', hint: 'Moving towards', examples: [{ de: 'Kommst du aus Berlin?', en: 'Do you come from Berlin?' }] },
      { de: 'fahren', en: 'to drive, to ride', hint: 'Using a vehicle', examples: [{ de: 'Ich fahre mit dem Bus.', en: 'I go by bus.' }] },
      { de: 'fliegen', en: 'to fly', hint: 'By plane', examples: [{ de: 'Wir fliegen nach Spanien.', en: 'We are flying to Spain.' }] },
      { de: 'laufen', en: 'to walk, to run', hint: 'On foot', examples: [{ de: 'Er läuft jeden Tag.', en: 'He runs every day.' }] },
      { de: 'stehen', en: 'to stand', hint: 'Upright position', examples: [{ de: 'Das Glas steht auf dem Tisch.', en: 'The glass is standing on the table.' }] },
      { de: 'sitzen', en: 'to sit', hint: 'On a chair', examples: [{ de: 'Wir sitzen im Café.', en: 'We are sitting in the café.' }] },
      { de: 'liegen', en: 'to lie, to be located', hint: 'Horizontal position', examples: [{ de: 'Das Buch liegt auf dem Bett.', en: 'The book is lying on the bed.' }] },
      { de: 'schlafen', en: 'to sleep', hint: 'Rest at night', examples: [{ de: 'Ich schlafe acht Stunden.', en: 'I sleep eight hours.' }] },
      { de: 'aufstehen', en: 'to get up', hint: 'Leave the bed', examples: [{ de: 'Ich stehe um sieben auf.', en: 'I get up at seven.' }] },
      { de: 'frühstücken', en: 'to have breakfast', hint: 'Morning meal', examples: [{ de: 'Wir frühstücken zusammen.', en: 'We have breakfast together.' }] },
      { de: 'essen', en: 'to eat', hint: 'Consume food', examples: [{ de: 'Was isst du gerne?', en: 'What do you like to eat?' }] },
      { de: 'trinken', en: 'to drink', hint: 'Consume liquids', examples: [{ de: 'Ich trinke Wasser.', en: 'I drink water.' }] },
      { de: 'kochen', en: 'to cook', hint: 'Prepare food', examples: [{ de: 'Er kocht das Abendessen.', en: 'He is cooking dinner.' }] },
      { de: 'backen', en: 'to bake', hint: 'Make bread/cake', examples: [{ de: 'Sie backt einen Kuchen.', en: 'She is baking a cake.' }] },
      { de: 'einkaufen', en: 'to shop', hint: 'Buy things', examples: [{ de: 'Ich kaufe im Supermarkt ein.', en: 'I shop at the supermarket.' }] },
      { de: 'bezahlen', en: 'to pay', hint: 'Give money', examples: [{ de: 'Ich bezahle mit Karte.', en: 'I pay by card.' }] },
      { de: 'kosten', en: 'to cost', hint: 'Price of something', examples: [{ de: 'Wie viel kostet das?', en: 'How much does that cost?' }] },
      { de: 'nehmen', en: 'to take', hint: 'To grab', examples: [{ de: 'Ich nehme den Bus.', en: 'I take the bus.' }] },
      { de: 'geben', en: 'to give', hint: 'Hand over', examples: [{ de: 'Kannst du mir das Buch geben?', en: 'Can you give me the book?' }] },
      { de: 'suchen', en: 'to look for, to search', hint: 'Trying to find', examples: [{ de: 'Ich suche meinen Schlüssel.', en: 'I\'m looking for my key.' }] },
      { de: 'finden', en: 'to find', hint: 'Locate something', examples: [{ de: 'Ich finde den Bahnhof nicht.', en: 'I can\'t find the train station.' }] },
      { de: 'sehen', en: 'to see', hint: 'With your eyes', examples: [{ de: 'Ich sehe einen Vogel.', en: 'I see a bird.' }] },
      { de: 'hören', en: 'to hear', hint: 'With your ears', examples: [{ de: 'Ich höre Musik.', en: 'I listen to music.' }] },
      { de: 'sagen', en: 'to say', hint: 'Speak words', examples: [{ de: 'Er sagt "Hallo".', en: 'He says "hello".' }] },
      { de: 'sprechen', en: 'to speak', hint: 'Talk a language', examples: [{ de: 'Ich spreche Deutsch.', en: 'I speak German.' }] },
      { de: 'verstehen', en: 'to understand', hint: 'Comprehend', examples: [{ de: 'Verstehst du mich?', en: 'Do you understand me?' }] },
      { de: 'fragen', en: 'to ask', hint: 'Pose a question', examples: [{ de: 'Ich frage den Lehrer.', en: 'I ask the teacher.' }] },
      { de: 'antworten', en: 'to answer', hint: 'Respond to a question', examples: [{ de: 'Er antwortet auf die Frage.', en: 'He answers the question.' }] },
      { de: 'helfen', en: 'to help', hint: 'Assist someone', examples: [{ de: 'Kannst du mir helfen?', en: 'Can you help me?' }] },
      { de: 'danken', en: 'to thank', hint: 'Show gratitude', examples: [{ de: 'Ich danke dir!', en: 'I thank you!' }] },
      { de: 'lernen', en: 'to learn', hint: 'Study new things', examples: [{ de: 'Ich lerne Vokabeln.', en: 'I learn vocabulary.' }] },
      { de: 'studieren', en: 'to study (at university)', hint: 'Higher education', examples: [{ de: 'Er studiert Medizin.', en: 'He studies medicine.' }] },
      { de: 'lesen', en: 'to read', hint: 'Read a book/text', examples: [{ de: 'Ich lese ein Buch.', en: 'I am reading a book.' }] },
      { de: 'schreiben', en: 'to write', hint: 'Put text on paper', examples: [{ de: 'Sie schreibt eine E-Mail.', en: 'She is writing an email.' }] },
      { de: 'rechnen', en: 'to calculate', hint: 'Do math', examples: [{ de: 'Er rechnet die Zahlen.', en: 'He calculates the numbers.' }] },
      { de: 'zahlen', en: 'to pay', hint: 'Give money', examples: [{ de: 'Ich zahle bar.', en: 'I pay cash.' }] },
      { de: 'spielen', en: 'to play', hint: 'Games or fun', examples: [{ de: 'Die Kinder spielen im Park.', en: 'The children play in the park.' }] },
      { de: 'arbeiten', en: 'to work', hint: 'Do a job', examples: [{ de: 'Ich arbeite in einem Büro.', en: 'I work in an office.' }] },
      { de: 'wohnen', en: 'to live, to reside', hint: 'Where your home is', examples: [{ de: 'Ich wohne in Berlin.', en: 'I live in Berlin.' }] },
      { de: 'leben', en: 'to live', hint: 'Be alive', examples: [{ de: 'Er lebt in Deutschland.', en: 'He lives in Germany.' }] },
      { de: 'reisen', en: 'to travel', hint: 'Go on trips', examples: [{ de: 'Wir reisen gerne.', en: 'We like to travel.' }] },
      { de: 'wandern', en: 'to hike', hint: 'Walk in nature', examples: [{ de: 'Im Sommer wandern wir.', en: 'In summer we hike.' }] },
      { de: 'schwimmen', en: 'to swim', hint: 'In water', examples: [{ de: 'Kannst du schwimmen?', en: 'Can you swim?' }] },
      { de: 'fotografieren', en: 'to take photos', hint: 'Use a camera', examples: [{ de: 'Ich fotografiere die Natur.', en: 'I photograph nature.' }] },
      { de: 'fernsehen', en: 'to watch TV', hint: 'TV viewing', examples: [{ de: 'Abends sehe ich fern.', en: 'In the evenings I watch TV.' }] },
      { de: 'Musik hören', en: 'to listen to music', hint: 'Enjoy music', examples: [{ de: 'Ich höre gerne Musik.', en: 'I like listening to music.' }] },
      { de: 'tanzen', en: 'to dance', hint: 'Move to music', examples: [{ de: 'Sie tanzt sehr gut.', en: 'She dances very well.' }] },
      { de: 'singen', en: 'to sing', hint: 'Make music with voice', examples: [{ de: 'Er singt ein Lied.', en: 'He is singing a song.' }] },
      { de: 'feiern', en: 'to celebrate', hint: 'Have a party', examples: [{ de: 'Wir feiern meinen Geburtstag.', en: 'We celebrate my birthday.' }] },
      { de: 'sich treffen', en: 'to meet', hint: 'Meet with people', examples: [{ de: 'Ich treffe mich mit Freunden.', en: 'I meet with friends.' }] },
      { de: 'warten', en: 'to wait', hint: 'Stay until something happens', examples: [{ de: 'Ich warte auf den Bus.', en: 'I am waiting for the bus.' }] },
      { de: 'anrufen', en: 'to call', hint: 'Phone someone', examples: [{ de: 'Ich rufe meine Mutter an.', en: 'I call my mother.' }] },
      { de: 'klingeln', en: 'to ring', hint: 'Bell or phone', examples: [{ de: 'Das Telefon klingelt.', en: 'The phone is ringing.' }] },
      { de: 'öffnen', en: 'to open', hint: 'Unlock or open', examples: [{ de: 'Kannst du die Tür öffnen?', en: 'Can you open the door?' }] },
      { de: 'schließen', en: 'to close', hint: 'Shut', examples: [{ de: 'Bitte schließe das Fenster.', en: 'Please close the window.' }] },
      { de: 'machen', en: 'to make, to do', hint: 'Very common verb', examples: [{ de: 'Was machst du?', en: 'What are you doing?' }] },
      { de: 'tun', en: 'to do', hint: 'Synonym for machen', examples: [{ de: 'Was tust du da?', en: 'What are you doing there?' }] },
      { de: 'lassen', en: 'to let, to leave', hint: 'Allow or leave', examples: [{ de: 'Lass mich in Ruhe!', en: 'Leave me alone!' }] },
      { de: 'legen', en: 'to lay, put down flat', hint: 'Place horizontally', examples: [{ de: 'Ich lege das Buch auf den Tisch.', en: 'I put the book on the table.' }] },
      { de: 'stellen', en: 'to put upright', hint: 'Place vertically', examples: [{ de: 'Ich stelle die Vase auf den Tisch.', en: 'I put the vase on the table.' }] },
      { de: 'hängen', en: 'to hang', hint: 'Put on a hook', examples: [{ de: 'Ich hänge das Bild an die Wand.', en: 'I hang the picture on the wall.' }] },
      { de: 'holen', en: 'to fetch, to get', hint: 'Go and bring', examples: [{ de: 'Ich hole Brot vom Bäcker.', en: 'I get bread from the baker.' }] },
      { de: 'bringen', en: 'to bring', hint: 'Carry something to a place', examples: [{ de: 'Bringst du mir ein Glas Wasser?', en: 'Can you bring me a glass of water?' }] },
      { de: 'nehmen', en: 'to take', hint: 'Hold', examples: [{ de: 'Nehmen Sie Platz.', en: 'Please take a seat.' }] },
      { de: 'brauchen', en: 'to need', hint: 'Require', examples: [{ de: 'Ich brauche Hilfe.', en: 'I need help.' }] },
      { de: 'kaufen', en: 'to buy', hint: 'Purchase', examples: [{ de: 'Ich kaufe ein Brot.', en: 'I buy a bread.' }] },
      { de: 'verkaufen', en: 'to sell', hint: 'Opposite of buy', examples: [{ de: 'Er verkauft sein Auto.', en: 'He sells his car.' }] },
      { de: 'schenken', en: 'to give as a gift', hint: 'Present', examples: [{ de: 'Ich schenke ihr Blumen.', en: 'I give her flowers as a gift.' }] },
      { de: 'gewinnen', en: 'to win', hint: 'Be victorious', examples: [{ de: 'Unser Team gewinnt das Spiel.', en: 'Our team wins the game.' }] },
      { de: 'verlieren', en: 'to lose', hint: 'Not win', examples: [{ de: 'Ich verliere oft meine Schlüssel.', en: 'I often lose my keys.' }] },
      { de: 'sich freuen', en: 'to be glad, to look forward', hint: 'Positive emotion', examples: [{ de: 'Ich freue mich auf das Wochenende.', en: 'I\'m looking forward to the weekend.' }] },
      { de: 'sich ärgern', en: 'to be annoyed', hint: 'Negative emotion', examples: [{ de: 'Er ärgert sich über den Stau.', en: 'He is annoyed about the traffic jam.' }] },
      { de: 'hoffen', en: 'to hope', hint: 'Wish for something', examples: [{ de: 'Ich hoffe, es regnet nicht.', en: 'I hope it doesn\'t rain.' }] },
      { de: 'glauben', en: 'to believe', hint: 'Think something is true', examples: [{ de: 'Ich glaube, er hat recht.', en: 'I believe he is right.' }] },
      { de: 'wissen', en: 'to know (a fact)', hint: 'Have knowledge', examples: [{ de: 'Ich weiß die Antwort.', en: 'I know the answer.' }] },
      { de: 'kennen', en: 'to know (a person/place)', hint: 'Be acquainted with', examples: [{ de: 'Kennst du Maria?', en: 'Do you know Maria?' }] },
      { de: 'passieren', en: 'to happen', hint: 'An event occurs', examples: [{ de: 'Was ist passiert?', en: 'What happened?' }] },
      { de: 'stimmen', en: 'to be correct', hint: 'Right or true', examples: [{ de: 'Das stimmt nicht.', en: 'That\'s not correct.' }] },
      { de: 'fehlen', en: 'to be missing, to lack', hint: 'Not present', examples: [{ de: 'Mir fehlt mein Schlüssel.', en: 'I am missing my key.' }] },
      { de: 'passen', en: 'to fit', hint: 'Clothes size', examples: [{ de: 'Die Schuhe passen mir gut.', en: 'The shoes fit me well.' }] },
      { de: 'gefallen', en: 'to like, to be pleasing', hint: 'Something is pleasing', examples: [{ de: 'Die Stadt gefällt mir.', en: 'I like the city.' }] },
      { de: 'schmecken', en: 'to taste', hint: 'Flavor', examples: [{ de: 'Das Essen schmeckt gut.', en: 'The food tastes good.' }] },
      { de: 'anfangen', en: 'to begin', hint: 'Start something', examples: [{ de: 'Der Film fängt um acht an.', en: 'The movie starts at eight.' }] },
      { de: 'aufhören', en: 'to stop', hint: 'Cease', examples: [{ de: 'Hör auf zu lachen!', en: 'Stop laughing!' }] },
      { de: 'weitergehen', en: 'to continue', hint: 'Keep going', examples: [{ de: 'Gehen wir weiter!', en: 'Let\'s continue!' }] },
      { de: 'mitnehmen', en: 'to take along', hint: 'Bring with you', examples: [{ de: 'Ich nehme meinen Regenschirm mit.', en: 'I take my umbrella along.' }] },
      { de: 'mitbringen', en: 'to bring along', hint: 'Bring to a place', examples: [{ de: 'Bring etwas zu essen mit!', en: 'Bring something to eat along!' }] },
      { de: 'einladen', en: 'to invite', hint: 'Ask someone to come', examples: [{ de: 'Ich lade dich zu meiner Party ein.', en: 'I invite you to my party.' }] },
      { de: 'ausgehen', en: 'to go out', hint: 'Leave home for fun', examples: [{ de: 'Samstag gehen wir aus.', en: 'Saturday we go out.' }] },
      { de: 'zurückkommen', en: 'to come back', hint: 'Return', examples: [{ de: 'Wann kommst du zurück?', en: 'When are you coming back?' }] },
      { de: 'stattfinden', en: 'to take place', hint: 'An event occurs', examples: [{ de: 'Das Konzert findet am Samstag statt.', en: 'The concert takes place on Saturday.' }] },
      { de: 'krank sein', en: 'to be sick', hint: 'Not healthy', examples: [{ de: 'Ich bin krank und muss zu Hause bleiben.', en: 'I am sick and have to stay home.' }] },
      { de: 'gesund sein', en: 'to be healthy', hint: 'In good health', examples: [{ de: 'Sport ist wichtig, um gesund zu sein.', en: 'Sports are important to be healthy.' }] },
      { de: 'Hunger haben', en: 'to be hungry', hint: 'Need food', examples: [{ de: 'Ich habe Hunger. Wann essen wir?', en: 'I am hungry. When do we eat?' }] },
      { de: 'Durst haben', en: 'to be thirsty', hint: 'Need drink', examples: [{ de: 'Ich habe Durst. Hast du Wasser?', en: 'I am thirsty. Do you have water?' }] },
      { de: 'Zeit haben', en: 'to have time', hint: 'Be available', examples: [{ de: 'Hast du morgen Zeit?', en: 'Do you have time tomorrow?' }] },
      { de: 'Langeweile haben', en: 'to be bored', hint: 'Nothing to do', examples: [{ de: 'Am Sonntag habe ich oft Langeweile.', en: 'On Sunday I am often bored.' }] },
      { de: 'Angst haben', en: 'to be afraid', hint: 'Feel fear', examples: [{ de: 'Ich habe Angst vor Hunden.', en: 'I am afraid of dogs.' }] },
      { de: 'Glück haben', en: 'to be lucky', hint: 'Good fortune', examples: [{ de: 'Ich habe Glück, ich habe gewonnen!', en: 'I am lucky, I won!' }] },
      { de: 'Pech haben', en: 'to be unlucky', hint: 'Bad luck', examples: [{ de: 'Ich habe Pech, der Bus ist weg.', en: 'I am unlucky, the bus is gone.' }] },
      { de: 'schon', en: 'already', hint: 'Earlier than expected', examples: [{ de: 'Bist du schon fertig?', en: 'Are you already done?' }] },
      { de: 'noch', en: 'still, yet', hint: 'Continuing up to now', examples: [{ de: 'Ich warte noch auf den Bus.', en: 'I am still waiting for the bus.' }] },
      { de: 'erst', en: 'only, not until', hint: 'Time marker', examples: [{ de: 'Er ist erst 18 Jahre alt.', en: 'He is only 18 years old.' }] },
      { de: 'nicht mehr', en: 'no longer', hint: 'Something stopped', examples: [{ de: 'Ich wohne nicht mehr in Berlin.', en: 'I no longer live in Berlin.' }] },
      { de: 'nie', en: 'never', hint: 'At no time', examples: [{ de: 'Ich trinke nie Alkohol.', en: 'I never drink alcohol.' }] },
      { de: 'immer', en: 'always', hint: 'All the time', examples: [{ de: 'Ich bin immer pünktlich.', en: 'I am always on time.' }] },
      { de: 'oft', en: 'often', hint: 'Frequently', examples: [{ de: 'Wir gehen oft ins Kino.', en: 'We often go to the cinema.' }] },
      { de: 'manchmal', en: 'sometimes', hint: 'Not always, not never', examples: [{ de: 'Manchmal koche ich, manchmal nicht.', en: 'Sometimes I cook, sometimes not.' }] },
      { de: 'selten', en: 'rarely', hint: 'Not often', examples: [{ de: 'Ich sehe selten fern.', en: 'I rarely watch TV.' }] },
      { de: 'gern', en: 'gladly, with pleasure', hint: 'Liking an activity', examples: [{ de: 'Ich spiele gern Fußball.', en: 'I like playing soccer.' }] },
      { de: 'vielleicht', en: 'maybe', hint: 'Possibly', examples: [{ de: 'Vielleicht komme ich morgen.', en: 'Maybe I\'ll come tomorrow.' }] },
      { de: 'sofort', en: 'immediately', hint: 'Right now', examples: [{ de: 'Komm sofort hierher!', en: 'Come here immediately!' }] },
      { de: 'gleich', en: 'soon, in a moment', hint: 'Shortly', examples: [{ de: 'Ich komme gleich.', en: 'I\'ll come in a moment.' }] },
      { de: 'ganz', en: 'quite, completely', hint: 'Intensifier', examples: [{ de: 'Das ist ganz toll!', en: 'That is quite great!' }] },
      { de: 'sehr', en: 'very', hint: 'Intensifier', examples: [{ de: 'Das finde ich sehr gut.', en: 'I find that very good.' }] },
      { de: 'wirklich', en: 'really', hint: 'Truly', examples: [{ de: 'Bist du wirklich sicher?', en: 'Are you really sure?' }] },
      { de: 'auch', en: 'also, too', hint: 'In addition', examples: [{ de: 'Ich komme auch zur Party.', en: 'I\'m also coming to the party.' }] },
      { de: 'nur', en: 'only', hint: 'Just, merely', examples: [{ de: 'Ich habe nur fünf Euro.', en: 'I only have five euros.' }] },
      { de: 'aber', en: 'but', hint: 'Contrast', examples: [{ de: 'Ich bin müde, aber ich kann nicht schlafen.', en: 'I am tired, but I can\'t sleep.' }] },
      { de: 'oder', en: 'or', hint: 'Alternative', examples: [{ de: 'Möchtest du Tee oder Kaffee?', en: 'Would you like tea or coffee?' }] },
      { de: 'denn', en: 'because', hint: 'Giving reason', examples: [{ de: 'Ich gehe nicht, denn ich bin krank.', en: 'I am not going, because I am sick.' }] },
      { de: 'und', en: 'and', hint: 'Connecting words', examples: [{ de: 'Ich trinke Kaffee und esse Kuchen.', en: 'I drink coffee and eat cake.' }] },
      { de: 'sondern', en: 'but rather', hint: 'Contradiction after negative', examples: [{ de: 'Nicht ich, sondern er kommt.', en: 'Not me, but rather he is coming.' }] },
      { de: 'dass', en: 'that', hint: 'Connecting clause', examples: [{ de: 'Ich denke, dass du recht hast.', en: 'I think that you are right.' }] },
      { de: 'ob', en: 'if, whether', hint: 'Indirect question', examples: [{ de: 'Ich weiß nicht, ob er kommt.', en: 'I don\'t know if he is coming.' }] },

      // Food & Drink (100)
      { de: 'das Essen', en: 'food', hint: 'General term', examples: [{ de: 'Das Essen ist fertig.', en: 'The food is ready.' }] },
      { de: 'das Frühstück', en: 'breakfast', hint: 'First meal', examples: [{ de: 'Zum Frühstück esse ich Müsli.', en: 'For breakfast I eat cereal.' }] },
      { de: 'das Mittagessen', en: 'lunch', hint: 'Midday meal', examples: [{ de: 'Das Mittagessen gibt es um 12 Uhr.', en: 'Lunch is at 12 o\'clock.' }] },
      { de: 'das Abendessen', en: 'dinner', hint: 'Evening meal', examples: [{ de: 'Zum Abendessen gibt es Suppe.', en: 'For dinner there is soup.' }] },
      { de: 'das Brot', en: 'bread', hint: 'Staple food', examples: [{ de: 'Ich kaufe ein Brot vom Bäcker.', en: 'I buy a loaf of bread from the baker.' }] },
      { de: 'die Brötchen', en: 'bread rolls', hint: 'Small bread', examples: [{ de: 'Möchtest du ein Brötchen mit Käse?', en: 'Would you like a roll with cheese?' }] },
      { de: 'der Käse', en: 'cheese', hint: 'Dairy product', examples: [{ de: 'Ich esse gerne Käse auf Brot.', en: 'I like to eat cheese on bread.' }] },
      { de: 'die Wurst', en: 'sausage', hint: 'Cold cuts', examples: [{ de: 'Eine Scheibe Wurst, bitte.', en: 'A slice of sausage, please.' }] },
      { de: 'der Schinken', en: 'ham', hint: 'Meat product', examples: [{ de: 'Pizza mit Schinken.', en: 'Ham pizza.' }] },
      { de: 'das Ei', en: 'egg', hint: 'From chicken', examples: [{ de: 'Ich esse ein Ei zum Frühstück.', en: 'I eat an egg for breakfast.' }] },
      { de: 'der Joghurt', en: 'yogurt', hint: 'Dairy', examples: [{ de: 'Magst du Joghurt mit Früchten?', en: 'Do you like yogurt with fruit?' }] },
      { de: 'die Milch', en: 'milk', hint: 'White drink', examples: [{ de: 'Ich trinke Milch zum Müsli.', en: 'I drink milk with cereal.' }] },
      { de: 'der Kaffee', en: 'coffee', hint: 'Hot drink', examples: [{ de: 'Einen Kaffee, bitte.', en: 'A coffee, please.' }] },
      { de: 'der Tee', en: 'tea', hint: 'Hot drink', examples: [{ de: 'Trinkst du Tee mit Zucker?', en: 'Do you drink tea with sugar?' }] },
      { de: 'der Saft', en: 'juice', hint: 'From fruit', examples: [{ de: 'Ein Glas Apfelsaft, bitte.', en: 'A glass of apple juice, please.' }] },
      { de: 'das Wasser', en: 'water', hint: 'Still or sparkling', examples: [{ de: 'Ich trinke viel Wasser.', en: 'I drink a lot of water.' }] },
      { de: 'die Limonade', en: 'lemonade', hint: 'Sweet fizzy drink', examples: [{ de: 'Die Limonade ist sehr süß.', en: 'The lemonade is very sweet.' }] },
      { de: 'das Bier', en: 'beer', hint: 'Alcoholic drink', examples: [{ de: 'Ein Bier, bitte.', en: 'A beer, please.' }] },
      { de: 'der Wein', en: 'wine', hint: 'Alcoholic', examples: [{ de: 'Rotwein oder Weißwein?', en: 'Red wine or white wine?' }] },
      { de: 'der Apfel', en: 'apple', hint: 'Fruit', examples: [{ de: 'Ein Apfel am Tag hält den Arzt fern.', en: 'An apple a day keeps the doctor away.' }] },
      { de: 'die Banane', en: 'banana', hint: 'Yellow fruit', examples: [{ de: 'Bananen sind reich an Kalium.', en: 'Bananas are rich in potassium.' }] },
      { de: 'die Orange', en: 'orange', hint: 'Citrus fruit', examples: [{ de: 'Ich presse Orangen für Saft aus.', en: 'I squeeze oranges for juice.' }] },
      { de: 'die Erdbeere', en: 'strawberry', hint: 'Red berry', examples: [{ de: 'Erdbeeren mit Sahne.', en: 'Strawberries with cream.' }] },
      { de: 'die Zitrone', en: 'lemon', hint: 'Sour yellow fruit', examples: [{ de: 'Zitrone im Tee ist gut.', en: 'Lemon in tea is good.' }] },
      { de: 'das Gemüse', en: 'vegetables', hint: 'Healthy greens', examples: [{ de: 'Du solltest mehr Gemüse essen.', en: 'You should eat more vegetables.' }] },
      { de: 'die Tomate', en: 'tomato', hint: 'Red veggie', examples: [{ de: 'Tomaten sind rot.', en: 'Tomatoes are red.' }] },
      { de: 'die Kartoffel', en: 'potato', hint: 'Starchy vegetable', examples: [{ de: 'Kartoffeln kann man kochen oder braten.', en: 'You can boil or fry potatoes.' }] },
      { de: 'die Zwiebel', en: 'onion', hint: 'Makes you cry', examples: [{ de: 'Zwiebeln geben dem Essen Geschmack.', en: 'Onions give flavor to food.' }] },
      { de: 'der Salat', en: 'lettuce, salad', hint: 'Green dish', examples: [{ de: 'Einen gemischten Salat, bitte.', en: 'A mixed salad, please.' }] },
      { de: 'die Gurke', en: 'cucumber', hint: 'Green vegetable', examples: [{ de: 'Gurke im Salat ist erfrischend.', en: 'Cucumber in salad is refreshing.' }] },
      { de: 'die Karotte', en: 'carrot', hint: 'Orange vegetable', examples: [{ de: 'Karotten sind gut für die Augen.', en: 'Carrots are good for the eyes.' }] },
      { de: 'der Pilz', en: 'mushroom', hint: 'Fungus', examples: [{ de: 'Pilze in der Pfanne mit Butter.', en: 'Mushrooms in the pan with butter.' }] },
      { de: 'das Fleisch', en: 'meat', hint: 'Animal protein', examples: [{ de: 'Ich esse kein Fleisch.', en: 'I don\'t eat meat.' }] },
      { de: 'das Huhn', en: 'chicken', hint: 'Poultry', examples: [{ de: 'Hühnerfleisch ist mager.', en: 'Chicken meat is lean.' }] },
      { de: 'das Rindfleisch', en: 'beef', hint: 'From cow', examples: [{ de: 'Rindfleisch für den Sonntagsbraten.', en: 'Beef for the Sunday roast.' }] },
      { de: 'das Schweinefleisch', en: 'pork', hint: 'From pig', examples: [{ de: 'In Deutschland isst man viel Schweinefleisch.', en: 'In Germany, people eat a lot of pork.' }] },
      { de: 'der Fisch', en: 'fish', hint: 'From water', examples: [{ de: 'Fisch ist gesund.', en: 'Fish is healthy.' }] },
      { de: 'die Suppe', en: 'soup', hint: 'Liquid food', examples: [{ de: 'Eine Tomatensuppe, bitte.', en: 'A tomato soup, please.' }] },
      { de: 'die Nudeln', en: 'noodles, pasta', hint: 'Italian/German staple', examples: [{ de: 'Nudeln mit Tomatensoße.', en: 'Pasta with tomato sauce.' }] },
      { de: 'der Reis', en: 'rice', hint: 'Grain', examples: [{ de: 'Reis passt gut zu Curry.', en: 'Rice goes well with curry.' }] },
      { de: 'die Pizza', en: 'pizza', hint: 'Italian dish', examples: [{ de: 'Wir bestellen eine Pizza.', en: 'We order a pizza.' }] },
      { de: 'der Burger', en: 'burger', hint: 'Fast food', examples: [{ de: 'Ein Cheeseburger mit Pommes.', en: 'A cheeseburger with fries.' }] },
      { de: 'die Pommes', en: 'fries', hint: 'Fried potatoes', examples: [{ de: 'Pommes mit Ketchup.', en: 'Fries with ketchup.' }] },
      { de: 'der Kuchen', en: 'cake', hint: 'Sweet baked good', examples: [{ de: 'Zum Geburtstag gibt es Kuchen.', en: 'There is cake for the birthday.' }] },
      { de: 'der Apfelkuchen', en: 'apple cake', hint: 'Classic dessert', examples: [{ de: 'Apfelkuchen mit Sahne.', en: 'Apple cake with cream.' }] },
      { de: 'die Schokolade', en: 'chocolate', hint: 'Sweet treat', examples: [{ de: 'Ich liebe Schokolade.', en: 'I love chocolate.' }] },
      { de: 'das Eis', en: 'ice cream', hint: 'Cold dessert', examples: [{ de: 'Ein Eis bitte, Erdbeere.', en: 'An ice cream, please, strawberry.' }] },
      { de: 'der Zucker', en: 'sugar', hint: 'Sweetener', examples: [{ de: 'Ich nehme Zucker im Kaffee.', en: 'I take sugar in my coffee.' }] },
      { de: 'das Salz', en: 'salt', hint: 'Seasoning', examples: [{ de: 'Bitte das Salz geben.', en: 'Please pass the salt.' }] },
      { de: 'der Pfeffer', en: 'pepper', hint: 'Spice', examples: [{ de: 'Mit Pfeffer würzen.', en: 'Season with pepper.' }] },
      { de: 'das Öl', en: 'oil', hint: 'For cooking', examples: [{ de: 'Olivenöl ist gesund.', en: 'Olive oil is healthy.' }] },
      { de: 'die Butter', en: 'butter', hint: 'Dairy fat', examples: [{ de: 'Butter auf das Brot streichen.', en: 'Spread butter on the bread.' }] },
      { de: 'das Frühstück', en: 'breakfast', hint: 'Morning meal', examples: [{ de: 'Was isst du zum Frühstück?', en: 'What do you eat for breakfast?' }] },
      { de: 'der Löffel', en: 'spoon', hint: 'For soup', examples: [{ de: 'Kannst du mir einen Löffel geben?', en: 'Can you give me a spoon?' }] },
      { de: 'die Gabel', en: 'fork', hint: 'For eating', examples: [{ de: 'Die Gabel liegt links.', en: 'The fork is on the left.' }] },
      { de: 'das Messer', en: 'knife', hint: 'For cutting', examples: [{ de: 'Das Messer ist scharf.', en: 'The knife is sharp.' }] },
      { de: 'der Teller', en: 'plate', hint: 'For serving food', examples: [{ de: 'Der Teller ist leer.', en: 'The plate is empty.' }] },
      { de: 'die Tasse', en: 'cup', hint: 'For coffee/tea', examples: [{ de: 'Eine Tasse Kaffee.', en: 'A cup of coffee.' }] },
      { de: 'das Glas', en: 'glass', hint: 'For water/juice', examples: [{ de: 'Ein Glas Wasser.', en: 'A glass of water.' }] },
      { de: 'die Flasche', en: 'bottle', hint: 'For drinks', examples: [{ de: 'Eine Flasche Bier.', en: 'A bottle of beer.' }] },
      { de: 'die Speisekarte', en: 'menu', hint: 'List of food', examples: [{ de: 'Die Speisekarte, bitte.', en: 'The menu, please.' }] },
      { de: 'die Vorspeise', en: 'starter', hint: 'First course', examples: [{ de: 'Als Vorspeise nehme ich eine Suppe.', en: 'As a starter, I\'ll have soup.' }] },
      { de: 'die Hauptspeise', en: 'main course', hint: 'Main dish', examples: [{ de: 'Die Hauptspeise ist Schnitzel.', en: 'The main course is schnitzel.' }] },
      { de: 'die Nachspeise', en: 'dessert', hint: 'Sweet end', examples: [{ de: 'Als Nachspeise gibt es Eis.', en: 'For dessert, there is ice cream.' }] },
      { de: 'das Getränk', en: 'drink', hint: 'Beverage', examples: [{ de: 'Was möchten Sie trinken?', en: 'What would you like to drink?' }] },
      { de: 'die Spezialität', en: 'specialty', hint: 'Local dish', examples: [{ de: 'Die Spezialität hier ist Sauerkraut.', en: 'The specialty here is sauerkraut.' }] },
      { de: 'das Schnitzel', en: 'schnitzel', hint: 'Breaded meat', examples: [{ de: 'Ein Schnitzel mit Pommes.', en: 'A schnitzel with fries.' }] },
      { de: 'die Bratwurst', en: 'fried sausage', hint: 'German classic', examples: [{ de: 'Eine Bratwurst mit Senf.', en: 'A fried sausage with mustard.' }] },
      { de: 'das Sauerkraut', en: 'sauerkraut', hint: 'Fermented cabbage', examples: [{ de: 'Sauerkraut passt zu Würstchen.', en: 'Sauerkraut goes with sausages.' }] },
      { de: 'der Senf', en: 'mustard', hint: 'Yellow condiment', examples: [{ de: 'Senf zur Wurst.', en: 'Mustard with the sausage.' }] },
      { de: 'das Müsli', en: 'cereal', hint: 'Breakfast mix', examples: [{ de: 'Ich esse Müsli mit Milch.', en: 'I eat cereal with milk.' }] },
      { de: 'der Honig', en: 'honey', hint: 'Sweet from bees', examples: [{ de: 'Honig im Tee.', en: 'Honey in tea.' }] },
      { de: 'die Marmelade', en: 'jam', hint: 'Fruit spread', examples: [{ de: 'Marmelade aufs Brot.', en: 'Jam on bread.' }] },
      { de: 'die Nuss', en: 'nut', hint: 'Snack', examples: [{ de: 'Ich esse gerne Nüsse.', en: 'I like to eat nuts.' }] },
      { de: 'die Kartoffelsuppe', en: 'potato soup', hint: 'Creamy soup', examples: [{ de: 'Kartoffelsuppe ist ein traditionelles Gericht.', en: 'Potato soup is a traditional dish.' }] },
      { de: 'die Erbse', en: 'pea', hint: 'Small green veg', examples: [{ de: 'Erbsen und Karotten.', en: 'Peas and carrots.' }] },
      { de: 'der Mais', en: 'corn', hint: 'Yellow kernels', examples: [{ de: 'Mais auf der Pizza.', en: 'Corn on the pizza.' }] },
      { de: 'der Pfannkuchen', en: 'pancake', hint: 'Fried batter', examples: [{ de: 'Pfannkuchen mit Apfelmus.', en: 'Pancakes with applesauce.' }] },
      { de: 'das Omelett', en: 'omelette', hint: 'Egg dish', examples: [{ de: 'Ein Omelett mit Käse.', en: 'A cheese omelette.' }] },
      { de: 'der Toast', en: 'toast', hint: 'Grilled bread', examples: [{ de: 'Toast mit Butter.', en: 'Toast with butter.' }] },
      { de: 'das Sandwich', en: 'sandwich', hint: 'Two slices of bread with filling', examples: [{ de: 'Ein Sandwich mit Hähnchen.', en: 'A chicken sandwich.' }] },
      { de: 'die Brezel', en: 'pretzel', hint: 'Baked knot', examples: [{ de: 'Eine Brezel vom Bäcker.', en: 'A pretzel from the bakery.' }] },
      { de: 'die Currywurst', en: 'curry sausage', hint: 'Berlin fast food', examples: [{ de: 'Currywurst mit Pommes.', en: 'Curry sausage with fries.' }] },
      { de: 'der Döner', en: 'doner kebab', hint: 'Turkish-German fast food', examples: [{ de: 'Einen Döner mit alles, bitte.', en: 'A doner with everything, please.' }] },
      { de: 'der Eintopf', en: 'stew', hint: 'One-pot meal', examples: [{ de: 'Im Winter esse ich gerne Eintopf.', en: 'In winter, I like to eat stew.' }] },
      { de: 'der Quark', en: 'quark', hint: 'Dairy product like cream cheese', examples: [{ de: 'Quark mit Kräutern.', en: 'Quark with herbs.' }] },
      { de: 'die Klöße', en: 'dumplings', hint: 'Potato or bread balls', examples: [{ de: 'Klöße mit Braten.', en: 'Dumplings with roast meat.' }] },
      { de: 'der Rotkohl', en: 'red cabbage', hint: 'Sour side dish', examples: [{ de: 'Rotkohl zum Braten.', en: 'Red cabbage with roast meat.' }] },
      { de: 'der Spargel', en: 'asparagus', hint: 'Seasonal vegetable', examples: [{ de: 'Weißer Spargel mit Sauce Hollandaise.', en: 'White asparagus with hollandaise sauce.' }] },
      { de: 'die Kräuter', en: 'herbs', hint: 'Flavorful greens', examples: [{ de: 'Frische Kräuter im Salat.', en: 'Fresh herbs in the salad.' }] },
      { de: 'die Gewürze', en: 'spices', hint: 'For seasoning', examples: [{ de: 'Gewürze geben dem Essen Geschmack.', en: 'Spices give flavor to food.' }] },
      { de: 'bitter', en: 'bitter', hint: 'Taste', examples: [{ de: 'Schwarzer Kaffee ist bitter.', en: 'Black coffee is bitter.' }] },
      { de: 'süß', en: 'sweet', hint: 'Taste', examples: [{ de: 'Schokolade ist süß.', en: 'Chocolate is sweet.' }] },
      { de: 'sauer', en: 'sour', hint: 'Taste', examples: [{ de: 'Zitronen sind sauer.', en: 'Lemons are sour.' }] },
      { de: 'salzig', en: 'salty', hint: 'Taste', examples: [{ de: 'Pommes sind salzig.', en: 'Fries are salty.' }] },
      { de: 'scharf', en: 'spicy', hint: 'Hot taste', examples: [{ de: 'Curry ist scharf.', en: 'Curry is spicy.' }] },
      { de: 'fettig', en: 'greasy', hint: 'Oily', examples: [{ de: 'Pommes sind fettig.', en: 'Fries are greasy.' }] },
      { de: 'frisch', en: 'fresh', hint: 'Not old', examples: [{ de: 'Das Brot ist frisch.', en: 'The bread is fresh.' }] },
      { de: 'laktosefrei', en: 'lactose-free', hint: 'No milk sugar', examples: [{ de: 'Ich brauche laktosefreie Milch.', en: 'I need lactose-free milk.' }] },

      // House, Home & Furniture (80)
      { de: 'das Haus', en: 'house', hint: 'Building for living', examples: [{ de: 'Wir wohnen in einem Haus.', en: 'We live in a house.' }] },
      { de: 'die Wohnung', en: 'apartment', hint: 'Flat', examples: [{ de: 'Unsere Wohnung ist im dritten Stock.', en: 'Our apartment is on the third floor.' }] },
      { de: 'das Zimmer', en: 'room', hint: 'A room in a house', examples: [{ de: 'Mein Zimmer ist klein.', en: 'My room is small.' }] },
      { de: 'das Wohnzimmer', en: 'living room', hint: 'For relaxing', examples: [{ de: 'Im Wohnzimmer steht ein Sofa.', en: 'There is a sofa in the living room.' }] },
      { de: 'das Schlafzimmer', en: 'bedroom', hint: 'For sleeping', examples: [{ de: 'Im Schlafzimmer ist ein Bett.', en: 'There is a bed in the bedroom.' }] },
      { de: 'die Küche', en: 'kitchen', hint: 'For cooking', examples: [{ de: 'In der Küche koche ich.', en: 'In the kitchen, I cook.' }] },
      { de: 'das Badezimmer', en: 'bathroom', hint: 'For bathing', examples: [{ de: 'Das Badezimmer hat eine Dusche.', en: 'The bathroom has a shower.' }] },
      { de: 'die Toilette', en: 'toilet', hint: 'Restroom', examples: [{ de: 'Wo ist die Toilette, bitte?', en: 'Where is the toilet, please?' }] },
      { de: 'der Flur', en: 'hallway', hint: 'Connects rooms', examples: [{ de: 'Im Flur hängen die Jacken.', en: 'The jackets hang in the hallway.' }] },
      { de: 'der Keller', en: 'basement', hint: 'Underground level', examples: [{ de: 'Im Keller ist die Waschmaschine.', en: 'The washing machine is in the basement.' }] },
      { de: 'der Balkon', en: 'balcony', hint: 'Outside space', examples: [{ de: 'Vom Balkon hat man eine schöne Aussicht.', en: 'From the balcony you have a nice view.' }] },
      { de: 'der Garten', en: 'garden', hint: 'Outdoor green space', examples: [{ de: 'Im Garten spielen die Kinder.', en: 'The children play in the garden.' }] },
      { de: 'die Tür', en: 'door', hint: 'Entry point', examples: [{ de: 'Bitte mach die Tür zu.', en: 'Please close the door.' }] },
      { de: 'das Fenster', en: 'window', hint: 'Let light in', examples: [{ de: 'Öffne das Fenster, bitte.', en: 'Open the window, please.' }] },
      { de: 'die Wand', en: 'wall', hint: 'Side of room', examples: [{ de: 'An der Wand hängt ein Bild.', en: 'A picture hangs on the wall.' }] },
      { de: 'der Boden', en: 'floor', hint: 'Ground', examples: [{ de: 'Der Boden ist aus Holz.', en: 'The floor is made of wood.' }] },
      { de: 'die Decke', en: 'ceiling', hint: 'Top of room', examples: [{ de: 'Die Decke ist weiß.', en: 'The ceiling is white.' }] },
      { de: 'das Dach', en: 'roof', hint: 'Top of house', examples: [{ de: 'Das Dach ist rot.', en: 'The roof is red.' }] },
      { de: 'die Treppe', en: 'stairs', hint: 'Go up and down', examples: [{ de: 'Die Treppe geht in den ersten Stock.', en: 'The stairs go to the first floor.' }] },
      { de: 'der Aufzug', en: 'elevator', hint: 'Lift', examples: [{ de: 'Der Aufzug ist kaputt.', en: 'The elevator is broken.' }] },
      { de: 'das Möbel', en: 'furniture', hint: 'General term', examples: [{ de: 'Die Möbel sind modern.', en: 'The furniture is modern.' }] },
      { de: 'der Tisch', en: 'table', hint: 'Flat surface for eating', examples: [{ de: 'Der Tisch ist gedeckt.', en: 'The table is set.' }] },
      { de: 'der Stuhl', en: 'chair', hint: 'For sitting', examples: [{ de: 'Bitte nimm einen Stuhl.', en: 'Please take a chair.' }] },
      { de: 'das Sofa', en: 'sofa', hint: 'Comfortable seating', examples: [{ de: 'Auf dem Sofa sitzen wir abends.', en: 'In the evening, we sit on the sofa.' }] },
      { de: 'der Sessel', en: 'armchair', hint: 'Single cozy chair', examples: [{ de: 'Opa sitzt im Sessel.', en: 'Grandpa sits in the armchair.' }] },
      { de: 'das Bett', en: 'bed', hint: 'For sleeping', examples: [{ de: 'Das Bett ist sehr bequem.', en: 'The bed is very comfortable.' }] },
      { de: 'der Schrank', en: 'wardrobe, cupboard', hint: 'For storage', examples: [{ de: 'Der Schrank ist aus Holz.', en: 'The wardrobe is made of wood.' }] },
      { de: 'der Kleiderschrank', en: 'wardrobe', hint: 'For clothes', examples: [{ de: 'Meine Hemden hängen im Kleiderschrank.', en: 'My shirts hang in the wardrobe.' }] },
      { de: 'das Regal', en: 'shelf', hint: 'For books/items', examples: [{ de: 'Im Regal stehen viele Bücher.', en: 'Many books stand on the shelf.' }] },
      { de: 'der Tisch', en: 'table', hint: 'For eating/working', examples: [{ de: 'Am Tisch sitzen vier Stühle.', en: 'Four chairs sit at the table.' }] },
      { de: 'der Schreibtisch', en: 'desk', hint: 'For working', examples: [{ de: 'Am Schreibtisch arbeite ich am Computer.', en: 'At the desk, I work on the computer.' }] },
      { de: 'das Bücherregal', en: 'bookshelf', hint: 'For books', examples: [{ de: 'Das Bücherregal ist voll.', en: 'The bookshelf is full.' }] },
      { de: 'die Lampe', en: 'lamp', hint: 'Gives light', examples: [{ de: 'Die Lampe auf dem Tisch ist an.', en: 'The lamp on the table is on.' }] },
      { de: 'das Licht', en: 'light', hint: 'General illumination', examples: [{ de: 'Mach bitte das Licht aus.', en: 'Please turn off the light.' }] },
      { de: 'der Teppich', en: 'carpet', hint: 'Floor covering', examples: [{ de: 'Der Teppich ist weich.', en: 'The carpet is soft.' }] },
      { de: 'das Bild', en: 'picture', hint: 'On the wall', examples: [{ de: 'Das Bild hängt schief.', en: 'The picture is hanging crooked.' }] },
      { de: 'der Spiegel', en: 'mirror', hint: 'Look at yourself', examples: [{ de: 'Im Spiegel sehe ich mich.', en: 'I see myself in the mirror.' }] },
      { de: 'die Uhr', en: 'clock', hint: 'Tells time', examples: [{ de: 'Die Uhr zeigt 10 Uhr.', en: 'The clock shows 10 o\'clock.' }] },
      { de: 'das Telefon', en: 'telephone', hint: 'Call device', examples: [{ de: 'Das Telefon klingelt.', en: 'The telephone is ringing.' }] },
      { de: 'der Herd', en: 'stove', hint: 'For cooking', examples: [{ de: 'Der Herd ist elektrisch.', en: 'The stove is electric.' }] },
      { de: 'der Ofen', en: 'oven', hint: 'For baking', examples: [{ de: 'Der Kuchen ist im Ofen.', en: 'The cake is in the oven.' }] },
      { de: 'der Kühlschrank', en: 'refrigerator', hint: 'Keeps food cold', examples: [{ de: 'Die Milch ist im Kühlschrank.', en: 'The milk is in the refrigerator.' }] },
      { de: 'die Spüle', en: 'sink', hint: 'For washing dishes', examples: [{ de: 'Das schmutzige Geschirr ist in der Spüle.', en: 'The dirty dishes are in the sink.' }] },
      { de: 'die Waschmaschine', en: 'washing machine', hint: 'Washes clothes', examples: [{ de: 'Die Waschmaschine läuft.', en: 'The washing machine is running.' }] },
      { de: 'der Staubsauger', en: 'vacuum cleaner', hint: 'For cleaning floor', examples: [{ de: 'Mit dem Staubsauger reinige ich den Teppich.', en: 'With the vacuum cleaner, I clean the carpet.' }] },
      { de: 'der Besen', en: 'broom', hint: 'For sweeping', examples: [{ de: 'Nimm den Besen und fege den Boden.', en: 'Take the broom and sweep the floor.' }] },
      { de: 'der Eimer', en: 'bucket', hint: 'For carrying water', examples: [{ de: 'Wasser im Eimer zum Putzen.', en: 'Water in the bucket for cleaning.' }] },
      { de: 'der Müll', en: 'trash', hint: 'Waste', examples: [{ de: 'Bitte den Müll rausbringen.', en: 'Please take out the trash.' }] },
      { de: 'die Mülltonne', en: 'trash can', hint: 'Outside bin', examples: [{ de: 'Die Mülltonne steht vor dem Haus.', en: 'The trash can is in front of the house.' }] },
      { de: 'der Schlüssel', en: 'key', hint: 'For locks', examples: [{ de: 'Ich habe meinen Schlüssel verloren.', en: 'I lost my key.' }] },
      { de: 'das Schloss', en: 'lock', hint: 'Locks door', examples: [{ de: 'Das Schloss an der Tür ist neu.', en: 'The lock on the door is new.' }] },
      { de: 'die Klingel', en: 'doorbell', hint: 'Rings when someone arrives', examples: [{ de: 'Die Klingel funktioniert nicht.', en: 'The doorbell doesn\'t work.' }] },
      { de: 'der Vermieter', en: 'landlord', hint: 'Rents apartment', examples: [{ de: 'Der Vermieter wohnt im Erdgeschoss.', en: 'The landlord lives on the ground floor.' }] },
      { de: 'die Miete', en: 'rent', hint: 'Monthly payment', examples: [{ de: 'Die Miete ist am ersten fällig.', en: 'The rent is due on the first.' }] },
      { de: 'die Nebenkosten', en: 'additional costs', hint: 'Heating, water etc.', examples: [{ de: 'Nebenkosten sind in der Miete nicht inbegriffen.', en: 'Additional costs are not included in the rent.' }] },
      { de: 'die Kaution', en: 'deposit', hint: 'Security payment', examples: [{ de: 'Die Kaution beträgt zwei Monatsmieten.', en: 'The deposit is two months\' rent.' }] },
      { de: 'der Vertrag', en: 'contract', hint: 'Legal agreement', examples: [{ de: 'Bitte unterschreiben Sie den Vertrag.', en: 'Please sign the contract.' }] },
      { de: 'die Unterschrift', en: 'signature', hint: 'Your signed name', examples: [{ de: 'Hier ist Ihre Unterschrift nötig.', en: 'Your signature is needed here.' }] },
      { de: 'die Heizung', en: 'heating', hint: 'Warms the house', examples: [{ de: 'Im Winter ist die Heizung an.', en: 'In winter, the heating is on.' }] },
      { de: 'warm', en: 'warm', hint: 'Temperature', examples: [{ de: 'In der Wohnung ist es warm.', en: 'It is warm in the apartment.' }] },
      { de: 'kalt', en: 'cold', hint: 'Temperature', examples: [{ de: 'Mir ist kalt.', en: 'I am cold.' }] },
      { de: 'lüften', en: 'to air out', hint: 'Open windows', examples: [{ de: 'Bitte morgens lüften.', en: 'Please air out in the morning.' }] },
      { de: 'putzen', en: 'to clean', hint: 'Make clean', examples: [{ de: 'Am Samstag putze ich die Wohnung.', en: 'On Saturday I clean the apartment.' }] },
      { de: 'aufräumen', en: 'to tidy up', hint: 'Make orderly', examples: [{ de: 'Räum dein Zimmer auf!', en: 'Tidy up your room!' }] },
      { de: 'einziehen', en: 'to move in', hint: 'Start living somewhere', examples: [{ de: 'Wir ziehen am 1. April ein.', en: 'We move in on April 1st.' }] },
      { de: 'ausziehen', en: 'to move out', hint: 'Leave a place', examples: [{ de: 'Er zieht von zu Hause aus.', en: 'He is moving out of home.' }] },
      { de: 'umziehen', en: 'to move (house)', hint: 'Change residence', examples: [{ de: 'Nächste Woche ziehen wir um.', en: 'Next week we are moving.' }] },
      { de: 'die Nachbarn', en: 'neighbors', hint: 'People next door', examples: [{ de: 'Meine Nachbarn sind nett.', en: 'My neighbors are nice.' }] },
      { de: 'die Stadt', en: 'city', hint: 'Large town', examples: [{ de: 'Ich lebe gern in der Stadt.', en: 'I like living in the city.' }] },
      { de: 'das Dorf', en: 'village', hint: 'Small town', examples: [{ de: 'Im Dorf kennt jeder jeden.', en: 'In the village, everyone knows everyone.' }] },
      { de: 'die Straße', en: 'street', hint: 'Road in city', examples: [{ de: 'In unserer Straße gibt es viele Bäume.', en: 'There are many trees on our street.' }] },
      { de: 'der Platz', en: 'square, place', hint: 'Open area', examples: [{ de: 'Der Marktplatz ist im Zentrum.', en: 'The market square is in the center.' }] },
      { de: 'der Park', en: 'park', hint: 'Green space', examples: [{ de: 'Im Park spazieren gehen.', en: 'Go for a walk in the park.' }] },
      { de: 'die Brücke', en: 'bridge', hint: 'Over water/road', examples: [{ de: 'Die Brücke über den Fluss.', en: 'The bridge over the river.' }] },
      { de: 'das Gebäude', en: 'building', hint: 'Structure', examples: [{ de: 'Das Gebäude ist sehr hoch.', en: 'The building is very tall.' }] },
      { de: 'der Stock', en: 'floor, story', hint: 'Level of building', examples: [{ de: 'Im ersten Stock ist das Büro.', en: 'On the first floor is the office.' }] },
      { de: 'das Erdgeschoss', en: 'ground floor', hint: 'First level', examples: [{ de: 'Die Wohnung im Erdgeschoss.', en: 'The apartment on the ground floor.' }] },
      { de: 'der Stadtteil', en: 'district', hint: 'Part of a city', examples: [{ de: 'Welcher Stadtteil ist das?', en: 'Which district is that?' }] },
      { de: 'die Innenstadt', en: 'city center', hint: 'Downtown', examples: [{ de: 'In der Innenstadt sind viele Geschäfte.', en: 'There are many shops in the city center.' }] },
      { de: 'der Vorort', en: 'suburb', hint: 'Outside city center', examples: [{ de: 'Wir wohnen in einem Vorort von München.', en: 'We live in a suburb of Munich.' }] },

      // Travel & Transportation (100)
      { de: 'das Auto', en: 'car', hint: 'Vehicle', examples: [{ de: 'Ich fahre mit dem Auto zur Arbeit.', en: 'I drive to work by car.' }] },
      { de: 'das Fahrrad', en: 'bicycle', hint: 'Two wheels', examples: [{ de: 'Mit dem Fahrrad fahre ich zur Schule.', en: 'I ride my bike to school.' }] },
      { de: 'das Motorrad', en: 'motorcycle', hint: 'Two wheels motor', examples: [{ de: 'Er fährt Motorrad.', en: 'He rides a motorcycle.' }] },
      { de: 'der Bus', en: 'bus', hint: 'Public transport', examples: [{ de: 'Der Bus kommt um zehn.', en: 'The bus comes at ten.' }] },
      { de: 'die Straßenbahn', en: 'tram', hint: 'On rails in city', examples: [{ de: 'Mit der Straßenbahn in die Stadt.', en: 'By tram to the city.' }] },
      { de: 'die U-Bahn', en: 'subway', hint: 'Underground train', examples: [{ de: 'Die U-Bahn fährt alle 5 Minuten.', en: 'The subway runs every 5 minutes.' }] },
      { de: 'die S-Bahn', en: 'commuter train', hint: 'City rail', examples: [{ de: 'Mit der S-Bahn zum Flughafen.', en: 'By S-Bahn to the airport.' }] },
      { de: 'der Zug', en: 'train', hint: 'Long distance rail', examples: [{ de: 'Der Zug nach Berlin fährt um 8 Uhr.', en: 'The train to Berlin leaves at 8.' }] },
      { de: 'der Bahnhof', en: 'train station', hint: 'Where trains stop', examples: [{ de: 'Am Bahnhof steige ich aus.', en: 'I get off at the train station.' }] },
      { de: 'der Hauptbahnhof', en: 'main station', hint: 'Central station', examples: [{ de: 'Der Hauptbahnhof ist sehr groß.', en: 'The main station is very big.' }] },
      { de: 'der Flughafen', en: 'airport', hint: 'For planes', examples: [{ de: 'Vom Flughafen fliegen wir nach London.', en: 'From the airport, we fly to London.' }] },
      { de: 'das Flugzeug', en: 'airplane', hint: 'Flies in air', examples: [{ de: 'Das Flugzeug startet.', en: 'The plane takes off.' }] },
      { de: 'das Taxi', en: 'taxi', hint: 'Hired car', examples: [{ de: 'Wir nehmen ein Taxi zum Hotel.', en: 'We take a taxi to the hotel.' }] },
      { de: 'das Schiff', en: 'ship', hint: 'Boat', examples: [{ de: 'Mit dem Schiff übersetzen.', en: 'Crossing by ship.' }] },
      { de: 'die Fähre', en: 'ferry', hint: 'Transports cars/people', examples: [{ de: 'Die Fähre nach Schweden.', en: 'The ferry to Sweden.' }] },
      { de: 'die Haltestelle', en: 'bus/tram stop', hint: 'Where bus stops', examples: [{ de: 'An der Haltestelle warten viele Leute.', en: 'Many people are waiting at the stop.' }] },
      { de: 'der Fahrplan', en: 'schedule', hint: 'Timetable', examples: [{ de: 'Kann ich einen Fahrplan haben?', en: 'Can I have a schedule?' }] },
      { de: 'die Fahrkarte', en: 'ticket', hint: 'For travel', examples: [{ de: 'Eine Fahrkarte nach München, bitte.', en: 'A ticket to Munich, please.' }] },
      { de: 'das Ticket', en: 'ticket', hint: 'Entry pass', examples: [{ de: 'Das Ticket für das Konzert.', en: 'The ticket for the concert.' }] },
      { de: 'einfach', en: 'one-way', hint: 'Single ticket', examples: [{ de: 'Einmal einfach nach Köln.', en: 'One one-way to Cologne.' }] },
      { de: 'hin und zurück', en: 'round trip', hint: 'There and back', examples: [{ de: 'Zweimal hin und zurück, bitte.', en: 'Two round trips, please.' }] },
      { de: 'die erste Klasse', en: 'first class', hint: 'Premium travel', examples: [{ de: 'Ich reise gern erste Klasse.', en: 'I like traveling first class.' }] },
      { de: 'zweite Klasse', en: 'second class', hint: 'Standard', examples: [{ de: 'Zweite Klasse ist günstiger.', en: 'Second class is cheaper.' }] },
      { de: 'der Fahrer', en: 'driver', hint: 'Person driving', examples: [{ de: 'Der Fahrer des Buses ist freundlich.', en: 'The bus driver is friendly.' }] },
      { de: 'der Pilot', en: 'pilot', hint: 'Flies plane', examples: [{ de: 'Der Pilot begrüßt die Passagiere.', en: 'The pilot greets the passengers.' }] },
      { de: 'der Zugführer', en: 'train driver', hint: 'Operates train', examples: [{ de: 'Der Zugführer bremst.', en: 'The train driver brakes.' }] },
      { de: 'der Passagier', en: 'passenger', hint: 'Traveler', examples: [{ de: 'Die Passagiere steigen ein.', en: 'The passengers board.' }] },
      { de: 'die Abfahrt', en: 'departure', hint: 'Leave time', examples: [{ de: 'Die Abfahrt ist um 14 Uhr.', en: 'The departure is at 2 p.m.' }] },
      { de: 'die Ankunft', en: 'arrival', hint: 'Arrive time', examples: [{ de: 'Die Ankunft in Berlin ist um 18 Uhr.', en: 'The arrival in Berlin is at 6 p.m.' }] },
      { de: 'pünktlich', en: 'on time', hint: 'Not late', examples: [{ de: 'Der Zug ist heute pünktlich.', en: 'The train is on time today.' }] },
      { de: 'Verspätung', en: 'delay', hint: 'Late', examples: [{ de: 'Der Zug hat 10 Minuten Verspätung.', en: 'The train is 10 minutes late.' }] },
      { de: 'der Ausgang', en: 'exit', hint: 'Way out', examples: [{ de: 'Wo ist der Ausgang?', en: 'Where is the exit?' }] },
      { de: 'der Eingang', en: 'entrance', hint: 'Way in', examples: [{ de: 'Am Eingang ist eine Kontrolle.', en: 'There is a check at the entrance.' }] },
      { de: 'der Fahrstuhl', en: 'elevator', hint: 'Lift', examples: [{ de: 'Mit dem Fahrstuhl in den dritten Stock.', en: 'By elevator to the third floor.' }] },
      { de: 'die Rolltreppe', en: 'escalator', hint: 'Moving stairs', examples: [{ de: 'Fahren Sie mit der Rolltreppe.', en: 'Take the escalator.' }] },
      { de: 'das Gleis', en: 'platform (track)', hint: 'Train platform', examples: [{ de: 'Der Zug fährt auf Gleis 5.', en: 'The train departs from platform 5.' }] },
      { de: 'der Bahnsteig', en: 'platform', hint: 'Area at station', examples: [{ de: 'Auf dem Bahnsteig warten.', en: 'Wait on the platform.' }] },
      { de: 'einsteigen', en: 'to board', hint: 'Get on vehicle', examples: [{ de: 'Bitte in den Zug einsteigen!', en: 'Please board the train!' }] },
      { de: 'aussteigen', en: 'to get off', hint: 'Exit vehicle', examples: [{ de: 'Ich steige am Bahnhof aus.', en: 'I get off at the train station.' }] },
      { de: 'umsteigen', en: 'to transfer', hint: 'Change trains', examples: [{ de: 'In Köln müssen Sie umsteigen.', en: 'In Cologne you need to transfer.' }] },
      { de: 'die Reise', en: 'trip', hint: 'Travel', examples: [{ de: 'Eine Reise nach Italien.', en: 'A trip to Italy.' }] },
      { de: 'der Urlaub', en: 'vacation', hint: 'Holidays', examples: [{ de: 'Im Sommer machen wir Urlaub.', en: 'In summer we go on vacation.' }] },
      { de: 'das Hotel', en: 'hotel', hint: 'Place to stay', examples: [{ de: 'Wir übernachten in einem Hotel.', en: 'We stay overnight in a hotel.' }] },
      { de: 'die Jugendherberge', en: 'youth hostel', hint: 'Budget accommodation', examples: [{ de: 'In der Jugendherberge ist es günstig.', en: 'It is cheap in the youth hostel.' }] },
      { de: 'das Ferienhaus', en: 'holiday house', hint: 'Rented house', examples: [{ de: 'Ein Ferienhaus am See.', en: 'A holiday house by the lake.' }] },
      { de: 'die Ferienwohnung', en: 'holiday apartment', hint: 'Rented apartment', examples: [{ de: 'Die Ferienwohnung ist gemütlich.', en: 'The holiday apartment is cozy.' }] },
      { de: 'das Zimmer frei', en: 'room available', hint: 'Vacancy', examples: [{ de: 'Haben Sie ein Zimmer frei?', en: 'Do you have a room available?' }] },
      { de: 'die Reservierung', en: 'reservation', hint: 'Booking', examples: [{ de: 'Ich habe eine Reservierung.', en: 'I have a reservation.' }] },
      { de: 'das Einzelzimmer', en: 'single room', hint: 'Room for one', examples: [{ de: 'Ein Einzelzimmer für eine Nacht.', en: 'A single room for one night.' }] },
      { de: 'das Doppelzimmer', en: 'double room', hint: 'Room for two', examples: [{ de: 'Wir möchten ein Doppelzimmer.', en: 'We would like a double room.' }] },
      { de: 'das Frühstücksbuffet', en: 'breakfast buffet', hint: 'Hotel breakfast', examples: [{ de: 'Das Frühstücksbuffet ist reichhaltig.', en: 'The breakfast buffet is plentiful.' }] },
      { de: 'die Rezeption', en: 'reception', hint: 'Hotel desk', examples: [{ de: 'An der Rezeption bekommen Sie den Schlüssel.', en: 'At reception you get the key.' }] },
      { de: 'der Zimmerservice', en: 'room service', hint: 'Food to room', examples: [{ de: 'Wir bestellen Zimmerservice.', en: 'We order room service.' }] },
      { de: 'der Stadtplan', en: 'city map', hint: 'Map of city', examples: [{ de: 'Einen Stadtplan, bitte.', en: 'A city map, please.' }] },
      { de: 'die Sehenswürdigkeit', en: 'sight', hint: 'Tourist attraction', examples: [{ de: 'Der Kölner Dom ist eine Sehenswürdigkeit.', en: 'Cologne Cathedral is a sight.' }] },
      { de: 'die Tour', en: 'tour', hint: 'Guided trip', examples: [{ de: 'Eine Stadtführung durch Berlin.', en: 'A guided tour through Berlin.' }] },
      { de: 'der Reiseführer', en: 'travel guide (book/person)', hint: 'Guide book or person', examples: [{ de: 'Der Reiseführer erklärt die Stadt.', en: 'The tour guide explains the city.' }] },
      { de: 'das Museum', en: 'museum', hint: 'Art/history exhibition', examples: [{ de: 'Das Museum ist montags geschlossen.', en: 'The museum is closed on Mondays.' }] },
      { de: 'die Kirche', en: 'church', hint: 'Place of worship', examples: [{ de: 'Die Kirche ist alt.', en: 'The church is old.' }] },
      { de: 'das Schloss', en: 'castle', hint: 'Royal palace', examples: [{ de: 'Schloss Neuschwanstein ist berühmt.', en: 'Neuschwanstein Castle is famous.' }] },
      { de: 'der Dom', en: 'cathedral', hint: 'Large church', examples: [{ de: 'Der Dom ist imposant.', en: 'The cathedral is impressive.' }] },
      { de: 'der Markt', en: 'market', hint: 'Marketplace', examples: [{ de: 'Auf dem Markt kaufe ich Obst.', en: 'I buy fruit at the market.' }] },
      { de: 'der Ausflug', en: 'excursion', hint: 'Short trip', examples: [{ de: 'Einen Ausflug ins Grüne machen.', en: 'Make an excursion to the countryside.' }] },
      { de: 'das Ticket', en: 'ticket', hint: 'Entry', examples: [{ de: 'Zwei Tickets für das Museum.', en: 'Two tickets for the museum.' }] },
      { de: 'ermäßigt', en: 'reduced', hint: 'Discount', examples: [{ de: 'Ermäßigt für Studenten.', en: 'Reduced for students.' }] },
      { de: 'die Postkarte', en: 'postcard', hint: 'Send from travel', examples: [{ de: 'Ich schicke eine Postkarte nach Hause.', en: 'I send a postcard home.' }] },
      { de: 'der Koffer', en: 'suitcase', hint: 'Luggage', examples: [{ de: 'Mein Koffer ist schwer.', en: 'My suitcase is heavy.' }] },
      { de: 'die Tasche', en: 'bag', hint: 'Carry items', examples: [{ de: 'In meiner Tasche ist ein Buch.', en: 'There is a book in my bag.' }] },
      { de: 'der Rucksack', en: 'backpack', hint: 'Backpack', examples: [{ de: 'Im Rucksack ist mein Proviant.', en: 'My provisions are in the backpack.' }] },
      { de: 'der Pass', en: 'passport', hint: 'ID for travel', examples: [{ de: 'Vergessen Sie Ihren Pass nicht.', en: 'Don\'t forget your passport.' }] },
      { de: 'der Personalausweis', en: 'ID card', hint: 'Identification', examples: [{ de: 'Der Personalausweis ist gültig.', en: 'The ID card is valid.' }] },
      { de: 'das Visum', en: 'visa', hint: 'Entry permit', examples: [{ de: 'Brauche ich ein Visum für die USA?', en: 'Do I need a visa for the USA?' }] },
      { de: 'der Zoll', en: 'customs', hint: 'Border control', examples: [{ de: 'Am Zoll muss ich den Pass zeigen.', en: 'At customs I have to show my passport.' }] },
      { de: 'die Grenze', en: 'border', hint: 'Between countries', examples: [{ de: 'Die Grenze zu Frankreich.', en: 'The border with France.' }] },
      { de: 'übernachten', en: 'to stay overnight', hint: 'Sleep somewhere else', examples: [{ de: 'Wir übernachten im Hotel.', en: 'We stay overnight at the hotel.' }] },
      { de: 'buchen', en: 'to book', hint: 'Reserve', examples: [{ de: 'Ich buche einen Flug nach Berlin.', en: 'I book a flight to Berlin.' }] },
      { de: 'stornieren', en: 'to cancel', hint: 'Cancel booking', examples: [{ de: 'Ich muss mein Hotel stornieren.', en: 'I have to cancel my hotel.' }] },
      { de: 'die Landkarte', en: 'map', hint: 'Geographical map', examples: [{ de: 'Auf der Landkarte sehe ich die Route.', en: 'On the map I see the route.' }] },
      { de: 'das Navi', en: 'GPS', hint: 'Navigation device', examples: [{ de: 'Das Navi sagt, wir sind da.', en: 'The GPS says we are there.' }] },
      { de: 'die Autobahn', en: 'highway', hint: 'German motorway', examples: [{ de: 'Auf der Autobahn gibt es kein Tempolimit.', en: 'On the highway there is no speed limit.' }] },
      { de: 'die Tankstelle', en: 'gas station', hint: 'For fuel', examples: [{ de: 'An der Tankstelle tanke ich Benzin.', en: 'At the gas station I get fuel.' }] },
      { de: 'das Benzin', en: 'gasoline', hint: 'Fuel for car', examples: [{ de: 'Benzin ist teuer.', en: 'Gasoline is expensive.' }] },
      { de: 'die Panne', en: 'breakdown', hint: 'Car stops working', examples: [{ de: 'Ich hatte eine Panne auf der Autobahn.', en: 'I had a breakdown on the highway.' }] },
      { de: 'die Werkstatt', en: 'repair shop', hint: 'Garage for repairs', examples: [{ de: 'Das Auto ist in der Werkstatt.', en: 'The car is in the repair shop.' }] },
      { de: 'der Parkplatz', en: 'parking lot', hint: 'Place to park', examples: [{ de: 'Hier gibt es keinen Parkplatz.', en: 'There is no parking space here.' }] },
      { de: 'die Parkuhr', en: 'parking meter', hint: 'Pay for parking', examples: [{ de: 'An der Parkuhr bezahlen.', en: 'Pay at the parking meter.' }] },
      { de: 'das Ticket', en: 'ticket (parking fine)', hint: 'Parking ticket', examples: [{ de: 'Ich habe ein Ticket bekommen.', en: 'I got a parking ticket.' }] },
      { de: 'die Geschwindigkeit', en: 'speed', hint: 'How fast', examples: [{ de: 'Die Geschwindigkeit ist zu hoch.', en: 'The speed is too high.' }] },
      { de: 'langsam', en: 'slow', hint: 'Not fast', examples: [{ de: 'Bitte langsamer fahren!', en: 'Please drive slower!' }] },
      { de: 'schnell', en: 'fast', hint: 'High speed', examples: [{ de: 'Das Auto ist sehr schnell.', en: 'The car is very fast.' }] },
      { de: 'die Kreuzung', en: 'intersection', hint: 'Roads cross', examples: [{ de: 'An der Kreuzung rechts abbiegen.', en: 'Turn right at the intersection.' }] },
      { de: 'die Ampel', en: 'traffic light', hint: 'Red, yellow, green', examples: [{ de: 'Die Ampel ist rot.', en: 'The traffic light is red.' }] },
      { de: 'das Verkehrsschild', en: 'traffic sign', hint: 'Street sign', examples: [{ de: 'Das Verkehrsschild sagt "Stopp".', en: 'The traffic sign says "Stop".' }] },
      { de: 'geradeaus', en: 'straight ahead', hint: 'Direction', examples: [{ de: 'Fahren Sie geradeaus.', en: 'Drive straight ahead.' }] },
      { de: 'rechts', en: 'right', hint: 'Direction', examples: [{ de: 'Nach rechts abbiegen.', en: 'Turn right.' }] },
      { de: 'links', en: 'left', hint: 'Direction', examples: [{ de: 'Links ist der Supermarkt.', en: 'To the left is the supermarket.' }] },

      // Nature & Weather (80)
      { de: 'die Natur', en: 'nature', hint: 'The natural world', examples: [{ de: 'Ich liebe die Natur.', en: 'I love nature.' }] },
      { de: 'die Umwelt', en: 'environment', hint: 'Our surroundings', examples: [{ de: 'Wir müssen die Umwelt schützen.', en: 'We must protect the environment.' }] },
      { de: 'das Wetter', en: 'weather', hint: 'Sun, rain, etc.', examples: [{ de: 'Wie ist das Wetter heute?', en: 'How is the weather today?' }] },
      { de: 'die Sonne', en: 'sun', hint: 'Shines bright', examples: [{ de: 'Die Sonne scheint.', en: 'The sun is shining.' }] },
      { de: 'der Mond', en: 'moon', hint: 'At night', examples: [{ de: 'Der Mond ist heute voll.', en: 'The moon is full today.' }] },
      { de: 'der Stern', en: 'star', hint: 'In the sky', examples: [{ de: 'Nachts sind viele Sterne zu sehen.', en: 'At night many stars are visible.' }] },
      { de: 'der Himmel', en: 'sky', hint: 'Above us', examples: [{ de: 'Der Himmel ist blau.', en: 'The sky is blue.' }] },
      { de: 'die Wolke', en: 'cloud', hint: 'White in sky', examples: [{ de: 'Am Himmel sind viele Wolken.', en: 'There are many clouds in the sky.' }] },
      { de: 'der Regen', en: 'rain', hint: 'Water from sky', examples: [{ de: 'Heute gibt es viel Regen.', en: 'Today there is a lot of rain.' }] },
      { de: 'der Schnee', en: 'snow', hint: 'White cold', examples: [{ de: 'Im Winter liegt Schnee.', en: 'In winter there is snow.' }] },
      { de: 'der Wind', en: 'wind', hint: 'Moving air', examples: [{ de: 'Der Wind weht stark.', en: 'The wind is blowing strong.' }] },
      { de: 'der Sturm', en: 'storm', hint: 'Strong wind', examples: [{ de: 'Ein Sturm kommt auf.', en: 'A storm is coming.' }] },
      { de: 'das Gewitter', en: 'thunderstorm', hint: 'Lightning and thunder', examples: [{ de: 'Nachts gibt es ein Gewitter.', en: 'There is a thunderstorm at night.' }] },
      { de: 'der Blitz', en: 'lightning', hint: 'Bright flash', examples: [{ de: 'Der Blitz schlägt ein.', en: 'Lightning strikes.' }] },
      { de: 'der Donner', en: 'thunder', hint: 'Loud sound', examples: [{ de: 'Der Donner folgt dem Blitz.', en: 'Thunder follows lightning.' }] },
      { de: 'der Nebel', en: 'fog', hint: 'Low cloud', examples: [{ de: 'Im Herbst gibt es oft Nebel.', en: 'In autumn there is often fog.' }] },
      { de: 'der Regenbogen', en: 'rainbow', hint: 'Colors after rain', examples: [{ de: 'Nach dem Regen sehe ich einen Regenbogen.', en: 'After the rain I see a rainbow.' }] },
      { de: 'die Temperatur', en: 'temperature', hint: 'How hot/cold', examples: [{ de: 'Die Temperatur ist 20 Grad.', en: 'The temperature is 20 degrees.' }] },
      { de: 'das Grad', en: 'degree', hint: 'Unit for temp', examples: [{ de: 'Es ist 30 Grad im Schatten.', en: 'It is 30 degrees in the shade.' }] },
      { de: 'warm', en: 'warm', hint: 'Pleasant heat', examples: [{ de: 'Im Sommer ist es warm.', en: 'In summer it is warm.' }] },
      { de: 'heiß', en: 'hot', hint: 'Very warm', examples: [{ de: 'Es ist sehr heiß heute.', en: 'It is very hot today.' }] },
      { de: 'kalt', en: 'cold', hint: 'Low temperature', examples: [{ de: 'Im Winter ist es kalt.', en: 'In winter it is cold.' }] },
      { de: 'kühl', en: 'cool', hint: 'Slightly cold', examples: [{ de: 'Am Abend wird es kühl.', en: 'In the evening it gets cool.' }] },
      { de: 'die Jahreszeit', en: 'season', hint: 'Spring, summer, etc.', examples: [{ de: 'Der Frühling ist meine Lieblingsjahreszeit.', en: 'Spring is my favorite season.' }] },
      { de: 'der Frühling', en: 'spring', hint: 'Season after winter', examples: [{ de: 'Im Frühling blühen die Blumen.', en: 'In spring the flowers bloom.' }] },
      { de: 'der Sommer', en: 'summer', hint: 'Warm season', examples: [{ de: 'Im Sommer gehe ich schwimmen.', en: 'In summer I go swimming.' }] },
      { de: 'der Herbst', en: 'autumn', hint: 'Leaves fall', examples: [{ de: 'Im Herbst werden die Blätter bunt.', en: 'In autumn the leaves turn colorful.' }] },
      { de: 'der Winter', en: 'winter', hint: 'Cold season', examples: [{ de: 'Im Winter schnelt es.', en: 'In winter it snows.' }] },
      { de: 'die Landschaft', en: 'landscape', hint: 'Scenery', examples: [{ de: 'Die Landschaft in der Schweiz ist schön.', en: 'The landscape in Switzerland is beautiful.' }] },
      { de: 'der Berg', en: 'mountain', hint: 'High elevation', examples: [{ de: 'Auf den Berg wandern.', en: 'Hike up the mountain.' }] },
      { de: 'das Gebirge', en: 'mountain range', hint: 'Group of mountains', examples: [{ de: 'Die Alpen sind ein Gebirge.', en: 'The Alps are a mountain range.' }] },
      { de: 'das Tal', en: 'valley', hint: 'Low between mountains', examples: [{ de: 'Im Tal fließt ein Fluss.', en: 'A river flows in the valley.' }] },
      { de: 'der Hügel', en: 'hill', hint: 'Small mountain', examples: [{ de: 'Auf dem Hügel steht ein Schloss.', en: 'A castle stands on the hill.' }] },
      { de: 'der Wald', en: 'forest', hint: 'Many trees', examples: [{ de: 'Im Wald spazieren gehen.', en: 'Go for a walk in the forest.' }] },
      { de: 'der Baum', en: 'tree', hint: 'Tall plant', examples: [{ de: 'Der Baum hat grüne Blätter.', en: 'The tree has green leaves.' }] },
      { de: 'die Blume', en: 'flower', hint: 'Colorful plant', examples: [{ de: 'Die Blume duftet schön.', en: 'The flower smells nice.' }] },
      { de: 'das Gras', en: 'grass', hint: 'Green ground cover', examples: [{ de: 'Im Park wächst grünes Gras.', en: 'Green grass grows in the park.' }] },
      { de: 'das Feld', en: 'field', hint: 'Open land', examples: [{ de: 'Auf dem Feld wächst Mais.', en: 'Corn grows in the field.' }] },
      { de: 'die Wiese', en: 'meadow', hint: 'Grassy field', examples: [{ de: 'Auf der Wiese spielen die Kinder.', en: 'The children play on the meadow.' }] },
      { de: 'der Fluss', en: 'river', hint: 'Large flowing water', examples: [{ de: 'Der Rhein ist ein großer Fluss.', en: 'The Rhine is a large river.' }] },
      { de: 'der Bach', en: 'stream', hint: 'Small river', examples: [{ de: 'Der Bach fließt durch den Wald.', en: 'The stream flows through the forest.' }] },
      { de: 'der See', en: 'lake', hint: 'Large water body', examples: [{ de: 'Im See kann man schwimmen.', en: 'You can swim in the lake.' }] },
      { de: 'das Meer', en: 'sea', hint: 'Salt water', examples: [{ de: 'Im Urlaub ans Meer fahren.', en: 'Go to the sea on vacation.' }] },
      { de: 'der Ozean', en: 'ocean', hint: 'Large sea', examples: [{ de: 'Der Atlantische Ozean ist groß.', en: 'The Atlantic Ocean is big.' }] },
      { de: 'der Strand', en: 'beach', hint: 'Sand by water', examples: [{ de: 'Am Strand liege ich in der Sonne.', en: 'At the beach I lie in the sun.' }] },
      { de: 'die Insel', en: 'island', hint: 'Land surrounded by water', examples: [{ de: 'Rügen ist eine deutsche Insel.', en: 'Rügen is a German island.' }] },
      { de: 'das Tier', en: 'animal', hint: 'Living creature', examples: [{ de: 'Ich mag Tiere.', en: 'I like animals.' }] },
      { de: 'der Hund', en: 'dog', hint: 'Pet', examples: [{ de: 'Der Hund bellt.', en: 'The dog barks.' }] },
      { de: 'die Katze', en: 'cat', hint: 'Pet', examples: [{ de: 'Die Katze schläft.', en: 'The cat sleeps.' }] },
      { de: 'das Pferd', en: 'horse', hint: 'Large animal', examples: [{ de: 'Auf dem Pferd reiten.', en: 'Ride on the horse.' }] },
      { de: 'die Kuh', en: 'cow', hint: 'Gives milk', examples: [{ de: 'Die Kuh steht auf der Wiese.', en: 'The cow stands in the meadow.' }] },
      { de: 'das Schwein', en: 'pig', hint: 'Farm animal', examples: [{ de: 'Das Schwein ist rosa.', en: 'The pig is pink.' }] },
      { de: 'das Schaf', en: 'sheep', hint: 'Gives wool', examples: [{ de: 'Die Schafe fressen Gras.', en: 'The sheep eat grass.' }] },
      { de: 'das Huhn', en: 'chicken', hint: 'Lays eggs', examples: [{ de: 'Das Huhn gackert.', en: 'The chicken clucks.' }] },
      { de: 'der Vogel', en: 'bird', hint: 'Has feathers', examples: [{ de: 'Der Vogel singt.', en: 'The bird sings.' }] },
      { de: 'die Möwe', en: 'seagull', hint: 'Bird at sea', examples: [{ de: 'Die Möwe fliegt über das Meer.', en: 'The seagull flies over the sea.' }] },
      { de: 'der Fisch', en: 'fish', hint: 'Swims in water', examples: [{ de: 'Der Fisch schwimmt im Wasser.', en: 'The fish swims in the water.' }] },
      { de: 'das Insekt', en: 'insect', hint: 'Small bug', examples: [{ de: 'Die Biene ist ein Insekt.', en: 'The bee is an insect.' }] },
      { de: 'die Biene', en: 'bee', hint: 'Makes honey', examples: [{ de: 'Die Biene summt.', en: 'The bee buzzes.' }] },
      { de: 'die Fliege', en: 'fly', hint: 'Insect', examples: [{ de: 'Die Fliege ist auf dem Tisch.', en: 'The fly is on the table.' }] },
      { de: 'der Schmetterling', en: 'butterfly', hint: 'Colorful insect', examples: [{ de: 'Der Schmetterling fliegt von Blume zu Blume.', en: 'The butterfly flies from flower to flower.' }] },
      { de: 'die Pflanze', en: 'plant', hint: 'Living green thing', examples: [{ de: 'Die Pflanze braucht Wasser.', en: 'The plant needs water.' }] },
      { de: 'das Blatt', en: 'leaf', hint: 'Part of plant', examples: [{ de: 'Das Blatt ist grün.', en: 'The leaf is green.' }] },
      { de: 'die Wurzel', en: 'root', hint: 'Under ground', examples: [{ de: 'Die Wurzel der Pflanze ist lang.', en: 'The root of the plant is long.' }] },
      { de: 'der Ast', en: 'branch', hint: 'Part of tree', examples: [{ de: 'Der Vogel sitzt auf dem Ast.', en: 'The bird sits on the branch.' }] },
      { de: 'die Luft', en: 'air', hint: 'What we breathe', examples: [{ de: 'Die Luft ist frisch.', en: 'The air is fresh.' }] },
      { de: 'der Sauerstoff', en: 'oxygen', hint: 'We breathe it', examples: [{ de: 'Bäume produzieren Sauerstoff.', en: 'Trees produce oxygen.' }] },
      { de: 'die Pfütze', en: 'puddle', hint: 'Small water after rain', examples: [{ de: 'Die Kinder springen in die Pfütze.', en: 'The children jump into the puddle.' }] },
      { de: 'das Eis', en: 'ice', hint: 'Frozen water', examples: [{ de: 'Das Eis auf dem See ist dick.', en: 'The ice on the lake is thick.' }] },
      { de: 'der Hagel', en: 'hail', hint: 'Ice falling', examples: [{ de: 'Hagel beschädigt die Autos.', en: 'Hail damages the cars.' }] },
      { de: 'die Überschwemmung', en: 'flood', hint: 'Too much water', examples: [{ de: 'Nach dem Regen gibt es Überschwemmungen.', en: 'After the rain there are floods.' }] },
      { de: 'der Waldbrand', en: 'forest fire', hint: 'Fire in forest', examples: [{ de: 'Im Sommer gibt es oft Waldbrände.', en: 'In summer there are often forest fires.' }] },
      { de: 'der Klimawandel', en: 'climate change', hint: 'Changing climate', examples: [{ de: 'Der Klimawandel ist ein großes Problem.', en: 'Climate change is a big problem.' }] },
      { de: 'die Umweltverschmutzung', en: 'pollution', hint: 'Dirty environment', examples: [{ de: 'Die Umweltverschmutzung ist schlimm.', en: 'Pollution is bad.' }] },
      { de: 'recyceln', en: 'to recycle', hint: 'Reuse materials', examples: [{ de: 'Wir recyceln Papier und Glas.', en: 'We recycle paper and glass.' }] },
      { de: 'der Müll', en: 'trash', hint: 'Waste', examples: [{ de: 'Bitte den Müll trennen.', en: 'Please separate the trash.' }] },
      { de: 'die Dose', en: 'can', hint: 'Metal container', examples: [{ de: 'Die Dose in den gelben Sack werfen.', en: 'Throw the can in the yellow bag.' }] },
      { de: 'die Flasche', en: 'bottle', hint: 'Glass/plastic container', examples: [{ de: 'Pfand auf Flaschen.', en: 'Deposit on bottles.' }] },
      { de: 'spazieren gehen', en: 'to go for a walk', hint: 'Walk for leisure', examples: [{ de: 'Im Park spazieren gehen.', en: 'Go for a walk in the park.' }] },
      { de: 'die Aussicht', en: 'view', hint: 'What you see', examples: [{ de: 'Vom Berg hat man eine gute Aussicht.', en: 'From the mountain you have a good view.' }] },
    ],
    quiz: [
      // Original quiz entries (3)
      {
        question: 'How do you say “Good night” in German?',
        correct: 'Gute Nacht',
        options: ['Guten Morgen', 'Gute Nacht', 'Guten Abend', 'Tschüss'],
      },
      {
        question: 'What is the informal “you” in German?',
        correct: 'du',
        options: ['Sie', 'du', 'ihr', 'man'],
      },
      {
        question: 'Choose the correct translation: “Tschüss”',
        correct: 'Bye',
        options: ['Hello', 'Please', 'Bye', 'Thanks'],
      },
      // New A1 Quiz Questions (7 more to reach 10 total? but will add enough to be substantial)
      {
        question: 'What is the German word for “please” or “you’re welcome”?',
        correct: 'Bitte',
        options: ['Danke', 'Bitte', 'Tschüss', 'Hallo'],
      },
      {
        question: 'How do you say “I am from ...” in German?',
        correct: 'Ich komme aus ...',
        options: ['Ich heiße ...', 'Ich wohne in ...', 'Ich komme aus ...', 'Ich bin ...'],
      },
      {
        question: 'Which number is “drei”?',
        correct: '3',
        options: ['2', '3', '4', '5'],
      },
      {
        question: 'What does “die Mutter” mean?',
        correct: 'mother',
        options: ['father', 'sister', 'mother', 'grandmother'],
      },
      {
        question: 'How do you say “Thank you” in German?',
        correct: 'Danke',
        options: ['Bitte', 'Danke', 'Tschüss', 'Hallo'],
      },
      {
        question: 'What is the German word for “today”?',
        correct: 'heute',
        options: ['morgen', 'gestern', 'heute', 'jetzt'],
      },
      {
        question: 'Which of these is a German greeting?',
        correct: 'Guten Abend',
        options: ['Danke', 'Guten Abend', 'Entschuldigung', 'Wie bitte'],
      },
      {
        question: 'What is the number “zwölf” in English?',
        correct: 'twelve',
        options: ['ten', 'eleven', 'twelve', 'thirteen'],
      },
      {
        question: 'How do you say “Excuse me” in German?',
        correct: 'Entschuldigung',
        options: ['Bitte', 'Danke', 'Entschuldigung', 'Tschüss'],
      },
      {
        question: 'What does “der Tisch” mean?',
        correct: 'table',
        options: ['chair', 'table', 'bed', 'door'],
      },
      {
        question: 'Which word means “to eat”?',
        correct: 'essen',
        options: ['trinken', 'schlafen', 'essen', 'laufen'],
      },
      {
        question: 'What is “das Wetter”?',
        correct: 'the weather',
        options: ['the season', 'the weather', 'the nature', 'the sky'],
      },
      {
        question: 'How do you say “red” in German?',
        correct: 'rot',
        options: ['blau', 'rot', 'grün', 'gelb'],
      },
      {
        question: 'What does “Ich heiße ...” mean?',
        correct: 'My name is ...',
        options: ['I live in ...', 'I am from ...', 'My name is ...', 'I am ... years old'],
      },
      {
        question: 'Which of these means “father”?',
        correct: 'der Vater',
        options: ['die Mutter', 'der Bruder', 'der Vater', 'die Schwester'],
      },
    ],
  },
  A2: {
    flashcards: [
      // Original A2 entries (5)
      {
        de: 'der Bahnhof',
        en: 'train station',
        gender: 'der',
        plural: 'die Bahnhöfe',
        hint: 'Where you catch a train',
        examples: [
          {
            de: 'Der Bahnhof ist in der Stadtmitte.',
            en: 'The train station is in the city center.',
          },
        ],
      },
      {
        de: 'die Rechnung',
        en: 'bill / invoice',
        gender: 'die',
        plural: 'die Rechnungen',
        hint: 'You ask for this in a restaurant',
        examples: [
          {
            de: 'Können wir bitte die Rechnung bekommen?',
            en: 'Can we get the bill, please?',
          },
        ],
      },
      {
        de: 'der Termin',
        en: 'appointment',
        gender: 'der',
        plural: 'die Termine',
        hint: 'A planned meeting or doctor visit',
        examples: [
          {
            de: 'Ich habe morgen einen Termin beim Arzt.',
            en: 'I have a doctor’s appointment tomorrow.',
          },
        ],
      },
      {
        de: 'manchmal',
        en: 'sometimes',
        hint: 'Frequency word',
        examples: [
          {
            de: 'Manchmal gehe ich spät ins Bett.',
            en: 'Sometimes I go to bed late.',
          },
        ],
      },
      {
        de: 'normalerweise',
        en: 'usually',
        hint: 'Typical routine',
        examples: [
          {
            de: 'Normalerweise frühstücke ich um acht Uhr.',
            en: 'I usually have breakfast at eight o’clock.',
          },
        ],
      },
      // New A2 Flashcards (995 additional) - Total A2: 1000
      // Daily Routines & Time Expressions (80)
      { de: 'der Alltag', en: 'everyday life', hint: 'Daily routine', examples: [{ de: 'Mein Alltag ist sehr strukturiert.', en: 'My everyday life is very structured.' }] },
      { de: 'die Routine', en: 'routine', hint: 'Regular activities', examples: [{ de: 'Meine Morgenroutine ist immer gleich.', en: 'My morning routine is always the same.' }] },
      { de: 'aufwachen', en: 'to wake up', hint: 'Stop sleeping', examples: [{ de: 'Ich wache um 6 Uhr auf.', en: 'I wake up at 6 o\'clock.' }] },
      { de: 'aufstehen', en: 'to get up', hint: 'Leave the bed', examples: [{ de: 'Nach dem Aufwachen stehe ich sofort auf.', en: 'After waking up, I get up immediately.' }] },
      { de: 'sich anziehen', en: 'to get dressed', hint: 'Put on clothes', examples: [{ de: 'Ich ziehe mich an.', en: 'I get dressed.' }] },
      { de: 'die Kleidung', en: 'clothing', hint: 'What you wear', examples: [{ de: 'Meine Kleidung ist bequem.', en: 'My clothing is comfortable.' }] },
      { de: 'das Hemd', en: 'shirt', hint: 'Formal top', examples: [{ de: 'Er trägt ein weißes Hemd.', en: 'He is wearing a white shirt.' }] },
      { de: 'die Bluse', en: 'blouse', hint: 'Women\'s shirt', examples: [{ de: 'Die Bluse ist aus Seide.', en: 'The blouse is made of silk.' }] },
      { de: 'die Hose', en: 'pants', hint: 'Trousers', examples: [{ de: 'Meine Hose ist blau.', en: 'My pants are blue.' }] },
      { de: 'die Jeans', en: 'jeans', hint: 'Casual pants', examples: [{ de: 'Ich trage gerne Jeans.', en: 'I like wearing jeans.' }] },
      { de: 'der Rock', en: 'skirt', hint: 'Women\'s garment', examples: [{ de: 'Sie hat einen roten Rock an.', en: 'She is wearing a red skirt.' }] },
      { de: 'das Kleid', en: 'dress', hint: 'One-piece women\'s garment', examples: [{ de: 'Ein schönes Kleid für die Party.', en: 'A nice dress for the party.' }] },
      { de: 'der Schuh', en: 'shoe', hint: 'Footwear', examples: [{ de: 'Die Schuhe sind neu.', en: 'The shoes are new.' }] },
      { de: 'die Jacke', en: 'jacket', hint: 'Outerwear', examples: [{ de: 'Zieh eine Jacke an, es ist kalt.', en: 'Put on a jacket, it\'s cold.' }] },
      { de: 'der Mantel', en: 'coat', hint: 'Warm outerwear', examples: [{ de: 'Im Winter trage ich einen Mantel.', en: 'In winter I wear a coat.' }] },
      { de: 'die Mütze', en: 'cap', hint: 'Headwear', examples: [{ de: 'Die Mütze schützt vor der Sonne.', en: 'The cap protects from the sun.' }] },
      { de: 'der Schal', en: 'scarf', hint: 'Neck warmer', examples: [{ de: 'Im Winter ist ein Schal wichtig.', en: 'In winter a scarf is important.' }] },
      { de: 'die Handschuhe', en: 'gloves', hint: 'Hand warmers', examples: [{ de: 'Handschuhe aus Wolle.', en: 'Wool gloves.' }] },
      { de: 'sich duschen', en: 'to shower', hint: 'Wash yourself', examples: [{ de: 'Ich dusche mich jeden Morgen.', en: 'I shower every morning.' }] },
      { de: 'die Zähne putzen', en: 'to brush teeth', hint: 'Oral hygiene', examples: [{ de: 'Vergiss nicht, die Zähne zu putzen.', en: 'Don\'t forget to brush your teeth.' }] },
      { de: 'die Haare waschen', en: 'to wash hair', hint: 'Hygiene', examples: [{ de: 'Ich wasche mir die Haare.', en: 'I wash my hair.' }] },
      { de: 'rasieren', en: 'to shave', hint: 'Remove hair', examples: [{ de: 'Er rasiert sich jeden Morgen.', en: 'He shaves every morning.' }] },
      { de: 'das Frühstück machen', en: 'to make breakfast', hint: 'Prepare morning meal', examples: [{ de: 'Ich mache das Frühstück für die Familie.', en: 'I make breakfast for the family.' }] },
      { de: 'das Geschirr spülen', en: 'to wash dishes', hint: 'Clean dishes', examples: [{ de: 'Nach dem Essen spüle ich das Geschirr.', en: 'After eating, I wash the dishes.' }] },
      { de: 'abwaschen', en: 'to wash up', hint: 'Clean dishes', examples: [{ de: 'Kannst du abwaschen?', en: 'Can you wash up?' }] },
      { de: 'den Tisch decken', en: 'to set the table', hint: 'Prepare table for meal', examples: [{ de: 'Hilfst du mir, den Tisch zu decken?', en: 'Can you help me set the table?' }] },
      { de: 'den Tisch abräumen', en: 'to clear the table', hint: 'Remove dishes', examples: [{ de: 'Nach dem Essen räumen wir den Tisch ab.', en: 'After eating, we clear the table.' }] },
      { de: 'zur Arbeit gehen', en: 'to go to work', hint: 'Commute to job', examples: [{ de: 'Ich gehe um 8 Uhr zur Arbeit.', en: 'I go to work at 8.' }] },
      { de: 'Feierabend haben', en: 'to finish work', hint: 'End of workday', examples: [{ de: 'Um 17 Uhr habe ich Feierabend.', en: 'At 5 p.m., I finish work.' }] },
      { de: 'nach Hause kommen', en: 'to come home', hint: 'Return home', examples: [{ de: 'Abends komme ich nach Hause.', en: 'In the evening I come home.' }] },
      { de: 'zu Abend essen', en: 'to have dinner', hint: 'Evening meal', examples: [{ de: 'Wir essen um 19 Uhr zu Abend.', en: 'We have dinner at 7 p.m.' }] },
      { de: 'fernsehen', en: 'to watch TV', hint: 'TV viewing', examples: [{ de: 'Abends sehe ich gerne fern.', en: 'In the evening I like watching TV.' }] },
      { de: 'ins Bett gehen', en: 'to go to bed', hint: 'Go to sleep', examples: [{ de: 'Ich gehe um 22 Uhr ins Bett.', en: 'I go to bed at 10 p.m.' }] },
      { de: 'einschlafen', en: 'to fall asleep', hint: 'Start sleeping', examples: [{ de: 'Ich schlafe schnell ein.', en: 'I fall asleep quickly.' }] },
      { de: 'ausschlafen', en: 'to sleep in', hint: 'Sleep late', examples: [{ de: 'Am Wochenende schlafe ich aus.', en: 'On weekends I sleep in.' }] },
      { de: 'täglich', en: 'daily', hint: 'Every day', examples: [{ de: 'Ich lese täglich die Nachrichten.', en: 'I read the news daily.' }] },
      { de: 'wöchentlich', en: 'weekly', hint: 'Every week', examples: [{ de: 'Wir haben wöchentliche Meetings.', en: 'We have weekly meetings.' }] },
      { de: 'monatlich', en: 'monthly', hint: 'Every month', examples: [{ de: 'Die Miete wird monatlich bezahlt.', en: 'The rent is paid monthly.' }] },
      { de: 'jährlich', en: 'yearly', hint: 'Every year', examples: [{ de: 'Wir fahren jährlich in den Urlaub.', en: 'We go on vacation yearly.' }] },
      { de: 'der Werktag', en: 'workday', hint: 'Monday to Friday', examples: [{ de: 'Am Werktag muss ich früh aufstehen.', en: 'On workdays I have to get up early.' }] },
      { de: 'unter der Woche', en: 'during the week', hint: 'Not weekend', examples: [{ de: 'Unter der Woche arbeite ich.', en: 'During the week, I work.' }] },
      { de: 'heute Morgen', en: 'this morning', hint: 'Earlier today', examples: [{ de: 'Heute Morgen habe ich verschlafen.', en: 'This morning I overslept.' }] },
      { de: 'heute Abend', en: 'this evening', hint: 'Later today', examples: [{ de: 'Heute Abend gehe ich ins Kino.', en: 'This evening I am going to the cinema.' }] },
      { de: 'morgen früh', en: 'tomorrow morning', hint: 'Morning of next day', examples: [{ de: 'Morgen früh muss ich zum Arzt.', en: 'Tomorrow morning I have to go to the doctor.' }] },
      { de: 'übermorgen', en: 'day after tomorrow', hint: 'Two days from now', examples: [{ de: 'Übermorgen ist mein Geburtstag.', en: 'The day after tomorrow is my birthday.' }] },
      { de: 'vorgestern', en: 'day before yesterday', hint: 'Two days ago', examples: [{ de: 'Vorgestern war ich im Kino.', en: 'The day before yesterday I was at the cinema.' }] },
      { de: 'täglich', en: 'daily', hint: 'Every day', examples: [{ de: 'Ich dusche täglich.', en: 'I shower daily.' }] },
      { de: 'abends', en: 'in the evenings', hint: 'Regularly in evening', examples: [{ de: 'Abends lese ich ein Buch.', en: 'In the evenings I read a book.' }] },
      { de: 'morgens', en: 'in the mornings', hint: 'Regularly in morning', examples: [{ de: 'Morgens trinke ich Kaffee.', en: 'In the mornings I drink coffee.' }] },
      { de: 'nachts', en: 'at night', hint: 'During night', examples: [{ de: 'Nachts schlafe ich.', en: 'At night I sleep.' }] },
      { de: 'mittags', en: 'at noon', hint: 'Around 12', examples: [{ de: 'Mittags esse ich in der Kantine.', en: 'At noon I eat in the cafeteria.' }] },
      { de: 'nachmittags', en: 'in the afternoons', hint: 'After 12', examples: [{ de: 'Nachmittags mache ich oft Sport.', en: 'In the afternoons I often do sports.' }] },
      { de: 'einmal', en: 'once', hint: 'One time', examples: [{ de: 'Einmal pro Woche gehe ich schwimmen.', en: 'Once a week I go swimming.' }] },
      { de: 'zweimal', en: 'twice', hint: 'Two times', examples: [{ de: 'Ich putze zweimal täglich die Zähne.', en: 'I brush my teeth twice a day.' }] },
      { de: 'dreimal', en: 'three times', hint: 'Three times', examples: [{ de: 'Dreimal pro Woche koche ich.', en: 'Three times a week I cook.' }] },
      { de: 'jeden Tag', en: 'every day', hint: 'Daily', examples: [{ de: 'Jeden Tag gehe ich zur Arbeit.', en: 'Every day I go to work.' }] },
      { de: 'jede Woche', en: 'every week', hint: 'Weekly', examples: [{ de: 'Jede Woche rufe ich meine Mutter an.', en: 'Every week I call my mother.' }] },
      { de: 'jedes Jahr', en: 'every year', hint: 'Yearly', examples: [{ de: 'Jedes Jahr feiern wir Weihnachten.', en: 'Every year we celebrate Christmas.' }] },
      { de: 'am Wochenende', en: 'on the weekend', hint: 'Saturday/Sunday', examples: [{ de: 'Am Wochenende habe ich frei.', en: 'On the weekend I am free.' }] },
      { de: 'in der Freizeit', en: 'in free time', hint: 'Leisure time', examples: [{ de: 'In der Freizeit spiele ich Fußball.', en: 'In my free time I play soccer.' }] },

      // Work & Education (80)
      { de: 'die Arbeit', en: 'work', hint: 'Job', examples: [{ de: 'Ich gehe zur Arbeit.', en: 'I go to work.' }] },
      { de: 'der Beruf', en: 'profession', hint: 'Career', examples: [{ de: 'Was ist dein Beruf?', en: 'What is your job?' }] },
      { de: 'der Job', en: 'job', hint: 'Work', examples: [{ de: 'Er hat einen neuen Job.', en: 'He has a new job.' }] },
      { de: 'die Stelle', en: 'position', hint: 'Job opening', examples: [{ de: 'Die Stelle ist zu besetzen.', en: 'The position is to be filled.' }] },
      { de: 'der Arbeitgeber', en: 'employer', hint: 'The boss/company', examples: [{ de: 'Mein Arbeitgeber ist sehr fair.', en: 'My employer is very fair.' }] },
      { de: 'der Arbeitnehmer', en: 'employee', hint: 'Worker', examples: [{ de: 'Die Arbeitnehmer haben Rechte.', en: 'Employees have rights.' }] },
      { de: 'der Kollege / die Kollegin', en: 'colleague', hint: 'Co-worker', examples: [{ de: 'Meine Kollegin ist sehr nett.', en: 'My colleague is very nice.' }] },
      { de: 'der Chef / die Chefin', en: 'boss', hint: 'Superior', examples: [{ de: 'Der Chef ist heute nicht da.', en: 'The boss is not here today.' }] },
      { de: 'das Büro', en: 'office', hint: 'Workplace', examples: [{ de: 'Im Büro arbeite ich am Computer.', en: 'In the office I work on the computer.' }] },
      { de: 'die Firma', en: 'company', hint: 'Business', examples: [{ de: 'Er arbeitet bei einer großen Firma.', en: 'He works at a large company.' }] },
      { de: 'die Abteilung', en: 'department', hint: 'Division', examples: [{ de: 'In welcher Abteilung arbeitest du?', en: 'In which department do you work?' }] },
      { de: 'das Meeting', en: 'meeting', hint: 'Work gathering', examples: [{ de: 'Das Meeting beginnt um 10 Uhr.', en: 'The meeting starts at 10.' }] },
      { de: 'die Besprechung', en: 'meeting', hint: 'Discussion', examples: [{ de: 'In der Besprechung besprechen wir Projekte.', en: 'In the meeting we discuss projects.' }] },
      { de: 'die Konferenz', en: 'conference', hint: 'Large meeting', examples: [{ de: 'Auf der Konferenz sind viele Leute.', en: 'Many people are at the conference.' }] },
      { de: 'das Projekt', en: 'project', hint: 'Work task', examples: [{ de: 'Das Projekt ist sehr interessant.', en: 'The project is very interesting.' }] },
      { de: 'die Aufgabe', en: 'task', hint: 'Something to do', examples: [{ de: 'Ich habe viele Aufgaben.', en: 'I have many tasks.' }] },
      { de: 'die Frist', en: 'deadline', hint: 'Time limit', examples: [{ de: 'Die Frist endet morgen.', en: 'The deadline ends tomorrow.' }] },
      { de: 'die Pause', en: 'break', hint: 'Rest time', examples: [{ de: 'In der Pause trinke ich Kaffee.', en: 'During the break I drink coffee.' }] },
      { de: 'die Mittagspause', en: 'lunch break', hint: 'Break for lunch', examples: [{ de: 'In der Mittagspause esse ich.', en: 'During the lunch break I eat.' }] },
      { de: 'der Urlaub', en: 'vacation', hint: 'Time off', examples: [{ de: 'Ich habe 30 Tage Urlaub.', en: 'I have 30 days of vacation.' }] },
      { de: 'der Krankenstand', en: 'sick leave', hint: 'When ill', examples: [{ de: 'Er ist im Krankenstand.', en: 'He is on sick leave.' }] },
      { de: 'krankgeschrieben', en: 'on sick leave', hint: 'Doctor\'s note', examples: [{ de: 'Der Arzt hat mich krankgeschrieben.', en: 'The doctor put me on sick leave.' }] },
      { de: 'die Überstunden', en: 'overtime', hint: 'Extra hours', examples: [{ de: 'Ich mache diese Woche Überstunden.', en: 'I am working overtime this week.' }] },
      { de: 'das Gehalt', en: 'salary', hint: 'Monthly pay', examples: [{ de: 'Das Gehalt wird am Ende des Monats überwiesen.', en: 'The salary is transferred at the end of the month.' }] },
      { de: 'der Lohn', en: 'wage', hint: 'Hourly pay', examples: [{ de: 'Der Lohn ist niedrig.', en: 'The wage is low.' }] },
      { de: 'die Steuer', en: 'tax', hint: 'Money to state', examples: [{ de: 'Vom Gehalt wird Steuer abgezogen.', en: 'Tax is deducted from the salary.' }] },
      { de: 'das Einkommen', en: 'income', hint: 'Money earned', examples: [{ de: 'Mein Einkommen reicht aus.', en: 'My income is sufficient.' }] },
      { de: 'die Ausbildung', en: 'training', hint: 'Vocational education', examples: [{ de: 'Er macht eine Ausbildung zum Elektriker.', en: 'He is doing training to become an electrician.' }] },
      { de: 'das Studium', en: 'university studies', hint: 'Higher education', examples: [{ de: 'Mein Studium dauert 4 Jahre.', en: 'My studies last 4 years.' }] },
      { de: 'der Student / die Studentin', en: 'university student', hint: 'At university', examples: [{ de: 'Die Studenten lernen für die Prüfung.', en: 'The students study for the exam.' }] },
      { de: 'der Professor / die Professorin', en: 'professor', hint: 'Teaches at university', examples: [{ de: 'Der Professor hält eine Vorlesung.', en: 'The professor gives a lecture.' }] },
      { de: 'die Vorlesung', en: 'lecture', hint: 'University class', examples: [{ de: 'Die Vorlesung ist um 8 Uhr.', en: 'The lecture is at 8.' }] },
      { de: 'das Seminar', en: 'seminar', hint: 'Interactive class', examples: [{ de: 'Im Seminar diskutieren wir.', en: 'In the seminar we discuss.' }] },
      { de: 'der Kurs', en: 'course', hint: 'Class', examples: [{ de: 'Ich besuche einen Deutschkurs.', en: 'I attend a German course.' }] },
      { de: 'der Sprachkurs', en: 'language course', hint: 'Learn language', examples: [{ de: 'Der Sprachkurs ist sehr gut.', en: 'The language course is very good.' }] },
      { de: 'das Niveau', en: 'level', hint: 'Proficiency', examples: [{ de: 'Welches Niveau hast du?', en: 'Which level do you have?' }] },
      { de: 'die Prüfung', en: 'exam', hint: 'Test', examples: [{ de: 'Die Prüfung ist schwer.', en: 'The exam is difficult.' }] },
      { de: 'bestehen', en: 'to pass', hint: 'Succeed in exam', examples: [{ de: 'Ich habe die Prüfung bestanden!', en: 'I passed the exam!' }] },
      { de: 'durchfallen', en: 'to fail', hint: 'Not pass', examples: [{ de: 'Leider bin ich durchgefallen.', en: 'Unfortunately, I failed.' }] },
      { de: 'das Zeugnis', en: 'certificate', hint: 'Proof of passing', examples: [{ de: 'Das Zeugnis bekomme ich später.', en: 'I get the certificate later.' }] },
      { de: 'die Note', en: 'grade', hint: 'Score', examples: [{ de: 'Ich habe eine gute Note.', en: 'I have a good grade.' }] },
      { de: 'lernen', en: 'to learn', hint: 'Study', examples: [{ de: 'Ich lerne für die Prüfung.', en: 'I am studying for the exam.' }] },
      { de: 'üben', en: 'to practice', hint: 'Do exercises', examples: [{ de: 'Wir üben Grammatik.', en: 'We practice grammar.' }] },
      { de: 'wiederholen', en: 'to repeat', hint: 'Do again', examples: [{ de: 'Ich wiederhole die Vokabeln.', en: 'I repeat the vocabulary.' }] },
      { de: 'verstehen', en: 'to understand', hint: 'Comprehend', examples: [{ de: 'Verstehst du die Aufgabe?', en: 'Do you understand the task?' }] },
      { de: 'erklären', en: 'to explain', hint: 'Make clear', examples: [{ de: 'Kannst du das erklären?', en: 'Can you explain that?' }] },
      { de: 'die Schule', en: 'school', hint: 'Educational institution', examples: [{ de: 'Die Kinder gehen zur Schule.', en: 'The children go to school.' }] },
      { de: 'die Klasse', en: 'class', hint: 'Group of students', examples: [{ de: 'In meiner Klasse sind 20 Schüler.', en: 'In my class there are 20 students.' }] },
      { de: 'der Schüler / die Schülerin', en: 'pupil', hint: 'School student', examples: [{ de: 'Die Schülerin lernt Deutsch.', en: 'The pupil learns German.' }] },
      { de: 'der Lehrer / die Lehrerin', en: 'teacher', hint: 'Educator', examples: [{ de: 'Die Lehrerin erklärt die Übung.', en: 'The teacher explains the exercise.' }] },
      { de: 'das Fach', en: 'subject', hint: 'School subject', examples: [{ de: 'Mein Lieblingsfach ist Mathe.', en: 'My favorite subject is math.' }] },
      { de: 'Mathematik', en: 'mathematics', hint: 'Math', examples: [{ de: 'Mathematik ist nicht einfach.', en: 'Mathematics is not easy.' }] },
      { de: 'Deutsch', en: 'German', hint: 'Language', examples: [{ de: 'Ich lerne Deutsch.', en: 'I learn German.' }] },
      { de: 'Englisch', en: 'English', hint: 'Language', examples: [{ de: 'Sprichst du Englisch?', en: 'Do you speak English?' }] },
      { de: 'Geschichte', en: 'history', hint: 'Past events', examples: [{ de: 'Im Geschichtsunterricht lernen wir über Kriege.', en: 'In history class we learn about wars.' }] },
      { de: 'Biologie', en: 'biology', hint: 'Life science', examples: [{ de: 'Biologie ist interessant.', en: 'Biology is interesting.' }] },
      { de: 'Chemie', en: 'chemistry', hint: 'Science', examples: [{ de: 'In Chemie machen wir Experimente.', en: 'In chemistry we do experiments.' }] },
      { de: 'Physik', en: 'physics', hint: 'Science', examples: [{ de: 'Physik ist schwer.', en: 'Physics is difficult.' }] },
      { de: 'Kunst', en: 'art', hint: 'Creative subject', examples: [{ de: 'In Kunst male ich gerne.', en: 'In art I like to paint.' }] },
      { de: 'Musik', en: 'music', hint: 'Subject', examples: [{ de: 'In Musik singen wir.', en: 'In music we sing.' }] },
      { de: 'Sport', en: 'sports', hint: 'Physical education', examples: [{ de: 'Im Sportunterricht spielen wir Fußball.', en: 'In sports class we play soccer.' }] },
      { de: 'die Hausaufgaben', en: 'homework', hint: 'Work for home', examples: [{ de: 'Ich mache meine Hausaufgaben.', en: 'I do my homework.' }] },
      { de: 'der Stundenplan', en: 'timetable', hint: 'Class schedule', examples: [{ de: 'Am Montag habe ich viel im Stundenplan.', en: 'On Monday I have a lot on my timetable.' }] },
      { de: 'die Stunde', en: 'hour, lesson', hint: '45-60 min class', examples: [{ de: 'Wir haben zwei Stunden Deutsch.', en: 'We have two hours of German.' }] },
      { de: 'die Pause', en: 'break', hint: 'Between classes', examples: [{ de: 'In der Pause essen wir.', en: 'During the break we eat.' }] },
      { de: 'die Universität', en: 'university', hint: 'Higher education', examples: [{ de: 'Die Universität ist groß.', en: 'The university is big.' }] },
      { de: 'die Bibliothek', en: 'library', hint: 'Place with books', examples: [{ de: 'In der Bibliothek lerne ich.', en: 'I study in the library.' }] },
      { de: 'der Abschluss', en: 'degree', hint: 'Completion', examples: [{ de: 'Nach dem Studium bekomme ich einen Abschluss.', en: 'After my studies I get a degree.' }] },
      { de: 'die Bewerbung', en: 'application', hint: 'For job', examples: [{ de: 'Ich schreibe eine Bewerbung.', en: 'I write an application.' }] },
      { de: 'der Lebenslauf', en: 'CV', hint: 'Resume', examples: [{ de: 'Im Lebenslauf stehen meine Erfahrungen.', en: 'In my CV are my experiences.' }] },
      { de: 'das Vorstellungsgespräch', en: 'job interview', hint: 'Interview', examples: [{ de: 'Das Vorstellungsgespräch war gut.', en: 'The job interview was good.' }] },
      { de: 'sich bewerben', en: 'to apply', hint: 'Submit application', examples: [{ de: 'Ich bewerbe mich auf die Stelle.', en: 'I apply for the position.' }] },
      { de: 'einstellen', en: 'to hire', hint: 'Give job', examples: [{ de: 'Die Firma stellt neue Mitarbeiter ein.', en: 'The company hires new employees.' }] },
      { de: 'kündigen', en: 'to quit', hint: 'Leave job', examples: [{ de: 'Er hat gekündigt.', en: 'He quit.' }] },
      { de: 'entlassen', en: 'to fire', hint: 'Lose job', examples: [{ de: 'Sie wurde entlassen.', en: 'She was fired.' }] },
      { de: 'die Arbeitslosigkeit', en: 'unemployment', hint: 'No job', examples: [{ de: 'Die Arbeitslosigkeit ist gestiegen.', en: 'Unemployment has risen.' }] },
      { de: 'der Arbeitsvertrag', en: 'employment contract', hint: 'Job agreement', examples: [{ de: 'Den Arbeitsvertrag unterschreiben.', en: 'Sign the employment contract.' }] },
      { de: 'die Probezeit', en: 'probation period', hint: 'Trial period', examples: [{ de: 'In der Probezeit kann man leicht kündigen.', en: 'During probation you can easily quit.' }] },

      // Health & Body (80)
      { de: 'der Körper', en: 'body', hint: 'Physical self', examples: [{ de: 'Der menschliche Körper.', en: 'The human body.' }] },
      { de: 'der Kopf', en: 'head', hint: 'Top of body', examples: [{ de: 'Mein Kopf tut weh.', en: 'My head hurts.' }] },
      { de: 'das Gesicht', en: 'face', hint: 'Front of head', examples: [{ de: 'Ihr Gesicht ist rot.', en: 'Her face is red.' }] },
      { de: 'das Auge', en: 'eye', hint: 'See with them', examples: [{ de: 'Sie hat blaue Augen.', en: 'She has blue eyes.' }] },
      { de: 'die Nase', en: 'nose', hint: 'Smell with it', examples: [{ de: 'Die Nase läuft.', en: 'The nose is running.' }] },
      { de: 'der Mund', en: 'mouth', hint: 'Eat and speak', examples: [{ de: 'Öffne den Mund.', en: 'Open your mouth.' }] },
      { de: 'das Ohr', en: 'ear', hint: 'Hear with them', examples: [{ de: 'Die Ohren sind klein.', en: 'The ears are small.' }] },
      { de: 'die Haare', en: 'hair', hint: 'On head', examples: [{ de: 'Sie hat lange Haare.', en: 'She has long hair.' }] },
      { de: 'der Hals', en: 'neck', hint: 'Connects head/body', examples: [{ de: 'Der Hals tut weh.', en: 'The throat/neck hurts.' }] },
      { de: 'die Schulter', en: 'shoulder', hint: 'Joint', examples: [{ de: 'Die Schulter schmerzt.', en: 'The shoulder hurts.' }] },
      { de: 'der Arm', en: 'arm', hint: 'From shoulder to hand', examples: [{ de: 'Er hat starke Arme.', en: 'He has strong arms.' }] },
      { de: 'die Hand', en: 'hand', hint: 'At end of arm', examples: [{ de: 'Die Hände sind kalt.', en: 'The hands are cold.' }] },
      { de: 'der Finger', en: 'finger', hint: 'On hand', examples: [{ de: 'Sie trägt einen Ring am Finger.', en: 'She wears a ring on her finger.' }] },
      { de: 'der Rücken', en: 'back', hint: 'Behind', examples: [{ de: 'Der Rücken tut weh.', en: 'The back hurts.' }] },
      { de: 'der Bauch', en: 'stomach', hint: 'Tummy', examples: [{ de: 'Ich habe Bauchschmerzen.', en: 'I have a stomachache.' }] },
      { de: 'das Bein', en: 'leg', hint: 'For walking', examples: [{ de: 'Mein Bein ist gebrochen.', en: 'My leg is broken.' }] },
      { de: 'das Knie', en: 'knee', hint: 'Joint', examples: [{ de: 'Das Knie schmerzt.', en: 'The knee hurts.' }] },
      { de: 'der Fuß', en: 'foot', hint: 'At end of leg', examples: [{ de: 'Meine Füße tun weh.', en: 'My feet hurt.' }] },
      { de: 'der Zeh', en: 'toe', hint: 'On foot', examples: [{ de: 'Der kleine Zeh.', en: 'The little toe.' }] },
      { de: 'die Haut', en: 'skin', hint: 'Outer covering', examples: [{ de: 'Die Haut ist trocken.', en: 'The skin is dry.' }] },
      { de: 'das Blut', en: 'blood', hint: 'Red liquid', examples: [{ de: 'Blut ist rot.', en: 'Blood is red.' }] },
      { de: 'das Herz', en: 'heart', hint: 'Pumps blood', examples: [{ de: 'Mein Herz schlägt schnell.', en: 'My heart beats fast.' }] },
      { de: 'die Gesundheit', en: 'health', hint: 'Well-being', examples: [{ de: 'Gesundheit ist wichtig.', en: 'Health is important.' }] },
      { de: 'gesund', en: 'healthy', hint: 'In good health', examples: [{ de: 'Ich bin gesund.', en: 'I am healthy.' }] },
      { de: 'krank', en: 'sick', hint: 'Ill', examples: [{ de: 'Er ist krank.', en: 'He is sick.' }] },
      { de: 'der Arzt / die Ärztin', en: 'doctor', hint: 'Medical professional', examples: [{ de: 'Ich muss zum Arzt.', en: 'I have to go to the doctor.' }] },
      { de: 'die Ärztin', en: 'doctor (female)', hint: 'Female doctor', examples: [{ de: 'Die Ärztin untersucht mich.', en: 'The doctor examines me.' }] },
      { de: 'die Krankenschwester', en: 'nurse', hint: 'Medical helper', examples: [{ de: 'Die Krankenschwester gibt mir eine Spritze.', en: 'The nurse gives me an injection.' }] },
      { de: 'der Patient / die Patientin', en: 'patient', hint: 'Person in care', examples: [{ de: 'Der Patient wartet.', en: 'The patient is waiting.' }] },
      { de: 'das Krankenhaus', en: 'hospital', hint: 'Medical facility', examples: [{ de: 'Sie liegt im Krankenhaus.', en: 'She is in the hospital.' }] },
      { de: 'die Praxis', en: 'doctor\'s office', hint: 'Smaller than hospital', examples: [{ de: 'In der Praxis sitzen viele Patienten.', en: 'In the doctor\'s office, many patients sit.' }] },
      { de: 'die Sprechstunde', en: 'consultation hour', hint: 'When doctor sees patients', examples: [{ de: 'Die Sprechstunde ist von 9-12.', en: 'Consultation hours are from 9-12.' }] },
      { de: 'der Termin', en: 'appointment', hint: 'Scheduled time', examples: [{ de: 'Ich habe einen Termin beim Arzt.', en: 'I have an appointment with the doctor.' }] },
      { de: 'die Untersuchung', en: 'examination', hint: 'Check-up', examples: [{ de: 'Die Untersuchung dauert 20 Minuten.', en: 'The examination takes 20 minutes.' }] },
      { de: 'die Krankheit', en: 'illness', hint: 'Sickness', examples: [{ de: 'Eine schwere Krankheit.', en: 'A serious illness.' }] },
      { de: 'die Erkältung', en: 'cold', hint: 'Common illness', examples: [{ de: 'Ich habe eine Erkältung.', en: 'I have a cold.' }] },
      { de: 'der Schnupfen', en: 'runny nose', hint: 'Cold symptom', examples: [{ de: 'Schnupfen und Husten.', en: 'Runny nose and cough.' }] },
      { de: 'der Husten', en: 'cough', hint: 'From throat', examples: [{ de: 'Ich habe starken Husten.', en: 'I have a bad cough.' }] },
      { de: 'das Fieber', en: 'fever', hint: 'High temperature', examples: [{ de: '38 Grad Fieber.', en: '38 degrees fever.' }] },
      { de: 'die Grippe', en: 'flu', hint: 'Severe illness', examples: [{ de: 'Grippe ist schlimmer als eine Erkältung.', en: 'Flu is worse than a cold.' }] },
      { de: 'die Schmerzen', en: 'pain', hint: 'Hurting', examples: [{ de: 'Ich habe Schmerzen im Rücken.', en: 'I have pain in my back.' }] },
      { de: 'Kopfschmerzen', en: 'headache', hint: 'Pain in head', examples: [{ de: 'Ich habe Kopfschmerzen.', en: 'I have a headache.' }] },
      { de: 'Bauchschmerzen', en: 'stomachache', hint: 'Pain in stomach', examples: [{ de: 'Nach dem Essen habe ich Bauchschmerzen.', en: 'After eating, I have a stomachache.' }] },
      { de: 'Rückenschmerzen', en: 'back pain', hint: 'Pain in back', examples: [{ de: 'Vom vielen Sitzen bekomme ich Rückenschmerzen.', en: 'From sitting a lot, I get back pain.' }] },
      { de: 'Zahnschmerzen', en: 'toothache', hint: 'Pain in teeth', examples: [{ de: 'Ich muss zum Zahnarzt, ich habe Zahnschmerzen.', en: 'I have to go to the dentist, I have a toothache.' }] },
      { de: 'die Verletzung', en: 'injury', hint: 'Damage', examples: [{ de: 'Eine Sportverletzung.', en: 'A sports injury.' }] },
      { de: 'sich verletzen', en: 'to injure oneself', hint: 'Get hurt', examples: [{ de: 'Ich habe mich am Bein verletzt.', en: 'I injured my leg.' }] },
      { de: 'der Unfall', en: 'accident', hint: 'Bad event', examples: [{ de: 'Ein Autounfall.', en: 'A car accident.' }] },
      { de: 'die Tablette', en: 'pill', hint: 'Medicine', examples: [{ de: 'Der Arzt verschreibt Tabletten.', en: 'The doctor prescribes pills.' }] },
      { de: 'das Medikament', en: 'medication', hint: 'Medicine', examples: [{ de: 'Das Medikament hilft gegen Schmerzen.', en: 'The medication helps against pain.' }] },
      { de: 'das Rezept', en: 'prescription', hint: 'Doctor\'s note for meds', examples: [{ de: 'Der Arzt gibt mir ein Rezept.', en: 'The doctor gives me a prescription.' }] },
      { de: 'die Apotheke', en: 'pharmacy', hint: 'Where you get medicine', examples: [{ de: 'In der Apotheke kaufe ich Medikamente.', en: 'In the pharmacy, I buy medication.' }] },
      { de: 'das Krankenkasse', en: 'health insurance', hint: 'Pays for healthcare', examples: [{ de: 'Die Krankenkasse übernimmt die Kosten.', en: 'The health insurance covers the costs.' }] },
      { de: 'versichert', en: 'insured', hint: 'Has insurance', examples: [{ de: 'Bist du versichert?', en: 'Are you insured?' }] },
      { de: 'die Versicherungskarte', en: 'insurance card', hint: 'Show at doctor', examples: [{ de: 'Bitte die Versicherungskarte.', en: 'Your insurance card, please.' }] },
      { de: 'der Zahnarzt', en: 'dentist', hint: 'Teeth doctor', examples: [{ de: 'Ich habe Angst vorm Zahnarzt.', en: 'I am afraid of the dentist.' }] },
      { de: 'der Facharzt', en: 'specialist', hint: 'Specialized doctor', examples: [{ de: 'Überweisung zum Facharzt.', en: 'Referral to a specialist.' }] },
      { de: 'die Überweisung', en: 'referral', hint: 'To see specialist', examples: [{ de: 'Vom Hausarzt bekomme ich eine Überweisung.', en: 'From the general practitioner I get a referral.' }] },
      { de: 'das Rezept', en: 'prescription', hint: 'For medicine', examples: [{ de: 'Das Rezept in der Apotheke einlösen.', en: 'Fill the prescription at the pharmacy.' }] },
      { de: 'die Impfung', en: 'vaccination', hint: 'Prevents disease', examples: [{ de: 'Die Grippeimpfung.', en: 'The flu shot.' }] },
      { de: 'die OP', en: 'surgery (operation)', hint: 'Medical procedure', examples: [{ de: 'Er musste in die OP.', en: 'He had to go into surgery.' }] },
      { de: 'sich ausruhen', en: 'to rest', hint: 'Relax', examples: [{ de: 'Nach der Arbeit ruhe ich mich aus.', en: 'After work I rest.' }] },
      { de: 'sich erholen', en: 'to recover', hint: 'Get better', examples: [{ de: 'Ich erhole mich von der Krankheit.', en: 'I am recovering from the illness.' }] },
      { de: 'schlafen', en: 'to sleep', hint: 'Rest', examples: [{ de: 'Ich schlafe acht Stunden.', en: 'I sleep eight hours.' }] },
      { de: 'die Diät', en: 'diet', hint: 'Controlled eating', examples: [{ de: 'Ich mache eine Diät.', en: 'I am on a diet.' }] },
      { de: 'abnehmen', en: 'to lose weight', hint: 'Get thinner', examples: [{ de: 'Ich möchte abnehmen.', en: 'I want to lose weight.' }] },
      { de: 'zunehmen', en: 'to gain weight', hint: 'Get heavier', examples: [{ de: 'Im Urlaub habe ich zugenommen.', en: 'On vacation I gained weight.' }] },
      { de: 'Sport treiben', en: 'to do sports', hint: 'Exercise', examples: [{ de: 'Ich treibe zweimal pro Woche Sport.', en: 'I do sports twice a week.' }] },
      { de: 'das Fitnessstudio', en: 'gym', hint: 'Place to exercise', examples: [{ de: 'Im Fitnessstudio trainiere ich.', en: 'I train at the gym.' }] },
      { de: 'joggen', en: 'to jog', hint: 'Running', examples: [{ de: 'Im Park jogge ich.', en: 'I jog in the park.' }] },
      { de: 'schwimmen', en: 'to swim', hint: 'In water', examples: [{ de: 'Schwimmen ist gesund.', en: 'Swimming is healthy.' }] },
      { de: 'der Fußball', en: 'soccer', hint: 'Sport', examples: [{ de: 'Fußball ist beliebt.', en: 'Soccer is popular.' }] },
      { de: 'das Training', en: 'training', hint: 'Practice', examples: [{ de: 'Das Training ist anstrengend.', en: 'The training is strenuous.' }] },
      { de: 'die Bewegung', en: 'movement', hint: 'Physical activity', examples: [{ de: 'Bewegung ist gut für die Gesundheit.', en: 'Movement is good for health.' }] },
      { de: 'entspannen', en: 'to relax', hint: 'De-stress', examples: [{ de: 'Am Wochenende entspanne ich.', en: 'On the weekend I relax.' }] },
      { de: 'der Stress', en: 'stress', hint: 'Pressure', examples: [{ de: 'Stress ist ungesund.', en: 'Stress is unhealthy.' }] },
      { de: 'die Massage', en: 'massage', hint: 'Relaxing treatment', examples: [{ de: 'Eine Massage tut gut.', en: 'A massage feels good.' }] },
      { de: 'die Sauna', en: 'sauna', hint: 'Hot room', examples: [{ de: 'In der Sauna schwitze ich.', en: 'In the sauna I sweat.' }] },

      // Leisure & Hobbies (100)
      { de: 'die Freizeit', en: 'free time', hint: 'Leisure', examples: [{ de: 'In meiner Freizeit lese ich.', en: 'In my free time I read.' }] },
      { de: 'das Hobby', en: 'hobby', hint: 'Leisure activity', examples: [{ de: 'Mein Hobby ist Fotografieren.', en: 'My hobby is photography.' }] },
      { de: 'der Sport', en: 'sports', hint: 'Physical activity', examples: [{ de: 'Sport macht Spaß.', en: 'Sports are fun.' }] },
      { de: 'das Fußballspiel', en: 'soccer game', hint: 'Match', examples: [{ de: 'Wir gehen zum Fußballspiel.', en: 'We go to the soccer game.' }] },
      { de: 'der Verein', en: 'club', hint: 'Organized group', examples: [{ de: 'Er ist in einem Sportverein.', en: 'He is in a sports club.' }] },
      { de: 'das Konzert', en: 'concert', hint: 'Music event', examples: [{ de: 'Das Konzert war super.', en: 'The concert was great.' }] },
      { de: 'das Kino', en: 'cinema', hint: 'Movie theater', examples: [{ de: 'Ins Kino gehen.', en: 'Go to the cinema.' }] },
      { de: 'der Film', en: 'movie', hint: 'Film', examples: [{ de: 'Welcher Film läuft heute?', en: 'Which movie is playing today?' }] },
      { de: 'das Theater', en: 'theater', hint: 'Live performance', examples: [{ de: 'Ins Theater gehen.', en: 'Go to the theater.' }] },
      { de: 'das Museum', en: 'museum', hint: 'Exhibition', examples: [{ de: 'Ins Museum gehen.', en: 'Go to the museum.' }] },
      { de: 'die Ausstellung', en: 'exhibition', hint: 'Art display', examples: [{ de: 'Eine Ausstellung besuchen.', en: 'Visit an exhibition.' }] },
      { de: 'die Kunst', en: 'art', hint: 'Creative works', examples: [{ de: 'Moderne Kunst.', en: 'Modern art.' }] },
      { de: 'malen', en: 'to paint', hint: 'Art activity', examples: [{ de: 'Ich male gern.', en: 'I like to paint.' }] },
      { de: 'zeichnen', en: 'to draw', hint: 'Pencil art', examples: [{ de: 'Sie zeichnet Porträts.', en: 'She draws portraits.' }] },
      { de: 'fotografieren', en: 'to photograph', hint: 'Take photos', examples: [{ de: 'Ich fotografiere die Natur.', en: 'I photograph nature.' }] },
      { de: 'die Kamera', en: 'camera', hint: 'For photos', examples: [{ de: 'Meine Kamera ist neu.', en: 'My camera is new.' }] },
      { de: 'das Foto', en: 'photo', hint: 'Picture', examples: [{ de: 'Ein Foto machen.', en: 'Take a photo.' }] },
      { de: 'das Buch', en: 'book', hint: 'Reading material', examples: [{ de: 'Ich lese ein Buch.', en: 'I read a book.' }] },
      { de: 'der Roman', en: 'novel', hint: 'Fiction book', examples: [{ de: 'Ein spannender Roman.', en: 'An exciting novel.' }] },
      { de: 'lesen', en: 'to read', hint: 'Activity', examples: [{ de: 'Ich lese jeden Tag.', en: 'I read every day.' }] },
      { de: 'die Zeitung', en: 'newspaper', hint: 'News', examples: [{ de: 'Die Zeitung lesen.', en: 'Read the newspaper.' }] },
      { de: 'die Zeitschrift', en: 'magazine', hint: 'Periodical', examples: [{ de: 'Eine Zeitschrift abonnieren.', en: 'Subscribe to a magazine.' }] },
      { de: 'die Musik', en: 'music', hint: 'Sound', examples: [{ de: 'Ich höre gerne Musik.', en: 'I like listening to music.' }] },
      { de: 'die Band', en: 'band', hint: 'Music group', examples: [{ de: 'Meine Lieblingsband spielt heute.', en: 'My favorite band is playing today.' }] },
      { de: 'das Lied', en: 'song', hint: 'Single piece of music', examples: [{ de: 'Ein schönes Lied.', en: 'A beautiful song.' }] },
      { de: 'singen', en: 'to sing', hint: 'Activity', examples: [{ de: 'Ich singe im Chor.', en: 'I sing in the choir.' }] },
      { de: 'tanzen', en: 'to dance', hint: 'Move to music', examples: [{ de: 'Sie tanzt gerne.', en: 'She likes to dance.' }] },
      { de: 'der Tanzkurs', en: 'dance class', hint: 'Learn dancing', examples: [{ de: 'Wir besuchen einen Tanzkurs.', en: 'We attend a dance class.' }] },
      { de: 'das Spiel', en: 'game', hint: 'Play activity', examples: [{ de: 'Ein Spiel spielen.', en: 'Play a game.' }] },
      { de: 'spielen', en: 'to play', hint: 'Activity', examples: [{ de: 'Die Kinder spielen im Garten.', en: 'The children play in the garden.' }] },
      { de: 'das Kartenspiel', en: 'card game', hint: 'Game with cards', examples: [{ de: 'Kartenspiele sind beliebt.', en: 'Card games are popular.' }] },
      { de: 'das Brettspiel', en: 'board game', hint: 'Game with board', examples: [{ de: 'Monopoly ist ein Brettspiel.', en: 'Monopoly is a board game.' }] },
      { de: 'das Videospiel', en: 'video game', hint: 'Electronic game', examples: [{ de: 'Ich spiele gerne Videospiele.', en: 'I like playing video games.' }] },
      { de: 'der Computer', en: 'computer', hint: 'Device', examples: [{ de: 'Am Computer arbeiten.', en: 'Work on the computer.' }] },
      { de: 'das Internet', en: 'internet', hint: 'Online', examples: [{ de: 'Im Internet surfen.', en: 'Surf the internet.' }] },
      { de: 'online sein', en: 'to be online', hint: 'Connected', examples: [{ de: 'Ich bin jeden Abend online.', en: 'I am online every evening.' }] },
      { de: 'die Webseite', en: 'website', hint: 'Online page', examples: [{ de: 'Auf der Webseite kann ich Deutsch lernen.', en: 'On the website I can learn German.' }] },
      { de: 'die App', en: 'app', hint: 'Application', examples: [{ de: 'Eine App herunterladen.', en: 'Download an app.' }] },
      { de: 'fernsehen', en: 'to watch TV', hint: 'TV', examples: [{ de: 'Abends sehe ich fern.', en: 'In the evenings I watch TV.' }] },
      { de: 'die Serie', en: 'series', hint: 'TV show', examples: [{ de: 'Eine spannende Serie.', en: 'An exciting series.' }] },
      { de: 'der Film', en: 'movie', hint: 'Film', examples: [{ de: 'Einen Film anschauen.', en: 'Watch a movie.' }] },
      { de: 'kochen', en: 'to cook', hint: 'Prepare food', examples: [{ de: 'Ich koche gerne neue Rezepte.', en: 'I like cooking new recipes.' }] },
      { de: 'backen', en: 'to bake', hint: 'Make cakes', examples: [{ de: 'Am Wochenende backe ich einen Kuchen.', en: 'On the weekend I bake a cake.' }] },
      { de: 'das Rezept', en: 'recipe', hint: 'Cooking instructions', examples: [{ de: 'Das Rezept ist einfach.', en: 'The recipe is simple.' }] },
      { de: 'die Zutat', en: 'ingredient', hint: 'Part of recipe', examples: [{ de: 'Alle Zutaten sind frisch.', en: 'All ingredients are fresh.' }] },
      { de: 'der Wein', en: 'wine', hint: 'Alcoholic drink', examples: [{ de: 'Ein Glas Wein trinken.', en: 'Drink a glass of wine.' }] },
      { de: 'das Bier', en: 'beer', hint: 'Alcoholic drink', examples: [{ de: 'Ein Bier bestellen.', en: 'Order a beer.' }] },
      { de: 'das Café', en: 'café', hint: 'Coffee shop', examples: [{ de: 'Im Café einen Kaffee trinken.', en: 'Drink a coffee in the café.' }] },
      { de: 'das Restaurant', en: 'restaurant', hint: 'Place to eat', examples: [{ de: 'Ins Restaurant gehen.', en: 'Go to a restaurant.' }] },
      { de: 'die Kneipe', en: 'pub', hint: 'Bar', examples: [{ de: 'In der Kneipe treffen wir Freunde.', en: 'We meet friends at the pub.' }] },
      { de: 'ausgehen', en: 'to go out', hint: 'Leave for fun', examples: [{ de: 'Am Samstag gehen wir aus.', en: 'On Saturday we go out.' }] },
      { de: 'die Party', en: 'party', hint: 'Celebration', examples: [{ de: 'Auf eine Party gehen.', en: 'Go to a party.' }] },
      { de: 'feiern', en: 'to celebrate', hint: 'Have fun', examples: [{ de: 'Wir feiern meinen Geburtstag.', en: 'We celebrate my birthday.' }] },
      { de: 'der Geburtstag', en: 'birthday', hint: 'Day of birth', examples: [{ de: 'Alles Gute zum Geburtstag!', en: 'Happy birthday!' }] },
      { de: 'das Geschenk', en: 'gift', hint: 'Present', examples: [{ de: 'Ein Geschenk bekommen.', en: 'Receive a gift.' }] },
      { de: 'die Einladung', en: 'invitation', hint: 'Ask to come', examples: [{ de: 'Eine Einladung zur Party.', en: 'An invitation to the party.' }] },
      { de: 'einladen', en: 'to invite', hint: 'Ask to come', examples: [{ de: 'Ich lade dich ein.', en: 'I invite you.' }] },
      { de: 'der Ausflug', en: 'excursion', hint: 'Short trip', examples: [{ de: 'Einen Ausflug machen.', en: 'Make an excursion.' }] },
      { de: 'die Reise', en: 'trip', hint: 'Travel', examples: [{ de: 'Eine Reise buchen.', en: 'Book a trip.' }] },
      { de: 'der Urlaub', en: 'vacation', hint: 'Holiday', examples: [{ de: 'In den Urlaub fahren.', en: 'Go on vacation.' }] },
      { de: 'das Hotel', en: 'hotel', hint: 'Accommodation', examples: [{ de: 'Im Hotel übernachten.', en: 'Stay overnight in a hotel.' }] },
      { de: 'die Jugendherberge', en: 'youth hostel', hint: 'Budget stay', examples: [{ de: 'In der Jugendherberge übernachten.', en: 'Stay in a youth hostel.' }] },
      { de: 'der Campingplatz', en: 'campsite', hint: 'Camping', examples: [{ de: 'Auf dem Campingplatz zelten.', en: 'Camp at the campsite.' }] },
      { de: 'das Zelt', en: 'tent', hint: 'For camping', examples: [{ de: 'Im Zelt schlafen.', en: 'Sleep in a tent.' }] },
      { de: 'wandern', en: 'to hike', hint: 'Walk in nature', examples: [{ de: 'In den Bergen wandern.', en: 'Hike in the mountains.' }] },
      { de: 'die Wanderung', en: 'hike', hint: 'Walking trip', examples: [{ de: 'Eine Wanderung machen.', en: 'Go on a hike.' }] },
      { de: 'der Spaziergang', en: 'walk', hint: 'Leisurely walk', examples: [{ de: 'Einen Spaziergang machen.', en: 'Go for a walk.' }] },
      { de: 'das Fahrrad', en: 'bicycle', hint: 'Bike', examples: [{ de: 'Mit dem Fahrrad fahren.', en: 'Ride a bike.' }] },
      { de: 'Rad fahren', en: 'to cycle', hint: 'Bike activity', examples: [{ de: 'Wir fahren am Wochenende Rad.', en: 'We cycle on the weekend.' }] },
      { de: 'schwimmen', en: 'to swim', hint: 'In water', examples: [{ de: 'Im See schwimmen.', en: 'Swim in the lake.' }] },
      { de: 'das Schwimmbad', en: 'swimming pool', hint: 'Place to swim', examples: [{ de: 'Ins Schwimmbad gehen.', en: 'Go to the swimming pool.' }] },
      { de: 'der Strand', en: 'beach', hint: 'Sandy shore', examples: [{ de: 'Am Strand liegen.', en: 'Lie on the beach.' }] },
      { de: 'die Sonne', en: 'sun', hint: 'Sunbathing', examples: [{ de: 'In der Sonne liegen.', en: 'Lie in the sun.' }] },
      { de: 'sich sonnen', en: 'to sunbathe', hint: 'Get tan', examples: [{ de: 'Ich sonne mich am Strand.', en: 'I sunbathe on the beach.' }] },
      { de: 'der Garten', en: 'garden', hint: 'Outdoor space', examples: [{ de: 'Im Garten arbeiten.', en: 'Work in the garden.' }] },
      { de: 'gärtnern', en: 'to garden', hint: 'Work in garden', examples: [{ de: 'Am Wochenende gärtnere ich.', en: 'On the weekend I garden.' }] },
      { de: 'das Haustier', en: 'pet', hint: 'Domestic animal', examples: [{ de: 'Hast du ein Haustier?', en: 'Do you have a pet?' }] },
      { de: 'der Hund', en: 'dog', hint: 'Pet', examples: [{ de: 'Mit dem Hund spazieren gehen.', en: 'Walk the dog.' }] },
      { de: 'die Katze', en: 'cat', hint: 'Pet', examples: [{ de: 'Die Katze schläft.', en: 'The cat sleeps.' }] },
      { de: 'basteln', en: 'to do crafts', hint: 'Handicrafts', examples: [{ de: 'Mit Kindern basteln.', en: 'Do crafts with children.' }] },
      { de: 'das Konzert', en: 'concert', hint: 'Music event', examples: [{ de: 'Auf ein Konzert gehen.', en: 'Go to a concert.' }] },
      { de: 'das Festival', en: 'festival', hint: 'Large event', examples: [{ de: 'Auf ein Musikfestival gehen.', en: 'Go to a music festival.' }] },
      { de: 'der Markt', en: 'market', hint: 'Marketplace', examples: [{ de: 'Auf den Markt gehen.', en: 'Go to the market.' }] },
      { de: 'der Flohmarkt', en: 'flea market', hint: 'Second-hand market', examples: [{ de: 'Auf dem Flohmarkt stöbern.', en: 'Browse at the flea market.' }] },
      { de: 'das Kaffee trinken', en: 'coffee drinking', hint: 'Social activity', examples: [{ de: 'Kaffee trinken mit Freunden.', en: 'Have coffee with friends.' }] },
      { de: 'sich unterhalten', en: 'to converse', hint: 'Talk', examples: [{ de: 'Wir unterhalten uns lange.', en: 'We talk for a long time.' }] },
      { de: 'die Unterhaltung', en: 'conversation', hint: 'Talk', examples: [{ de: 'Eine interessante Unterhaltung.', en: 'An interesting conversation.' }] },
      { de: 'das Picknick', en: 'picnic', hint: 'Outdoor meal', examples: [{ de: 'Ein Picknick im Park.', en: 'A picnic in the park.' }] },
      { de: 'der Grill', en: 'grill', hint: 'BBQ', examples: [{ de: 'Am Abend grillen wir.', en: 'In the evening we barbecue.' }] },
      { de: 'grillen', en: 'to barbecue', hint: 'Cook on grill', examples: [{ de: 'Im Sommer grillen wir oft.', en: 'In summer we often barbecue.' }] },
      { de: 'das Kino', en: 'cinema', hint: 'Movie theater', examples: [{ de: 'Ins Kino gehen.', en: 'Go to the cinema.' }] },
      { de: 'die Oper', en: 'opera', hint: 'Musical performance', examples: [{ de: 'In die Oper gehen.', en: 'Go to the opera.' }] },
      { de: 'das Ballett', en: 'ballet', hint: 'Dance performance', examples: [{ de: 'Ballett tanzen.', en: 'Dance ballet.' }] },
      { de: 'der Zirkus', en: 'circus', hint: 'Entertainment', examples: [{ de: 'Mit Kindern in den Zirkus.', en: 'Go to the circus with children.' }] },
      { de: 'das Vergnügen', en: 'pleasure', hint: 'Enjoyment', examples: [{ de: 'Lesen ist mein größtes Vergnügen.', en: 'Reading is my greatest pleasure.' }] },
      { de: 'der Spaß', en: 'fun', hint: 'Enjoyment', examples: [{ de: 'Das macht Spaß!', en: 'That is fun!' }] },
      { de: 'die Freizeitaktivität', en: 'leisure activity', hint: 'Free time thing', examples: [{ de: 'Meine Freizeitaktivitäten sind vielfältig.', en: 'My leisure activities are diverse.' }] },

      // Shopping & Services (80)
      { de: 'einkaufen', en: 'to shop', hint: 'Buy things', examples: [{ de: 'Im Supermarkt einkaufen.', en: 'Shop at the supermarket.' }] },
      { de: 'der Einkauf', en: 'shopping', hint: 'Purchase', examples: [{ de: 'Den Einkauf erledigen.', en: 'Do the shopping.' }] },
      { de: 'die Einkaufsliste', en: 'shopping list', hint: 'List of items', examples: [{ de: 'Eine Einkaufsliste schreiben.', en: 'Write a shopping list.' }] },
      { de: 'der Supermarkt', en: 'supermarket', hint: 'Grocery store', examples: [{ de: 'Zum Supermarkt gehen.', en: 'Go to the supermarket.' }] },
      { de: 'der Markt', en: 'market', hint: 'Open-air market', examples: [{ de: 'Auf dem Markt kaufe ich Obst.', en: 'At the market I buy fruit.' }] },
      { de: 'das Geschäft', en: 'shop', hint: 'Store', examples: [{ de: 'Das Geschäft ist um 18 Uhr geschlossen.', en: 'The shop closes at 6 p.m.' }] },
      { de: 'das Kaufhaus', en: 'department store', hint: 'Large store', examples: [{ de: 'Im Kaufhaus gibt es viele Abteilungen.', en: 'In the department store there are many departments.' }] },
      { de: 'das Einkaufszentrum', en: 'shopping mall', hint: 'Mall', examples: [{ de: 'Ins Einkaufszentrum gehen.', en: 'Go to the shopping mall.' }] },
      { de: 'der Laden', en: 'shop', hint: 'Small store', examples: [{ de: 'Der Laden um die Ecke.', en: 'The shop around the corner.' }] },
      { de: 'die Bäckerei', en: 'bakery', hint: 'Bread shop', examples: [{ de: 'In der Bäckerei Brötchen kaufen.', en: 'Buy rolls at the bakery.' }] },
      { de: 'die Metzgerei', en: 'butcher shop', hint: 'Meat shop', examples: [{ de: 'Fleisch von der Metzgerei.', en: 'Meat from the butcher.' }] },
      { de: 'der Bäcker', en: 'baker', hint: 'Person selling bread', examples: [{ de: 'Beim Bäcker kaufen wir Brot.', en: 'At the baker we buy bread.' }] },
      { de: 'der Metzger', en: 'butcher', hint: 'Sells meat', examples: [{ de: 'Frisches Fleisch vom Metzger.', en: 'Fresh meat from the butcher.' }] },
      { de: 'die Apotheke', en: 'pharmacy', hint: 'Medicine', examples: [{ de: 'In der Apotheke Medikamente kaufen.', en: 'Buy medicine at the pharmacy.' }] },
      { de: 'die Drogerie', en: 'drugstore', hint: 'Toiletries', examples: [{ de: 'In der Drogerie Shampoo kaufen.', en: 'Buy shampoo at the drugstore.' }] },
      { de: 'die Buchhandlung', en: 'bookstore', hint: 'Sells books', examples: [{ de: 'In der Buchhandlung ein Buch kaufen.', en: 'Buy a book at the bookstore.' }] },
      { de: 'der Kleidungsladen', en: 'clothing store', hint: 'Sells clothes', examples: [{ de: 'Im Kleidungsladen eine Hose anprobieren.', en: 'Try on pants at the clothing store.' }] },
      { de: 'das Schuhgeschäft', en: 'shoe store', hint: 'Sells shoes', examples: [{ de: 'Im Schuhgeschäft neue Schuhe kaufen.', en: 'Buy new shoes at the shoe store.' }] },
      { de: 'das Elektronikgeschäft', en: 'electronics store', hint: 'Sells electronics', examples: [{ de: 'Im Elektronikgeschäft einen Fernseher kaufen.', en: 'Buy a TV at the electronics store.' }] },
      { de: 'die Tankstelle', en: 'gas station', hint: 'Fuel', examples: [{ de: 'An der Tankstelle Benzin tanken.', en: 'Get gas at the gas station.' }] },
      { de: 'der Kiosk', en: 'kiosk', hint: 'Small shop', examples: [{ de: 'Am Kiosk Zeitungen kaufen.', en: 'Buy newspapers at the kiosk.' }] },
      { de: 'das Produkt', en: 'product', hint: 'Item for sale', examples: [{ de: 'Dieses Produkt ist teuer.', en: 'This product is expensive.' }] },
      { de: 'die Ware', en: 'goods', hint: 'Items for sale', examples: [{ de: 'Die Waren sind von guter Qualität.', en: 'The goods are of good quality.' }] },
      { de: 'das Angebot', en: 'offer, sale', hint: 'Special price', examples: [{ de: 'Im Angebot ist es billiger.', en: 'It is cheaper on sale.' }] },
      { de: 'der Preis', en: 'price', hint: 'Cost', examples: [{ de: 'Der Preis ist zu hoch.', en: 'The price is too high.' }] },
      { de: 'teuer', en: 'expensive', hint: 'High price', examples: [{ de: 'Das Auto ist teuer.', en: 'The car is expensive.' }] },
      { de: 'billig', en: 'cheap', hint: 'Low price', examples: [{ de: 'Dieses Hemd ist billig.', en: 'This shirt is cheap.' }] },
      { de: 'günstig', en: 'favorable, affordable', hint: 'Good price', examples: [{ de: 'Das Hotel ist günstig.', en: 'The hotel is affordable.' }] },
      { de: 'das Geld', en: 'money', hint: 'Currency', examples: [{ de: 'Geld ausgeben.', en: 'Spend money.' }] },
      { de: 'bezahlen', en: 'to pay', hint: 'Give money', examples: [{ de: 'An der Kasse bezahlen.', en: 'Pay at the checkout.' }] },
      { de: 'bar bezahlen', en: 'to pay cash', hint: 'Cash', examples: [{ de: 'Ich bezahle bar.', en: 'I pay cash.' }] },
      { de: 'mit Karte bezahlen', en: 'to pay by card', hint: 'Card', examples: [{ de: 'Kann ich mit Karte bezahlen?', en: 'Can I pay by card?' }] },
      { de: 'die Kreditkarte', en: 'credit card', hint: 'Card', examples: [{ de: 'Mit Kreditkarte zahlen.', en: 'Pay with credit card.' }] },
      { de: 'die EC-Karte', en: 'debit card', hint: 'Bank card', examples: [{ de: 'Mit EC-Karte bezahlen.', en: 'Pay with debit card.' }] },
      { de: 'das Portemonnaie', en: 'wallet', hint: 'Holds money', examples: [{ de: 'Mein Portemonnaie ist leer.', en: 'My wallet is empty.' }] },
      { de: 'die Kasse', en: 'checkout', hint: 'Pay here', examples: [{ de: 'An der Kasse anstehen.', en: 'Stand in line at the checkout.' }] },
      { de: 'der Kassenzettel', en: 'receipt', hint: 'Proof of purchase', examples: [{ de: 'Den Kassenzettel aufbewahren.', en: 'Keep the receipt.' }] },
      { de: 'die Quittung', en: 'receipt', hint: 'Proof', examples: [{ de: 'Eine Quittung bekommen.', en: 'Get a receipt.' }] },
      { de: 'umtauschen', en: 'to exchange', hint: 'Change item', examples: [{ de: 'Die Hose umtauschen.', en: 'Exchange the pants.' }] },
      { de: 'zurückgeben', en: 'to return', hint: 'Give back', examples: [{ de: 'Das Produkt zurückgeben.', en: 'Return the product.' }] },
      { de: 'die Größe', en: 'size', hint: 'Clothing size', examples: [{ de: 'Welche Größe haben Sie?', en: 'What size do you have?' }] },
      { de: 'die Farbe', en: 'color', hint: 'Color', examples: [{ de: 'Die Farbe gefällt mir.', en: 'I like the color.' }] },
      { de: 'anprobieren', en: 'to try on', hint: 'Test clothing', examples: [{ de: 'Die Schuhe anprobieren.', en: 'Try on the shoes.' }] },
      { de: 'passen', en: 'to fit', hint: 'Size right', examples: [{ de: 'Die Jacke passt gut.', en: 'The jacket fits well.' }] },
      { de: 'stehen', en: 'to suit', hint: 'Look good', examples: [{ de: 'Das Kleid steht dir.', en: 'The dress suits you.' }] },
      { de: 'die Umkleidekabine', en: 'fitting room', hint: 'Try on clothes', examples: [{ de: 'In die Umkleidekabine gehen.', en: 'Go into the fitting room.' }] },
      { de: 'das Sonderangebot', en: 'special offer', hint: 'Sale', examples: [{ de: 'Ein Sonderangebot nutzen.', en: 'Take advantage of a special offer.' }] },
      { de: 'der Rabatt', en: 'discount', hint: 'Reduced price', examples: [{ de: '10% Rabatt bekommen.', en: 'Get 10% discount.' }] },
      { de: 'der Gutschein', en: 'voucher', hint: 'Coupon', examples: [{ de: 'Einen Gutschein einlösen.', en: 'Redeem a voucher.' }] },
      { de: 'das Pfand', en: 'deposit', hint: 'For bottles', examples: [{ de: 'Pfand auf Flaschen.', en: 'Deposit on bottles.' }] },
      { de: 'die Tüte', en: 'bag', hint: 'Plastic/paper bag', examples: [{ de: 'Eine Tüte für den Einkauf.', en: 'A bag for the shopping.' }] },
      { de: 'der Korb', en: 'basket', hint: 'Shopping basket', examples: [{ de: 'Den Korb nehmen.', en: 'Take the basket.' }] },
      { de: 'der Einkaufswagen', en: 'shopping cart', hint: 'Cart', examples: [{ de: 'Den Einkaufswagen schieben.', en: 'Push the shopping cart.' }] },
      { de: 'die Waage', en: 'scale', hint: 'Weighing', examples: [{ de: 'Auf die Waage legen.', en: 'Put on the scale.' }] },
      { de: 'das Kilo', en: 'kilo', hint: '1000 grams', examples: [{ de: 'Ein Kilo Äpfel.', en: 'One kilo of apples.' }] },
      { de: 'das Gramm', en: 'gram', hint: 'Weight', examples: [{ de: '200 Gramm Butter.', en: '200 grams of butter.' }] },
      { de: 'der Liter', en: 'liter', hint: 'Volume', examples: [{ de: 'Ein Liter Milch.', en: 'One liter of milk.' }] },
      { de: 'die Flasche', en: 'bottle', hint: 'Container', examples: [{ de: 'Eine Flasche Wasser.', en: 'A bottle of water.' }] },
      { de: 'die Dose', en: 'can', hint: 'Tin', examples: [{ de: 'Eine Dose Cola.', en: 'A can of Coke.' }] },
      { de: 'die Packung', en: 'pack', hint: 'Package', examples: [{ de: 'Eine Packung Nudeln.', en: 'A pack of pasta.' }] },
      { de: 'der Becher', en: 'cup', hint: 'Yogurt cup', examples: [{ de: 'Ein Becher Joghurt.', en: 'A cup of yogurt.' }] },
      { de: 'frisch', en: 'fresh', hint: 'Not old', examples: [{ de: 'Das Brot ist frisch.', en: 'The bread is fresh.' }] },
      { de: 'haltbar', en: 'durable', hint: 'Long-lasting', examples: [{ de: 'Die Milch ist haltbar.', en: 'The milk is long-life.' }] },
      { de: 'das Mindesthaltbarkeitsdatum', en: 'best before date', hint: 'Expiry date', examples: [{ de: 'Das Mindesthaltbarkeitsdatum prüfen.', en: 'Check the best before date.' }] },
      { de: 'das Öffnungszeiten', en: 'opening hours', hint: 'When shop is open', examples: [{ de: 'Die Öffnungszeiten sind von 9 bis 18 Uhr.', en: 'The opening hours are from 9 a.m. to 6 p.m.' }] },
      { de: 'geöffnet', en: 'open', hint: 'Shop open', examples: [{ de: 'Ist das Geschäft geöffnet?', en: 'Is the shop open?' }] },
      { de: 'geschlossen', en: 'closed', hint: 'Not open', examples: [{ de: 'Sonntags ist geschlossen.', en: 'It is closed on Sundays.' }] },
      { de: 'die Post', en: 'post office', hint: 'Mail', examples: [{ de: 'Zur Post gehen.', en: 'Go to the post office.' }] },
      { de: 'die Bank', en: 'bank', hint: 'Financial institution', examples: [{ de: 'Auf die Bank gehen.', en: 'Go to the bank.' }] },
      { de: 'der Geldautomat', en: 'ATM', hint: 'Cash machine', examples: [{ de: 'Am Geldautomaten Geld abheben.', en: 'Withdraw money from the ATM.' }] },
      { de: 'das Konto', en: 'account', hint: 'Bank account', examples: [{ de: 'Ein Konto eröffnen.', en: 'Open an account.' }] },
      { de: 'überweisen', en: 'to transfer', hint: 'Send money', examples: [{ de: 'Geld überweisen.', en: 'Transfer money.' }] },
      { de: 'die Filiale', en: 'branch', hint: 'Local office', examples: [{ de: 'In die Filiale gehen.', en: 'Go to the branch.' }] },
      { de: 'der Friseur', en: 'hairdresser', hint: 'Cut hair', examples: [{ de: 'Zum Friseur gehen.', en: 'Go to the hairdresser.' }] },
      { de: 'der Haarschnitt', en: 'haircut', hint: 'Cut', examples: [{ de: 'Einen Haarschnitt bekommen.', en: 'Get a haircut.' }] },
      { de: 'die Reinigung', en: 'dry cleaner', hint: 'Clean clothes', examples: [{ de: 'Den Anzug zur Reinigung bringen.', en: 'Take the suit to the dry cleaner.' }] },
      { de: 'der Schlüsseldienst', en: 'locksmith', hint: 'Keys/locks', examples: [{ de: 'Den Schlüsseldienst rufen.', en: 'Call the locksmith.' }] },
      { de: 'der Handwerker', en: 'craftsman', hint: 'Tradesperson', examples: [{ de: 'Einen Handwerker bestellen.', en: 'Order a tradesperson.' }] },
      { de: 'die Reparatur', en: 'repair', hint: 'Fix', examples: [{ de: 'Die Reparatur kostet Geld.', en: 'The repair costs money.' }] },
      { de: 'reparieren', en: 'to repair', hint: 'Fix', examples: [{ de: 'Das Fahrrad reparieren.', en: 'Repair the bike.' }] },

      // Relationships & Social Life (80)
      { de: 'der Freund / die Freundin', en: 'friend', hint: 'Close person', examples: [{ de: 'Mein Freund heißt Paul.', en: 'My friend is called Paul.' }] },
      { de: 'der Bekannte / die Bekannte', en: 'acquaintance', hint: 'Not close friend', examples: [{ de: 'Er ist nur ein Bekannter.', en: 'He is just an acquaintance.' }] },
      { de: 'der Partner / die Partnerin', en: 'partner', hint: 'Romantic', examples: [{ de: 'Mein Partner und ich wohnen zusammen.', en: 'My partner and I live together.' }] },
      { de: 'der Ehemann', en: 'husband', hint: 'Married man', examples: [{ de: 'Ihr Ehemann arbeitet viel.', en: 'Her husband works a lot.' }] },
      { de: 'die Ehefrau', en: 'wife', hint: 'Married woman', examples: [{ de: 'Seine Ehefrau ist Ärztin.', en: 'His wife is a doctor.' }] },
      { de: 'die Beziehung', en: 'relationship', hint: 'Romantic', examples: [{ de: 'Sie sind in einer Beziehung.', en: 'They are in a relationship.' }] },
      { de: 'die Ehe', en: 'marriage', hint: 'Wedlock', examples: [{ de: 'Die Ehe hält schon 20 Jahre.', en: 'The marriage has lasted 20 years.' }] },
      { de: 'die Hochzeit', en: 'wedding', hint: 'Marriage ceremony', examples: [{ de: 'Zur Hochzeit einladen.', en: 'Invite to the wedding.' }] },
      { de: 'verheiratet', en: 'married', hint: 'In marriage', examples: [{ de: 'Sind Sie verheiratet?', en: 'Are you married?' }] },
      { de: 'ledig', en: 'single', hint: 'Not married', examples: [{ de: 'Er ist ledig.', en: 'He is single.' }] },
      { de: 'geschieden', en: 'divorced', hint: 'Marriage ended', examples: [{ de: 'Sie ist geschieden.', en: 'She is divorced.' }] },
      { de: 'getrennt', en: 'separated', hint: 'Living apart', examples: [{ de: 'Sie sind getrennt.', en: 'They are separated.' }] },
      { de: 'verwitwet', en: 'widowed', hint: 'Spouse died', examples: [{ de: 'Meine Oma ist verwitwet.', en: 'My grandma is widowed.' }] },
      { de: 'der Verlobte / die Verlobte', en: 'fiancé/fiancée', hint: 'Engaged', examples: [{ de: 'Meine Verlobte und ich planen die Hochzeit.', en: 'My fiancée and I are planning the wedding.' }] },
      { de: 'sich verloben', en: 'to get engaged', hint: 'Promise marriage', examples: [{ de: 'Sie haben sich verlobt.', en: 'They got engaged.' }] },
      { de: 'sich trennen', en: 'to separate', hint: 'End relationship', examples: [{ de: 'Sie haben sich getrennt.', en: 'They separated.' }] },
      { de: 'sich scheiden lassen', en: 'to divorce', hint: 'Legal end', examples: [{ de: 'Sie lassen sich scheiden.', en: 'They are getting a divorce.' }] },
      { de: 'das Kind', en: 'child', hint: 'Young person', examples: [{ de: 'Wir haben zwei Kinder.', en: 'We have two children.' }] },
      { de: 'der Sohn', en: 'son', hint: 'Male child', examples: [{ de: 'Unser Sohn ist 10.', en: 'Our son is 10.' }] },
      { de: 'die Tochter', en: 'daughter', hint: 'Female child', examples: [{ de: 'Meine Tochter studiert.', en: 'My daughter studies.' }] },
      { de: 'die Eltern', en: 'parents', hint: 'Mother and father', examples: [{ de: 'Meine Eltern sind nett.', en: 'My parents are nice.' }] },
      { de: 'der Vater', en: 'father', hint: 'Dad', examples: [{ de: 'Mein Vater ist 50.', en: 'My father is 50.' }] },
      { de: 'die Mutter', en: 'mother', hint: 'Mom', examples: [{ de: 'Meine Mutter kocht gut.', en: 'My mother cooks well.' }] },
      { de: 'die Geschwister', en: 'siblings', hint: 'Brothers and sisters', examples: [{ de: 'Hast du Geschwister?', en: 'Do you have siblings?' }] },
      { de: 'der Bruder', en: 'brother', hint: 'Male sibling', examples: [{ de: 'Mein Bruder ist älter.', en: 'My brother is older.' }] },
      { de: 'die Schwester', en: 'sister', hint: 'Female sibling', examples: [{ de: 'Meine Schwester ist jünger.', en: 'My sister is younger.' }] },
      { de: 'die Großeltern', en: 'grandparents', hint: 'Parents of parents', examples: [{ de: 'Meine Großeltern wohnen auf dem Land.', en: 'My grandparents live in the country.' }] },
      { de: 'der Großvater', en: 'grandfather', hint: 'Grandpa', examples: [{ de: 'Mein Großvater erzählt Geschichten.', en: 'My grandfather tells stories.' }] },
      { de: 'die Großmutter', en: 'grandmother', hint: 'Grandma', examples: [{ de: 'Meine Großmutter backt Kuchen.', en: 'My grandmother bakes cakes.' }] },
      { de: 'der Enkel', en: 'grandson', hint: 'Child\'s son', examples: [{ de: 'Unser Enkel ist süß.', en: 'Our grandson is cute.' }] },
      { de: 'die Enkelin', en: 'granddaughter', hint: 'Child\'s daughter', examples: [{ de: 'Die Enkelin spielt im Garten.', en: 'The granddaughter plays in the garden.' }] },
      { de: 'die Tante', en: 'aunt', hint: 'Parent\'s sister', examples: [{ de: 'Meine Tante wohnt in Berlin.', en: 'My aunt lives in Berlin.' }] },
      { de: 'der Onkel', en: 'uncle', hint: 'Parent\'s brother', examples: [{ de: 'Mein Onkel hat ein Auto.', en: 'My uncle has a car.' }] },
      { de: 'der Cousin', en: 'cousin (male)', hint: 'Uncle/aunt\'s son', examples: [{ de: 'Mein Cousin ist nett.', en: 'My cousin is nice.' }] },
      { de: 'die Cousine', en: 'cousin (female)', hint: 'Uncle/aunt\'s daughter', examples: [{ de: 'Meine Cousine ist Ärztin.', en: 'My cousin is a doctor.' }] },
      { de: 'die Nichte', en: 'niece', hint: 'Sibling\'s daughter', examples: [{ de: 'Meine Nichte ist 5.', en: 'My niece is 5.' }] },
      { de: 'der Neffe', en: 'nephew', hint: 'Sibling\'s son', examples: [{ de: 'Mein Neffe geht zur Schule.', en: 'My nephew goes to school.' }] },
      { de: 'die Familie', en: 'family', hint: 'Relatives', examples: [{ de: 'Meine Familie ist groß.', en: 'My family is big.' }] },
      { de: 'die Verwandten', en: 'relatives', hint: 'Extended family', examples: [{ de: 'Alle Verwandten kommen zur Hochzeit.', en: 'All relatives come to the wedding.' }] },
      { de: 'der beste Freund', en: 'best friend (male)', hint: 'Closest friend', examples: [{ de: 'Er ist mein bester Freund.', en: 'He is my best friend.' }] },
      { de: 'die beste Freundin', en: 'best friend (female)', hint: 'Closest friend', examples: [{ de: 'Sie ist meine beste Freundin.', en: 'She is my best friend.' }] },
      { de: 'die Nachbarn', en: 'neighbors', hint: 'Live nearby', examples: [{ de: 'Meine Nachbarn sind freundlich.', en: 'My neighbors are friendly.' }] },
      { de: 'die Bekanntschaft', en: 'acquaintance', hint: 'Someone you know', examples: [{ de: 'Eine flüchtige Bekanntschaft.', en: 'A casual acquaintance.' }] },
      { de: 'sich treffen', en: 'to meet', hint: 'Get together', examples: [{ de: 'Ich treffe mich mit Freunden.', en: 'I meet with friends.' }] },
      { de: 'sich verabreden', en: 'to arrange to meet', hint: 'Make plans', examples: [{ de: 'Wir verabreden uns für morgen.', en: 'We arrange to meet for tomorrow.' }] },
      { de: 'die Verabredung', en: 'date/arrangement', hint: 'Plan to meet', examples: [{ de: 'Eine Verabredung haben.', en: 'Have a date/appointment.' }] },
      { de: 'einladen', en: 'to invite', hint: 'Ask to come', examples: [{ de: 'Ich lade dich zum Essen ein.', en: 'I invite you to dinner.' }] },
      { de: 'die Einladung', en: 'invitation', hint: 'Request to attend', examples: [{ de: 'Eine Einladung zur Party.', en: 'An invitation to the party.' }] },
      { de: 'die Party', en: 'party', hint: 'Celebration', examples: [{ de: 'Eine Party feiern.', en: 'Celebrate a party.' }] },
      { de: 'das Fest', en: 'festival/celebration', hint: 'Special event', examples: [{ de: 'Ein Fest mit der Familie.', en: 'A celebration with the family.' }] },
      { de: 'die Feier', en: 'celebration', hint: 'Party', examples: [{ de: 'Zur Feier des Tages.', en: 'For the celebration of the day.' }] },
      { de: 'das Geschenk', en: 'gift', hint: 'Present', examples: [{ de: 'Ein Geschenk zum Geburtstag.', en: 'A gift for the birthday.' }] },
      { de: 'schenken', en: 'to give as a gift', hint: 'Give present', examples: [{ de: 'Was schenkst du ihm?', en: 'What are you giving him?' }] },
      { de: 'die Überraschung', en: 'surprise', hint: 'Unexpected', examples: [{ de: 'Eine Überraschungsparty.', en: 'A surprise party.' }] },
      { de: 'sich unterhalten', en: 'to talk/converse', hint: 'Chat', examples: [{ de: 'Wir unterhalten uns über Gott und die Welt.', en: 'We talk about everything.' }] },
      { de: 'die Unterhaltung', en: 'conversation', hint: 'Talk', examples: [{ de: 'Eine interessante Unterhaltung.', en: 'An interesting conversation.' }] },
      { de: 'das Gespräch', en: 'conversation', hint: 'Talk', examples: [{ de: 'Ein Gespräch führen.', en: 'Have a conversation.' }] },
      { de: 'reden', en: 'to talk', hint: 'Speak', examples: [{ de: 'Wir reden über Politik.', en: 'We talk about politics.' }] },
      { de: 'sprechen', en: 'to speak', hint: 'Talk', examples: [{ de: 'Ich spreche mit dir.', en: 'I am speaking with you.' }] },
      { de: 'erzählen', en: 'to tell', hint: 'Narrate', examples: [{ de: 'Er erzählt eine Geschichte.', en: 'He tells a story.' }] },
      { de: 'fragen', en: 'to ask', hint: 'Inquire', examples: [{ de: 'Ich frage nach dem Weg.', en: 'I ask for directions.' }] },
      { de: 'antworten', en: 'to answer', hint: 'Reply', examples: [{ de: 'Er antwortet nicht.', en: 'He doesn\'t answer.' }] },
      { de: 'die Meinung', en: 'opinion', hint: 'What you think', examples: [{ de: 'Meiner Meinung nach...', en: 'In my opinion...' }] },
      { de: 'zustimmen', en: 'to agree', hint: 'Say yes', examples: [{ de: 'Ich stimme dir zu.', en: 'I agree with you.' }] },
      { de: 'ablehnen', en: 'to reject', hint: 'Say no', examples: [{ de: 'Er lehnt den Vorschlag ab.', en: 'He rejects the proposal.' }] },
      { de: 'diskutieren', en: 'to discuss', hint: 'Talk about', examples: [{ de: 'Wir diskutieren über das Problem.', en: 'We discuss the problem.' }] },
      { de: 'streiten', en: 'to argue', hint: 'Fight verbally', examples: [{ de: 'Die Geschwister streiten oft.', en: 'The siblings often argue.' }] },
      { de: 'sich vertragen', en: 'to get along', hint: 'Be in harmony', examples: [{ de: 'Sie vertragen sich gut.', en: 'They get along well.' }] },
      { de: 'der Streit', en: 'argument', hint: 'Disagreement', examples: [{ de: 'Einen Streit haben.', en: 'Have an argument.' }] },
      { de: 'sich entschuldigen', en: 'to apologize', hint: 'Say sorry', examples: [{ de: 'Ich entschuldige mich.', en: 'I apologize.' }] },
      { de: 'die Entschuldigung', en: 'apology', hint: 'Sorry', examples: [{ de: 'Entschuldigung annehmen.', en: 'Accept an apology.' }] },
      { de: 'verzeihen', en: 'to forgive', hint: 'Pardon', examples: [{ de: 'Kannst du mir verzeihen?', en: 'Can you forgive me?' }] },
      { de: 'sich kümmern um', en: 'to take care of', hint: 'Look after', examples: [{ de: 'Ich kümmere mich um die Kinder.', en: 'I take care of the children.' }] },
      { de: 'sich interessieren für', en: 'to be interested in', hint: 'Find interesting', examples: [{ de: 'Ich interessiere mich für Kunst.', en: 'I am interested in art.' }] },
      { de: 'die Liebe', en: 'love', hint: 'Strong affection', examples: [{ de: 'Liebe ist schön.', en: 'Love is beautiful.' }] },
      { de: 'lieben', en: 'to love', hint: 'Feel love', examples: [{ de: 'Ich liebe dich.', en: 'I love you.' }] },
      { de: 'mögen', en: 'to like', hint: 'Less than love', examples: [{ de: 'Ich mag Schokolade.', en: 'I like chocolate.' }] },
      { de: 'hassen', en: 'to hate', hint: 'Strong dislike', examples: [{ de: 'Ich hasse Lügen.', en: 'I hate lies.' }] },
      { de: 'die Freundschaft', en: 'friendship', hint: 'Friend bond', examples: [{ de: 'Eine lange Freundschaft.', en: 'A long friendship.' }] },
      { de: 'die Bekanntschaft', en: 'acquaintance', hint: 'Know someone', examples: [{ de: 'Eine Bekanntschaft machen.', en: 'Make an acquaintance.' }] },

      // Communication & Technology (70)
      { de: 'das Telefon', en: 'telephone', hint: 'Device for calls', examples: [{ de: 'Das Telefon klingelt.', en: 'The phone is ringing.' }] },
      { de: 'das Handy', en: 'mobile phone', hint: 'Cell phone', examples: [{ de: 'Mein Handy ist neu.', en: 'My mobile phone is new.' }] },
      { de: 'das Smartphone', en: 'smartphone', hint: 'Smart phone', examples: [{ de: 'Mit dem Smartphone surfen.', en: 'Surf with the smartphone.' }] },
      { de: 'der Anruf', en: 'call', hint: 'Phone call', examples: [{ de: 'Einen Anruf bekommen.', en: 'Receive a call.' }] },
      { de: 'anrufen', en: 'to call', hint: 'Phone someone', examples: [{ de: 'Ich rufe meine Mutter an.', en: 'I call my mother.' }] },
      { de: 'klingeln', en: 'to ring', hint: 'Phone rings', examples: [{ de: 'Das Telefon klingelt.', en: 'The phone is ringing.' }] },
      { de: 'die Mailbox', en: 'voicemail', hint: 'Leave message', examples: [{ de: 'Auf die Mailbox sprechen.', en: 'Speak on voicemail.' }] },
      { de: 'die SMS', en: 'text message', hint: 'Short message', examples: [{ de: 'Eine SMS schreiben.', en: 'Write a text message.' }] },
      { de: 'die Nachricht', en: 'message', hint: 'Communication', examples: [{ de: 'Eine Nachricht hinterlassen.', en: 'Leave a message.' }] },
      { de: 'die WhatsApp', en: 'WhatsApp', hint: 'Messaging app', examples: [{ de: 'Eine WhatsApp senden.', en: 'Send a WhatsApp.' }] },
      { de: 'die E-Mail', en: 'email', hint: 'Electronic mail', examples: [{ de: 'Eine E-Mail schreiben.', en: 'Write an email.' }] },
      { de: 'die Adresse', en: 'address', hint: 'Email address', examples: [{ de: 'Meine E-Mail-Adresse.', en: 'My email address.' }] },
      { de: 'das Internet', en: 'internet', hint: 'World Wide Web', examples: [{ de: 'Im Internet suchen.', en: 'Search on the internet.' }] },
      { de: 'das WLAN', en: 'WiFi', hint: 'Wireless network', examples: [{ de: 'Gibt es WLAN?', en: 'Is there WiFi?' }] },
      { de: 'das Netz', en: 'network', hint: 'Connection', examples: [{ de: 'Kein Netz.', en: 'No network.' }] },
      { de: 'online', en: 'online', hint: 'Connected', examples: [{ de: 'Ich bin online.', en: 'I am online.' }] },
      { de: 'offline', en: 'offline', hint: 'Not connected', examples: [{ de: 'Er ist offline.', en: 'He is offline.' }] },
      { de: 'die Webseite', en: 'website', hint: 'Internet page', examples: [{ de: 'Die Webseite ist informativ.', en: 'The website is informative.' }] },
      { de: 'die App', en: 'app', hint: 'Application', examples: [{ de: 'Eine App installieren.', en: 'Install an app.' }] },
      { de: 'herunterladen', en: 'to download', hint: 'Get from internet', examples: [{ de: 'Ein Programm herunterladen.', en: 'Download a program.' }] },
      { de: 'hochladen', en: 'to upload', hint: 'Put on internet', examples: [{ de: 'Fotos hochladen.', en: 'Upload photos.' }] },
      { de: 'der Computer', en: 'computer', hint: 'PC', examples: [{ de: 'Am Computer arbeiten.', en: 'Work on the computer.' }] },
      { de: 'der Laptop', en: 'laptop', hint: 'Portable computer', examples: [{ de: 'Den Laptop mitnehmen.', en: 'Take the laptop along.' }] },
      { de: 'das Tablet', en: 'tablet', hint: 'Touch device', examples: [{ de: 'Auf dem Tablet spielen.', en: 'Play on the tablet.' }] },
      { de: 'der Bildschirm', en: 'screen', hint: 'Display', examples: [{ de: 'Der Bildschirm ist groß.', en: 'The screen is big.' }] },
      { de: 'die Tastatur', en: 'keyboard', hint: 'Type on it', examples: [{ de: 'Auf der Tastatur schreiben.', en: 'Type on the keyboard.' }] },
      { de: 'die Maus', en: 'mouse', hint: 'Computer mouse', examples: [{ de: 'Die Maus bewegen.', en: 'Move the mouse.' }] },
      { de: 'der Drucker', en: 'printer', hint: 'Prints documents', examples: [{ de: 'Ein Dokument drucken.', en: 'Print a document.' }] },
      { de: 'drucken', en: 'to print', hint: 'Output on paper', examples: [{ de: 'Die Datei drucken.', en: 'Print the file.' }] },
      { de: 'kopieren', en: 'to copy', hint: 'Duplicate', examples: [{ de: 'Den Text kopieren.', en: 'Copy the text.' }] },
      { de: 'einfügen', en: 'to paste', hint: 'After copy', examples: [{ de: 'In das Dokument einfügen.', en: 'Paste into the document.' }] },
      { de: 'löschen', en: 'to delete', hint: 'Remove', examples: [{ de: 'Die Datei löschen.', en: 'Delete the file.' }] },
      { de: 'speichern', en: 'to save', hint: 'Keep data', examples: [{ de: 'Das Dokument speichern.', en: 'Save the document.' }] },
      { de: 'die Datei', en: 'file', hint: 'Computer file', examples: [{ de: 'Die Datei öffnen.', en: 'Open the file.' }] },
      { de: 'der Ordner', en: 'folder', hint: 'File folder', examples: [{ de: 'Im Ordner speichern.', en: 'Save in the folder.' }] },
      { de: 'das Passwort', en: 'password', hint: 'Secret code', examples: [{ de: 'Ein sicheres Passwort.', en: 'A secure password.' }] },
      { de: 'der Benutzername', en: 'username', hint: 'Login name', examples: [{ de: 'Benutzername und Passwort.', en: 'Username and password.' }] },
      { de: 'sich einloggen', en: 'to log in', hint: 'Access account', examples: [{ de: 'In das Konto einloggen.', en: 'Log into the account.' }] },
      { de: 'sich ausloggen', en: 'to log out', hint: 'Exit account', examples: [{ de: 'Nach der Arbeit ausloggen.', en: 'Log out after work.' }] },
      { de: 'die E-Mail', en: 'email', hint: 'Message', examples: [{ de: 'Eine E-Mail bekommen.', en: 'Receive an email.' }] },
      { de: 'anhängen', en: 'to attach', hint: 'Add file', examples: [{ de: 'Ein Foto anhängen.', en: 'Attach a photo.' }] },
      { de: 'der Anhang', en: 'attachment', hint: 'File with email', examples: [{ de: 'Den Anhang öffnen.', en: 'Open the attachment.' }] },
      { de: 'das soziale Netzwerk', en: 'social network', hint: 'Facebook etc.', examples: [{ de: 'In sozialen Netzwerken aktiv sein.', en: 'Be active on social networks.' }] },
      { de: 'Facebook', en: 'Facebook', hint: 'Social media', examples: [{ de: 'Auf Facebook posten.', en: 'Post on Facebook.' }] },
      { de: 'Instagram', en: 'Instagram', hint: 'Photo app', examples: [{ de: 'Fotos auf Instagram teilen.', en: 'Share photos on Instagram.' }] },
      { de: 'der Beitrag', en: 'post', hint: 'Social media post', examples: [{ de: 'Einen Beitrag liken.', en: 'Like a post.' }] },
      { de: 'liken', en: 'to like', hint: 'Press like', examples: [{ de: 'Ich like dein Foto.', en: 'I like your photo.' }] },
      { de: 'teilen', en: 'to share', hint: 'Share content', examples: [{ de: 'Den Link teilen.', en: 'Share the link.' }] },
      { de: 'kommentieren', en: 'to comment', hint: 'Leave comment', examples: [{ de: 'Den Beitrag kommentieren.', en: 'Comment on the post.' }] },
      { de: 'der Kommentar', en: 'comment', hint: 'Response', examples: [{ de: 'Einen Kommentar schreiben.', en: 'Write a comment.' }] },
      { de: 'die Nachricht', en: 'message', hint: 'Direct message', examples: [{ de: 'Eine private Nachricht senden.', en: 'Send a private message.' }] },
      { de: 'chatten', en: 'to chat', hint: 'Talk online', examples: [{ de: 'Mit Freunden chatten.', en: 'Chat with friends.' }] },
      { de: 'der Chat', en: 'chat', hint: 'Conversation', examples: [{ de: 'Im Chat schreiben.', en: 'Write in the chat.' }] },
      { de: 'die Videokonferenz', en: 'video conference', hint: 'Online meeting', examples: [{ de: 'An der Videokonferenz teilnehmen.', en: 'Take part in the video conference.' }] },
      { de: 'das Zoom-Meeting', en: 'Zoom meeting', hint: 'Video call', examples: [{ de: 'Ein Zoom-Meeting mit Kollegen.', en: 'A Zoom meeting with colleagues.' }] },
      { de: 'die Störung', en: 'disruption', hint: 'Technical problem', examples: [{ de: 'Eine Störung im Netz.', en: 'A network disruption.' }] },
      { de: 'der Fehler', en: 'error', hint: 'Mistake', examples: [{ de: 'Ein Fehler ist aufgetreten.', en: 'An error has occurred.' }] },
      { de: 'funktionieren', en: 'to function', hint: 'Work properly', examples: [{ de: 'Das Handy funktioniert nicht.', en: 'The phone doesn\'t work.' }] },
      { de: 'kaputt', en: 'broken', hint: 'Not working', examples: [{ de: 'Der Bildschirm ist kaputt.', en: 'The screen is broken.' }] },
      { de: 'reparieren', en: 'to repair', hint: 'Fix', examples: [{ de: 'Das Handy reparieren lassen.', en: 'Get the phone repaired.' }] },
      { de: 'der Akku', en: 'battery', hint: 'Power source', examples: [{ de: 'Der Akku ist leer.', en: 'The battery is empty.' }] },
      { de: 'aufladen', en: 'to charge', hint: 'Charge battery', examples: [{ de: 'Das Handy aufladen.', en: 'Charge the phone.' }] },
      { de: 'das Ladegerät', en: 'charger', hint: 'Charging device', examples: [{ de: 'Das Ladegerät einstecken.', en: 'Plug in the charger.' }] },
      { de: 'das Kabel', en: 'cable', hint: 'Wire', examples: [{ de: 'Das Kabel anschließen.', en: 'Connect the cable.' }] },
      { de: 'anschließen', en: 'to connect', hint: 'Plug in', examples: [{ de: 'Den Drucker anschließen.', en: 'Connect the printer.' }] },
      { de: 'der Stecker', en: 'plug', hint: 'Electrical plug', examples: [{ de: 'Den Stecker in die Steckdose stecken.', en: 'Put the plug in the socket.' }] },
      { de: 'die Steckdose', en: 'socket', hint: 'Power outlet', examples: [{ de: 'Die Steckdose ist hinter dem Schrank.', en: 'The socket is behind the cupboard.' }] },
      { de: 'der Knopf', en: 'button', hint: 'Press button', examples: [{ de: 'Den roten Knopf drücken.', en: 'Press the red button.' }] },
      { de: 'drücken', en: 'to press', hint: 'Push', examples: [{ de: 'Die Taste drücken.', en: 'Press the key.' }] },

      // City Life & Directions (80)
      { de: 'die Stadt', en: 'city', hint: 'Urban area', examples: [{ de: 'Ich wohne in der Stadt.', en: 'I live in the city.' }] },
      { de: 'die Innenstadt', en: 'city center', hint: 'Downtown', examples: [{ de: 'In der Innenstadt einkaufen.', en: 'Shop in the city center.' }] },
      { de: 'das Zentrum', en: 'center', hint: 'Middle', examples: [{ de: 'Das Zentrum ist belebt.', en: 'The center is lively.' }] },
      { de: 'der Stadtteil', en: 'district', hint: 'Part of city', examples: [{ de: 'In welchem Stadtteil wohnst du?', en: 'In which district do you live?' }] },
      { de: 'der Vorort', en: 'suburb', hint: 'Outside city', examples: [{ de: 'Wir wohnen im Vorort.', en: 'We live in the suburb.' }] },
      { de: 'die Straße', en: 'street', hint: 'Road', examples: [{ de: 'Die Straße ist lang.', en: 'The street is long.' }] },
      { de: 'der Platz', en: 'square', hint: 'Open area', examples: [{ de: 'Auf dem Platz ist ein Markt.', en: 'On the square is a market.' }] },
      { de: 'die Ampel', en: 'traffic light', hint: 'Red/yellow/green', examples: [{ de: 'An der Ampel stehen.', en: 'Stand at the traffic light.' }] },
      { de: 'die Kreuzung', en: 'intersection', hint: 'Where roads cross', examples: [{ de: 'An der Kreuzung abbiegen.', en: 'Turn at the intersection.' }] },
      { de: 'die Ecke', en: 'corner', hint: 'Where streets meet', examples: [{ de: 'Um die Ecke ist ein Supermarkt.', en: 'Around the corner is a supermarket.' }] },
      { de: 'der Weg', en: 'way/path', hint: 'Route', examples: [{ de: 'Den Weg zeigen.', en: 'Show the way.' }] },
      { de: 'die Richtung', en: 'direction', hint: 'Which way', examples: [{ de: 'In welche Richtung?', en: 'Which direction?' }] },
      { de: 'der Stadtplan', en: 'city map', hint: 'Map', examples: [{ de: 'Auf dem Stadtplan suchen.', en: 'Look on the city map.' }] },
      { de: 'das Navi', en: 'GPS', hint: 'Navigation device', examples: [{ de: 'Das Navi sagt, wir sind da.', en: 'The GPS says we are there.' }] },
      { de: 'die Adresse', en: 'address', hint: 'Location info', examples: [{ de: 'Die Adresse suchen.', en: 'Look for the address.' }] },
      { de: 'die Hausnummer', en: 'house number', hint: 'Number on house', examples: [{ de: 'Die Hausnummer ist 12.', en: 'The house number is 12.' }] },
      { de: 'die Postleitzahl', en: 'postal code', hint: 'ZIP code', examples: [{ de: 'Die Postleitzahl von Berlin.', en: 'The postal code of Berlin.' }] },
      { de: 'das Verkehrsmittel', en: 'means of transport', hint: 'Bus, train, etc.', examples: [{ de: 'Öffentliche Verkehrsmittel.', en: 'Public transport.' }] },
      { de: 'der Bus', en: 'bus', hint: 'Vehicle', examples: [{ de: 'Mit dem Bus fahren.', en: 'Go by bus.' }] },
      { de: 'die U-Bahn', en: 'subway', hint: 'Underground', examples: [{ de: 'Die U-Bahn-Station.', en: 'The subway station.' }] },
      { de: 'die S-Bahn', en: 'urban rail', hint: 'City train', examples: [{ de: 'Mit der S-Bahn zum Flughafen.', en: 'By S-Bahn to the airport.' }] },
      { de: 'die Straßenbahn', en: 'tram', hint: 'Trolley', examples: [{ de: 'Die Straßenbahn fährt durch die Stadt.', en: 'The tram goes through the city.' }] },
      { de: 'der Zug', en: 'train', hint: 'Rail', examples: [{ de: 'Der Zug nach München.', en: 'The train to Munich.' }] },
      { de: 'das Taxi', en: 'taxi', hint: 'Cab', examples: [{ de: 'Ein Taxi rufen.', en: 'Call a taxi.' }] },
      { de: 'das Fahrrad', en: 'bicycle', hint: 'Bike', examples: [{ de: 'Mit dem Fahrrad fahren.', en: 'Ride a bike.' }] },
      { de: 'zu Fuß', en: 'on foot', hint: 'Walking', examples: [{ de: 'Zu Fuß gehen.', en: 'Go on foot.' }] },
      { de: 'die Haltestelle', en: 'stop', hint: 'Bus/tram stop', examples: [{ de: 'An der Haltestelle warten.', en: 'Wait at the stop.' }] },
      { de: 'der Bahnhof', en: 'train station', hint: 'Railway station', examples: [{ de: 'Am Bahnhof ankommen.', en: 'Arrive at the station.' }] },
      { de: 'der Flughafen', en: 'airport', hint: 'Airport', examples: [{ de: 'Zum Flughafen fahren.', en: 'Go to the airport.' }] },
      { de: 'der Fahrplan', en: 'timetable', hint: 'Schedule', examples: [{ de: 'Den Fahrplan checken.', en: 'Check the timetable.' }] },
      { de: 'die Fahrkarte', en: 'ticket', hint: 'Ticket', examples: [{ de: 'Eine Fahrkarte kaufen.', en: 'Buy a ticket.' }] },
      { de: 'die Fahrkartenautomat', en: 'ticket machine', hint: 'Buy tickets here', examples: [{ de: 'Am Automaten ein Ticket ziehen.', en: 'Get a ticket at the machine.' }] },
      { de: 'entwerten', en: 'to validate', hint: 'Stamp ticket', examples: [{ de: 'Die Fahrkarte entwerten.', en: 'Validate the ticket.' }] },
      { de: 'die Fahrkartenkontrolle', en: 'ticket inspection', hint: 'Check tickets', examples: [{ de: 'Bei der Kontrolle den Fahrschein zeigen.', en: 'Show the ticket at the inspection.' }] },
      { de: 'die Verspätung', en: 'delay', hint: 'Late', examples: [{ de: 'Der Zug hat Verspätung.', en: 'The train is delayed.' }] },
      { de: 'pünktlich', en: 'on time', hint: 'Not late', examples: [{ de: 'Der Bus ist pünktlich.', en: 'The bus is on time.' }] },
      { de: 'umsteigen', en: 'to change', hint: 'Transfer', examples: [{ de: 'In Berlin müssen Sie umsteigen.', en: 'In Berlin you need to change.' }] },
      { de: 'einsteigen', en: 'to board', hint: 'Get on', examples: [{ de: 'In den Zug einsteigen.', en: 'Board the train.' }] },
      { de: 'aussteigen', en: 'to get off', hint: 'Exit vehicle', examples: [{ de: 'Am Zoo aussteigen.', en: 'Get off at the zoo.' }] },
      { de: 'die Richtung', en: 'direction', hint: 'Way', examples: [{ de: 'In Richtung Stadtmitte.', en: 'Towards the city center.' }] },
      { de: 'geradeaus', en: 'straight ahead', hint: 'Direction', examples: [{ de: 'Geradeaus gehen.', en: 'Go straight ahead.' }] },
      { de: 'rechts', en: 'right', hint: 'Direction', examples: [{ de: 'Nach rechts abbiegen.', en: 'Turn right.' }] },
      { de: 'links', en: 'left', hint: 'Direction', examples: [{ de: 'Links abbiegen.', en: 'Turn left.' }] },
      { de: 'die Ecke', en: 'corner', hint: 'Turn', examples: [{ de: 'Um die Ecke biegen.', en: 'Turn around the corner.' }] },
      { de: 'die Brücke', en: 'bridge', hint: 'Over water', examples: [{ de: 'Über die Brücke gehen.', en: 'Go over the bridge.' }] },
      { de: 'der Tunnel', en: 'tunnel', hint: 'Under ground', examples: [{ de: 'Durch den Tunnel fahren.', en: 'Drive through the tunnel.' }] },
      { de: 'der Park', en: 'park', hint: 'Green space', examples: [{ de: 'Durch den Park spazieren.', en: 'Stroll through the park.' }] },
      { de: 'das Rathaus', en: 'city hall', hint: 'City government', examples: [{ de: 'Das Rathaus ist alt.', en: 'The city hall is old.' }] },
      { de: 'die Kirche', en: 'church', hint: 'Place of worship', examples: [{ de: 'Die Kirche besuchen.', en: 'Visit the church.' }] },
      { de: 'das Museum', en: 'museum', hint: 'Exhibition', examples: [{ de: 'Ins Museum gehen.', en: 'Go to the museum.' }] },
      { de: 'das Theater', en: 'theater', hint: 'Performances', examples: [{ de: 'Ins Theater gehen.', en: 'Go to the theater.' }] },
      { de: 'das Kino', en: 'cinema', hint: 'Movies', examples: [{ de: 'Ins Kino gehen.', en: 'Go to the cinema.' }] },
      { de: 'die Bibliothek', en: 'library', hint: 'Books', examples: [{ de: 'In der Bibliothek lesen.', en: 'Read in the library.' }] },
      { de: 'die Buchhandlung', en: 'bookstore', hint: 'Buy books', examples: [{ de: 'In der Buchhandlung stöbern.', en: 'Browse in the bookstore.' }] },
      { de: 'das Restaurant', en: 'restaurant', hint: 'Eat out', examples: [{ de: 'Im Restaurant essen.', en: 'Eat in the restaurant.' }] },
      { de: 'das Café', en: 'café', hint: 'Coffee shop', examples: [{ de: 'Im Café sitzen.', en: 'Sit in the café.' }] },
      { de: 'die Kneipe', en: 'pub', hint: 'Bar', examples: [{ de: 'In der Kneipe ein Bier trinken.', en: 'Drink a beer in the pub.' }] },
      { de: 'das Einkaufszentrum', en: 'shopping mall', hint: 'Many shops', examples: [{ de: 'Im Einkaufszentrum shoppen.', en: 'Shop at the mall.' }] },
      { de: 'der Supermarkt', en: 'supermarket', hint: 'Grocery store', examples: [{ de: 'Im Supermarkt einkaufen.', en: 'Shop at the supermarket.' }] },
      { de: 'der Markt', en: 'market', hint: 'Open market', examples: [{ de: 'Auf dem Markt frische Sachen kaufen.', en: 'Buy fresh things at the market.' }] },
      { de: 'die Apotheke', en: 'pharmacy', hint: 'Medicine', examples: [{ de: 'Zur Apotheke gehen.', en: 'Go to the pharmacy.' }] },
      { de: 'die Bank', en: 'bank', hint: 'Money', examples: [{ de: 'Auf die Bank gehen.', en: 'Go to the bank.' }] },
      { de: 'die Post', en: 'post office', hint: 'Mail', examples: [{ de: 'Zur Post gehen.', en: 'Go to the post office.' }] },
      { de: 'die Tankstelle', en: 'gas station', hint: 'Fuel', examples: [{ de: 'An der Tankstelle tanken.', en: 'Get gas at the gas station.' }] },
      { de: 'die Polizei', en: 'police', hint: 'Law enforcement', examples: [{ de: 'Die Polizei rufen.', en: 'Call the police.' }] },
      { de: 'die Feuerwehr', en: 'fire department', hint: 'Fight fires', examples: [{ de: 'Die Feuerwehr löscht den Brand.', en: 'The fire department puts out the fire.' }] },
      { de: 'das Krankenhaus', en: 'hospital', hint: 'Medical care', examples: [{ de: 'Ins Krankenhaus gebracht werden.', en: 'Be taken to the hospital.' }] },
      { de: 'die Schule', en: 'school', hint: 'Education', examples: [{ de: 'Die Kinder gehen in die Schule.', en: 'The children go to school.' }] },
      { de: 'die Universität', en: 'university', hint: 'Higher education', examples: [{ de: 'An der Universität studieren.', en: 'Study at the university.' }] },
      { de: 'der Kindergarten', en: 'kindergarten', hint: 'Preschool', examples: [{ de: 'Das Kind in den Kindergarten bringen.', en: 'Bring the child to kindergarten.' }] },
      { de: 'das Schwimmbad', en: 'swimming pool', hint: 'Swim', examples: [{ de: 'Ins Schwimmbad gehen.', en: 'Go to the swimming pool.' }] },
      { de: 'der Sportplatz', en: 'sports field', hint: 'Play sports', examples: [{ de: 'Auf dem Sportplatz Fußball spielen.', en: 'Play soccer on the sports field.' }] },
      { de: 'der Wald', en: 'forest', hint: 'Nature', examples: [{ de: 'Im Wald spazieren gehen.', en: 'Walk in the forest.' }] },
      { de: 'der See', en: 'lake', hint: 'Water', examples: [{ de: 'Zum See gehen.', en: 'Go to the lake.' }] },
      { de: 'der Fluss', en: 'river', hint: 'Water', examples: [{ de: 'Am Fluss entlang spazieren.', en: 'Walk along the river.' }] },
      { de: 'der Berg', en: 'mountain', hint: 'Elevation', examples: [{ de: 'Auf den Berg wandern.', en: 'Hike up the mountain.' }] },
      { de: 'die Aussicht', en: 'view', hint: 'Scenery', examples: [{ de: 'Die Aussicht ist schön.', en: 'The view is beautiful.' }] },
      { de: 'die Touristeninformation', en: 'tourist info', hint: 'Get info', examples: [{ de: 'Bei der Touristeninformation fragen.', en: 'Ask at the tourist information.' }] },
      { de: 'der Wegweiser', en: 'signpost', hint: 'Direction sign', examples: [{ de: 'Dem Wegweiser folgen.', en: 'Follow the signpost.' }] },
      { de: 'die Sehenswürdigkeit', en: 'sight', hint: 'Tourist attraction', examples: [{ de: 'Die Sehenswürdigkeiten der Stadt.', en: 'The sights of the city.' }] },

      // Past Experiences & Biographical (80)
      { de: 'früher', en: 'earlier, in the past', hint: 'Time before', examples: [{ de: 'Früher war ich Lehrer.', en: 'I used to be a teacher.' }] },
      { de: 'damals', en: 'back then', hint: 'Specific past time', examples: [{ de: 'Damals gab es kein Internet.', en: 'Back then there was no internet.' }] },
      { de: 'letztes Jahr', en: 'last year', hint: 'Previous year', examples: [{ de: 'Letztes Jahr war ich in Italien.', en: 'Last year I was in Italy.' }] },
      { de: 'vor einem Jahr', en: 'a year ago', hint: 'One year before now', examples: [{ de: 'Vor einem Jahr habe ich geheiratet.', en: 'A year ago I got married.' }] },
      { de: 'gestern', en: 'yesterday', hint: 'Day before today', examples: [{ de: 'Gestern war ich im Kino.', en: 'Yesterday I was at the cinema.' }] },
      { de: 'vorgestern', en: 'day before yesterday', hint: 'Two days ago', examples: [{ de: 'Vorgestern habe ich ihn getroffen.', en: 'The day before yesterday I met him.' }] },
      { de: 'neulich', en: 'recently', hint: 'Not long ago', examples: [{ de: 'Neulich habe ich einen alten Freund getroffen.', en: 'Recently I met an old friend.' }] },
      { de: 'kürzlich', en: 'recently', hint: 'Short time ago', examples: [{ de: 'Ich habe kürzlich ein neues Restaurant entdeckt.', en: 'I recently discovered a new restaurant.' }] },
      { de: 'die Kindheit', en: 'childhood', hint: 'Early years', examples: [{ de: 'Meine Kindheit war schön.', en: 'My childhood was nice.' }] },
      { de: 'das Kind', en: 'child', hint: 'Young person', examples: [{ de: 'Als Kind spielte ich viel.', en: 'As a child, I played a lot.' }] },
      { de: 'aufwachsen', en: 'to grow up', hint: 'Childhood years', examples: [{ de: 'Ich bin in Berlin aufgewachsen.', en: 'I grew up in Berlin.' }] },
      { de: 'die Jugend', en: 'youth', hint: 'Teen years', examples: [{ de: 'In meiner Jugend war ich oft im Kino.', en: 'In my youth, I was often at the cinema.' }] },
      { de: 'der Teenager', en: 'teenager', hint: '13-19 years', examples: [{ de: 'Als Teenager war ich rebellisch.', en: 'As a teenager, I was rebellious.' }] },
      { de: 'die Schule', en: 'school', hint: 'Education', examples: [{ de: 'In der Schule hatte ich viele Freunde.', en: 'At school, I had many friends.' }] },
      { de: 'der Schulabschluss', en: 'school graduation', hint: 'Finish school', examples: [{ de: 'Nach dem Schulabschluss studierte ich.', en: 'After graduation, I studied.' }] },
      { de: 'die Ausbildung', en: 'training', hint: 'Vocational', examples: [{ de: 'Meine Ausbildung habe ich 2010 abgeschlossen.', en: 'I completed my training in 2010.' }] },
      { de: 'das Studium', en: 'university studies', hint: 'Higher education', examples: [{ de: 'Mein Studium dauerte vier Jahre.', en: 'My studies lasted four years.' }] },
      { de: 'der Beruf', en: 'profession', hint: 'Job', examples: [{ de: 'Mein erster Beruf war Koch.', en: 'My first profession was a cook.' }] },
      { de: 'die Stelle', en: 'position', hint: 'Job position', examples: [{ de: 'Ich habe eine neue Stelle gefunden.', en: 'I found a new position.' }] },
      { de: 'der Job', en: 'job', hint: 'Work', examples: [{ de: 'Mein erster Job war Zeitungsaustragen.', en: 'My first job was delivering newspapers.' }] },
      { de: 'die Arbeit', en: 'work', hint: 'Employment', examples: [{ de: 'Die Arbeit hat mir gefallen.', en: 'I liked the work.' }] },
      { de: 'der Kollege', en: 'colleague', hint: 'Co-worker', examples: [{ de: 'Meine Kollegen waren nett.', en: 'My colleagues were nice.' }] },
      { de: 'kündigen', en: 'to quit', hint: 'Leave job', examples: [{ de: 'Ich habe gekündigt, weil ich umziehe.', en: 'I quit because I am moving.' }] },
      { de: 'die Wohnung', en: 'apartment', hint: 'Home', examples: [{ de: 'Meine erste Wohnung war klein.', en: 'My first apartment was small.' }] },
      { de: 'das Haus', en: 'house', hint: 'Home', examples: [{ de: 'Wir sind in ein Haus gezogen.', en: 'We moved into a house.' }] },
      { de: 'umziehen', en: 'to move', hint: 'Change home', examples: [{ de: 'Letztes Jahr bin ich umgezogen.', en: 'Last year I moved.' }] },
      { de: 'der Umzug', en: 'move', hint: 'Changing home', examples: [{ de: 'Der Umzug war anstrengend.', en: 'The move was exhausting.' }] },
      { de: 'die Stadt', en: 'city', hint: 'Place', examples: [{ de: 'Ich bin in eine neue Stadt gezogen.', en: 'I moved to a new city.' }] },
      { de: 'das Land', en: 'country', hint: 'Nation', examples: [{ de: 'Ich bin in ein anderes Land gezogen.', en: 'I moved to another country.' }] },
      { de: 'auswandern', en: 'to emigrate', hint: 'Leave country', examples: [{ de: 'Meine Eltern sind nach Kanada ausgewandert.', en: 'My parents emigrated to Canada.' }] },
      { de: 'einwandern', en: 'to immigrate', hint: 'Enter country', examples: [{ de: 'Ich bin nach Deutschland eingewandert.', en: 'I immigrated to Germany.' }] },
      { de: 'der Urlaub', en: 'vacation', hint: 'Holiday', examples: [{ de: 'Im Urlaub war ich in Spanien.', en: 'On vacation I was in Spain.' }] },
      { de: 'verreisen', en: 'to travel', hint: 'Go on trip', examples: [{ de: 'Letztes Jahr bin ich viel verreist.', en: 'Last year I traveled a lot.' }] },
      { de: 'das Erlebnis', en: 'experience', hint: 'Event you remember', examples: [{ de: 'Das war ein unvergessliches Erlebnis.', en: 'That was an unforgettable experience.' }] },
      { de: 'passieren', en: 'to happen', hint: 'Occur', examples: [{ de: 'Was ist passiert?', en: 'What happened?' }] },
      { de: 'geschehen', en: 'to happen', hint: 'Occur', examples: [{ de: 'Das ist gestern geschehen.', en: 'That happened yesterday.' }] },
      { de: 'erleben', en: 'to experience', hint: 'Live through', examples: [{ de: 'Ich habe viel erlebt.', en: 'I have experienced a lot.' }] },
      { de: 'kennenlernen', en: 'to get to know', hint: 'Meet someone', examples: [{ de: 'Ich habe meinen Mann im Urlaub kennengelernt.', en: 'I met my husband on vacation.' }] },
      { de: 'verlieben', en: 'to fall in love', hint: 'Love', examples: [{ de: 'Sie hat sich in ihn verliebt.', en: 'She fell in love with him.' }] },
      { de: 'heiraten', en: 'to marry', hint: 'Wedding', examples: [{ de: 'Wir haben 2015 geheiratet.', en: 'We got married in 2015.' }] },
      { de: 'die Hochzeit', en: 'wedding', hint: 'Marriage ceremony', examples: [{ de: 'Die Hochzeit war wunderschön.', en: 'The wedding was beautiful.' }] },
      { de: 'das Kind', en: 'child', hint: 'Offspring', examples: [{ de: 'Unser erstes Kind wurde 2016 geboren.', en: 'Our first child was born in 2016.' }] },
      { de: 'gebären', en: 'to give birth', hint: 'Have child', examples: [{ de: 'Sie hat einen Sohn geboren.', en: 'She gave birth to a son.' }] },
      { de: 'aufwachsen', en: 'to grow up', hint: 'Become adult', examples: [{ de: 'Meine Kinder sind hier aufgewachsen.', en: 'My children grew up here.' }] },
      { de: 'die Familie', en: 'family', hint: 'Relatives', examples: [{ de: 'Meine Familie ist mir wichtig.', en: 'My family is important to me.' }] },
      { de: 'der Freund', en: 'friend', hint: 'Close person', examples: [{ de: 'Ich habe viele Freunde gefunden.', en: 'I found many friends.' }] },
      { de: 'die Freundschaft', en: 'friendship', hint: 'Bond', examples: [{ de: 'Eine lange Freundschaft.', en: 'A long friendship.' }] },
      { de: 'das Haustier', en: 'pet', hint: 'Animal at home', examples: [{ de: 'Als Kind hatte ich einen Hund.', en: 'As a child, I had a dog.' }] },
      { de: 'der Führerschein', en: 'driver\'s license', hint: 'Driving permit', examples: [{ de: 'Mit 18 habe ich den Führerschein gemacht.', en: 'At 18, I got my driver\'s license.' }] },
      { de: 'das Auto', en: 'car', hint: 'Vehicle', examples: [{ de: 'Mein erstes Auto war ein Golf.', en: 'My first car was a Golf.' }] },
      { de: 'der Unfall', en: 'accident', hint: 'Crash', examples: [{ de: 'Ich hatte einen Unfall.', en: 'I had an accident.' }] },
      { de: 'die Krankheit', en: 'illness', hint: 'Sickness', examples: [{ de: 'Eine schwere Krankheit überstehen.', en: 'Survive a serious illness.' }] },
      { de: 'der Krankenhausaufenthalt', en: 'hospital stay', hint: 'In hospital', examples: [{ de: 'Ein langer Krankenhausaufenthalt.', en: 'A long hospital stay.' }] },
      { de: 'die Operation', en: 'surgery', hint: 'Medical procedure', examples: [{ de: 'Eine Operation über sich ergehen lassen.', en: 'Undergo surgery.' }] },
      { de: 'gesund werden', en: 'to become healthy', hint: 'Recover', examples: [{ de: 'Nach der Krankheit wurde ich wieder gesund.', en: 'After the illness, I became healthy again.' }] },
      { de: 'der Erfolg', en: 'success', hint: 'Achievement', examples: [{ de: 'Mein größter Erfolg war...', en: 'My greatest success was...' }] },
      { de: 'schaffen', en: 'to manage', hint: 'Achieve', examples: [{ de: 'Ich habe die Prüfung geschafft.', en: 'I managed to pass the exam.' }] },
      { de: 'das Ziel', en: 'goal', hint: 'Objective', examples: [{ de: 'Mein Ziel war es, Deutsch zu lernen.', en: 'My goal was to learn German.' }] },
      { de: 'erreichen', en: 'to achieve', hint: 'Reach goal', examples: [{ de: 'Ich habe mein Ziel erreicht.', en: 'I achieved my goal.' }] },
      { de: 'der Traum', en: 'dream', hint: 'Aspiration', examples: [{ de: 'Mein Traum war es, zu reisen.', en: 'My dream was to travel.' }] },
      { de: 'sich wünschen', en: 'to wish', hint: 'Desire', examples: [{ de: 'Ich wünschte mir ein Fahrrad.', en: 'I wished for a bike.' }] },
      { de: 'die Erinnerung', en: 'memory', hint: 'Remembrance', examples: [{ de: 'Eine schöne Erinnerung.', en: 'A nice memory.' }] },
      { de: 'sich erinnern an', en: 'to remember', hint: 'Recall', examples: [{ de: 'Ich erinnere mich an meine Kindheit.', en: 'I remember my childhood.' }] },
      { de: 'vergessen', en: 'to forget', hint: 'Not remember', examples: [{ de: 'Ich habe meinen Termin vergessen.', en: 'I forgot my appointment.' }] },
      { de: 'der Abschied', en: 'farewell', hint: 'Saying goodbye', examples: [{ de: 'Der Abschied war schwer.', en: 'The farewell was hard.' }] },
      { de: 'sich verabschieden', en: 'to say goodbye', hint: 'Leave', examples: [{ de: 'Ich verabschiedete mich von meinen Freunden.', en: 'I said goodbye to my friends.' }] },
      { de: 'der Umzug', en: 'move', hint: 'Changing house', examples: [{ de: 'Nach dem Umzug musste ich mich eingewöhnen.', en: 'After the move, I had to get used to it.' }] },
      { de: 'sich gewöhnen an', en: 'to get used to', hint: 'Adjust', examples: [{ de: 'Ich habe mich an das neue Land gewöhnt.', en: 'I got used to the new country.' }] },
      { de: 'die Veränderung', en: 'change', hint: 'Different', examples: [{ de: 'Die Veränderung war positiv.', en: 'The change was positive.' }] },
      { de: 'sich verändern', en: 'to change', hint: 'Become different', examples: [{ de: 'Ich habe mich sehr verändert.', en: 'I have changed a lot.' }] },
      { de: 'die Erfahrung', en: 'experience', hint: 'Knowledge gained', examples: [{ de: 'Viel Erfahrung im Leben.', en: 'A lot of experience in life.' }] },
      { de: 'die Lebenserfahrung', en: 'life experience', hint: 'Wisdom', examples: [{ de: 'Mit der Lebenserfahrung kommt Weisheit.', en: 'With life experience comes wisdom.' }] },
      { de: 'die Vergangenheit', en: 'past', hint: 'Time gone by', examples: [{ de: 'In der Vergangenheit war alles anders.', en: 'In the past, everything was different.' }] },
      { de: 'die Gegenwart', en: 'present', hint: 'Now', examples: [{ de: 'In der Gegenwart lebe ich hier.', en: 'In the present, I live here.' }] },
      { de: 'die Zukunft', en: 'future', hint: 'Time to come', examples: [{ de: 'In der Zukunft möchte ich reisen.', en: 'In the future, I want to travel.' }] },
      { de: 'der Plan', en: 'plan', hint: 'Intention', examples: [{ de: 'Mein Plan für die Zukunft.', en: 'My plan for the future.' }] },
      { de: 'hoffen', en: 'to hope', hint: 'Wish for future', examples: [{ de: 'Ich hoffe, dass es klappt.', en: 'I hope it works out.' }] },
      { de: 'glauben', en: 'to believe', hint: 'Think', examples: [{ de: 'Ich glaube, es wird gut.', en: 'I believe it will be good.' }] },
      { de: 'denken', en: 'to think', hint: 'Consider', examples: [{ de: 'Ich denke oft an die Vergangenheit.', en: 'I often think about the past.' }] },

      // Feelings & Opinions (80)
      { de: 'das Gefühl', en: 'feeling', hint: 'Emotion', examples: [{ de: 'Ein gutes Gefühl.', en: 'A good feeling.' }] },
      { de: 'die Emotion', en: 'emotion', hint: 'Feeling', examples: [{ de: 'Starke Emotionen.', en: 'Strong emotions.' }] },
      { de: 'glücklich', en: 'happy', hint: 'Feeling joy', examples: [{ de: 'Ich bin glücklich.', en: 'I am happy.' }] },
      { de: 'traurig', en: 'sad', hint: 'Feeling sorrow', examples: [{ de: 'Er ist traurig.', en: 'He is sad.' }] },
      { de: 'wütend', en: 'angry', hint: 'Feeling anger', examples: [{ de: 'Sie ist wütend auf mich.', en: 'She is angry at me.' }] },
      { de: 'ängstlich', en: 'anxious', hint: 'Feeling fear', examples: [{ de: 'Ich bin ängstlich vor der Prüfung.', en: 'I am anxious about the exam.' }] },
      { de: 'Angst haben', en: 'to be afraid', hint: 'Fear', examples: [{ de: 'Ich habe Angst vor Spinnen.', en: 'I am afraid of spiders.' }] },
      { de: 'sich freuen', en: 'to be glad', hint: 'Look forward', examples: [{ de: 'Ich freue mich auf das Wochenende.', en: 'I am looking forward to the weekend.' }] },
      { de: 'sich ärgern', en: 'to be annoyed', hint: 'Get angry', examples: [{ de: 'Er ärgert sich über den Stau.', en: 'He is annoyed about the traffic jam.' }] },
      { de: 'sich langweilen', en: 'to be bored', hint: 'Have nothing to do', examples: [{ de: 'Im Urlaub langweile ich mich nie.', en: 'On vacation, I am never bored.' }] },
      { de: 'die Langeweile', en: 'boredom', hint: 'State of being bored', examples: [{ de: 'Langeweile ist schlimm.', en: 'Boredom is bad.' }] },
      { de: 'überrascht', en: 'surprised', hint: 'Unexpected', examples: [{ de: 'Ich war überrascht.', en: 'I was surprised.' }] },
      { de: 'enttäuscht', en: 'disappointed', hint: 'Let down', examples: [{ de: 'Er ist enttäuscht von mir.', en: 'He is disappointed in me.' }] },
      { de: 'zufrieden', en: 'satisfied', hint: 'Content', examples: [{ de: 'Ich bin mit meinem Leben zufrieden.', en: 'I am satisfied with my life.' }] },
      { de: 'unglücklich', en: 'unhappy', hint: 'Not happy', examples: [{ de: 'Sie ist unglücklich in ihrer Beziehung.', en: 'She is unhappy in her relationship.' }] },
      { de: 'neidisch', en: 'envious', hint: 'Jealous', examples: [{ de: 'Er ist neidisch auf ihren Erfolg.', en: 'He is envious of her success.' }] },
      { de: 'eifersüchtig', en: 'jealous', hint: 'Romantic jealousy', examples: [{ de: 'Sie ist eifersüchtig auf seine Ex-Freundin.', en: 'She is jealous of his ex-girlfriend.' }] },
      { de: 'stolz', en: 'proud', hint: 'Feeling pride', examples: [{ de: 'Ich bin stolz auf dich.', en: 'I am proud of you.' }] },
      { de: 'schüchtern', en: 'shy', hint: 'Timid', examples: [{ de: 'Als Kind war ich schüchtern.', en: 'As a child, I was shy.' }] },
      { de: 'selbstbewusst', en: 'self-confident', hint: 'Confident', examples: [{ de: 'Sie ist sehr selbstbewusst.', en: 'She is very self-confident.' }] },
      { de: 'nervös', en: 'nervous', hint: 'Anxious', examples: [{ de: 'Vor der Prüfung bin ich nervös.', en: 'Before the exam, I am nervous.' }] },
      { de: 'ruhig', en: 'calm', hint: 'Not nervous', examples: [{ de: 'Bleib ruhig!', en: 'Stay calm!' }] },
      { de: 'aufgeregt', en: 'excited', hint: 'Positive nervous', examples: [{ de: 'Ich bin aufgeregt wegen des Konzerts.', en: 'I am excited about the concert.' }] },
      { de: 'gespannt', en: 'curious/eager', hint: 'Want to know', examples: [{ de: 'Ich bin gespannt, was passiert.', en: 'I am curious to see what happens.' }] },
      { de: 'verliebt', en: 'in love', hint: 'Love feeling', examples: [{ de: 'Sie ist verliebt.', en: 'She is in love.' }] },
      { de: 'einsam', en: 'lonely', hint: 'Alone and sad', examples: [{ de: 'In der großen Stadt fühle ich mich einsam.', en: 'In the big city, I feel lonely.' }] },
      { de: 'die Einsamkeit', en: 'loneliness', hint: 'Being alone', examples: [{ de: 'Einsamkeit ist schwer.', en: 'Loneliness is hard.' }] },
      { de: 'die Liebe', en: 'love', hint: 'Strong affection', examples: [{ de: 'Die Liebe zu meiner Familie.', en: 'The love for my family.' }] },
      { de: 'der Hass', en: 'hatred', hint: 'Strong dislike', examples: [{ de: 'Hass ist ein starkes Gefühl.', en: 'Hatred is a strong feeling.' }] },
      { de: 'die Freude', en: 'joy', hint: 'Happiness', examples: [{ de: 'Die Freude war groß.', en: 'The joy was great.' }] },
      { de: 'die Trauer', en: 'sadness', hint: 'Grief', examples: [{ de: 'Trauer nach einem Verlust.', en: 'Sadness after a loss.' }] },
      { de: 'die Wut', en: 'anger', hint: 'Rage', examples: [{ de: 'Wut im Bauch.', en: 'Anger in the stomach.' }] },
      { de: 'die Angst', en: 'fear', hint: 'Being afraid', examples: [{ de: 'Angst vor der Dunkelheit.', en: 'Fear of the dark.' }] },
      { de: 'die Hoffnung', en: 'hope', hint: 'Positive expectation', examples: [{ de: 'Die Hoffnung stirbt zuletzt.', en: 'Hope dies last.' }] },
      { de: 'hoffen', en: 'to hope', hint: 'Wish for', examples: [{ de: 'Ich hoffe, es wird besser.', en: 'I hope it gets better.' }] },
      { de: 'die Meinung', en: 'opinion', hint: 'What you think', examples: [{ de: 'Meiner Meinung nach...', en: 'In my opinion...' }] },
      { de: 'finden', en: 'to find/think', hint: 'Express opinion', examples: [{ de: 'Ich finde den Film gut.', en: 'I think the movie is good.' }] },
      { de: 'glauben', en: 'to believe', hint: 'Think', examples: [{ de: 'Ich glaube, er hat recht.', en: 'I believe he is right.' }] },
      { de: 'denken', en: 'to think', hint: 'Have thought', examples: [{ de: 'Was denkst du?', en: 'What do you think?' }] },
      { de: 'meinen', en: 'to mean/think', hint: 'Opine', examples: [{ de: 'Was meinst du?', en: 'What do you mean/think?' }] },
      { de: 'halten von', en: 'to think of', hint: 'Have opinion', examples: [{ de: 'Was hältst du von dem Plan?', en: 'What do you think of the plan?' }] },
      { de: 'zustimmen', en: 'to agree', hint: 'Say yes', examples: [{ de: 'Ich stimme dir zu.', en: 'I agree with you.' }] },
      { de: 'widersprechen', en: 'to disagree', hint: 'Say no', examples: [{ de: 'Ich muss widersprechen.', en: 'I have to disagree.' }] },
      { de: 'diskutieren', en: 'to discuss', hint: 'Talk about', examples: [{ de: 'Wir diskutieren über Politik.', en: 'We discuss politics.' }] },
      { de: 'die Diskussion', en: 'discussion', hint: 'Conversation', examples: [{ de: 'Eine hitzige Diskussion.', en: 'A heated discussion.' }] },
      { de: 'der Streit', en: 'argument', hint: 'Fight', examples: [{ de: 'Einen Streit haben.', en: 'Have an argument.' }] },
      { de: 'sich streiten', en: 'to argue', hint: 'Fight verbally', examples: [{ de: 'Sie streiten sich oft.', en: 'They often argue.' }] },
      { de: 'die Lösung', en: 'solution', hint: 'Answer', examples: [{ de: 'Eine Lösung finden.', en: 'Find a solution.' }] },
      { de: 'das Problem', en: 'problem', hint: 'Issue', examples: [{ de: 'Ein Problem lösen.', en: 'Solve a problem.' }] },
      { de: 'schwierig', en: 'difficult', hint: 'Hard', examples: [{ de: 'Eine schwierige Entscheidung.', en: 'A difficult decision.' }] },
      { de: 'einfach', en: 'simple', hint: 'Easy', examples: [{ de: 'Das ist einfach!', en: 'That\'s simple!' }] },
      { de: 'die Entscheidung', en: 'decision', hint: 'Choice', examples: [{ de: 'Eine Entscheidung treffen.', en: 'Make a decision.' }] },
      { de: 'sich entscheiden', en: 'to decide', hint: 'Choose', examples: [{ de: 'Ich habe mich für Deutsch entschieden.', en: 'I decided on German.' }] },
      { de: 'die Wahl', en: 'choice', hint: 'Option', examples: [{ de: 'Die Wahl haben.', en: 'Have the choice.' }] },
      { de: 'wählen', en: 'to choose', hint: 'Pick', examples: [{ de: 'Welches Fach wählst du?', en: 'Which subject do you choose?' }] },
      { de: 'lieber', en: 'preferably', hint: 'Compare liking', examples: [{ de: 'Ich trinke lieber Tee.', en: 'I prefer to drink tea.' }] },
      { de: 'am liebsten', en: 'most preferably', hint: 'Favorite', examples: [{ de: 'Am liebsten esse ich Pizza.', en: 'I like pizza best.' }] },
      { de: 'die Vorliebe', en: 'preference', hint: 'Like more', examples: [{ de: 'Meine Vorliebe für klassische Musik.', en: 'My preference for classical music.' }] },
      { de: 'der Geschmack', en: 'taste', hint: 'Preference', examples: [{ de: 'Über Geschmack lässt sich streiten.', en: 'There\'s no accounting for taste.' }] },
      { de: 'gefallen', en: 'to please', hint: 'Be liked', examples: [{ de: 'Das gefällt mir.', en: 'I like that.' }] },
      { de: 'schmecken', en: 'to taste', hint: 'Flavor', examples: [{ de: 'Das schmeckt gut.', en: 'That tastes good.' }] },
      { de: 'passen', en: 'to fit', hint: 'Suit', examples: [{ de: 'Das passt mir.', en: 'That suits me.' }] },
      { de: 'stehen', en: 'to suit (clothes)', hint: 'Look good', examples: [{ de: 'Die Farbe steht dir.', en: 'The color suits you.' }] },
      { de: 'wichtig', en: 'important', hint: 'Of importance', examples: [{ de: 'Das ist mir wichtig.', en: 'That is important to me.' }] },
      { de: 'unwichtig', en: 'unimportant', hint: 'Not important', examples: [{ de: 'Das ist unwichtig.', en: 'That is unimportant.' }] },
      { de: 'interessant', en: 'interesting', hint: 'Holds interest', examples: [{ de: 'Ein interessantes Buch.', en: 'An interesting book.' }] },
      { de: 'langweilig', en: 'boring', hint: 'Not interesting', examples: [{ de: 'Der Film war langweilig.', en: 'The movie was boring.' }] },
      { de: 'spannend', en: 'exciting', hint: 'Thrilling', examples: [{ de: 'Ein spannender Krimi.', en: 'An exciting thriller.' }] },
      { de: 'lustig', en: 'funny', hint: 'Makes laugh', examples: [{ de: 'Er ist lustig.', en: 'He is funny.' }] },
      { de: 'witzig', en: 'witty', hint: 'Clever funny', examples: [{ de: 'Ein witziger Kommentar.', en: 'A witty comment.' }] },
      { de: 'ernst', en: 'serious', hint: 'Not funny', examples: [{ de: 'Das ist ein ernstes Thema.', en: 'That is a serious topic.' }] },
      { de: 'komisch', en: 'strange', hint: 'Odd', examples: [{ de: 'Ein komischer Typ.', en: 'A strange guy.' }] },
      { de: 'seltsam', en: 'weird', hint: 'Strange', examples: [{ de: 'Ein seltsames Gefühl.', en: 'A weird feeling.' }] },
      { de: 'schön', en: 'beautiful', hint: 'Pleasing', examples: [{ de: 'Ein schöner Tag.', en: 'A beautiful day.' }] },
      { de: 'hässlich', en: 'ugly', hint: 'Not beautiful', examples: [{ de: 'Ein hässliches Gebäude.', en: 'An ugly building.' }] },
      { de: 'nett', en: 'nice', hint: 'Friendly', examples: [{ de: 'Ein netter Mensch.', en: 'A nice person.' }] },
      { de: 'freundlich', en: 'friendly', hint: 'Kind', examples: [{ de: 'Eine freundliche Verkäuferin.', en: 'A friendly saleswoman.' }] },
      { de: 'unfreundlich', en: 'unfriendly', hint: 'Not kind', examples: [{ de: 'Ein unfreundlicher Kellner.', en: 'An unfriendly waiter.' }] },
      { de: 'höflich', en: 'polite', hint: 'Well-mannered', examples: [{ de: 'Ein höflicher Junge.', en: 'A polite boy.' }] },
      { de: 'unhöflich', en: 'impolite', hint: 'Rude', examples: [{ de: 'Sei nicht unhöflich!', en: 'Don\'t be impolite!' }] },
      { de: 'sympathisch', en: 'likeable', hint: 'Easy to like', examples: [{ de: 'Sie ist sehr sympathisch.', en: 'She is very likeable.' }] },
      { de: 'unsympathisch', en: 'unlikeable', hint: 'Not likeable', examples: [{ de: 'Ich finde ihn unsympathisch.', en: 'I find him unlikeable.' }] },
      { de: 'ehrlich', en: 'honest', hint: 'Truthful', examples: [{ de: 'Sei ehrlich zu mir!', en: 'Be honest with me!' }] },
      { de: 'faul', en: 'lazy', hint: 'Not hardworking', examples: [{ de: 'Er ist zu faul.', en: 'He is too lazy.' }] },
      { de: 'fleißig', en: 'diligent', hint: 'Hardworking', examples: [{ de: 'Sie ist sehr fleißig.', en: 'She is very diligent.' }] },
      { de: 'pünktlich', en: 'punctual', hint: 'On time', examples: [{ de: 'Deutsche sind pünktlich.', en: 'Germans are punctual.' }] },
      { de: 'zuverlässig', en: 'reliable', hint: 'Can be trusted', examples: [{ de: 'Ein zuverlässiger Freund.', en: 'A reliable friend.' }] },
      { de: 'verantwortlich', en: 'responsible', hint: 'Accountable', examples: [{ de: 'Wer ist verantwortlich?', en: 'Who is responsible?' }] },
    ],
    quiz: [
      // Original A2 quiz entries (2)
      {
        question: 'What does “Ich hätte gern die Speisekarte” mean?',
        correct: 'I would like the menu',
        options: [
          'I am paying the bill',
          'I would like the menu',
          'I am very hungry',
          'Where is the toilet?',
        ],
      },
      {
        question: 'Choose the correct word for “apartment”:',
        correct: 'die Wohnung',
        options: ['das Zimmer', 'die Wohnung', 'das Haus', 'die Küche'],
      },
      // New A2 Quiz Questions (8 more to make 10 total, but adding several)
      {
        question: 'What does “der Termin” mean?',
        correct: 'appointment',
        options: ['meeting', 'appointment', 'deadline', 'date'],
      },
      {
        question: 'How do you say “sometimes” in German?',
        correct: 'manchmal',
        options: ['immer', 'manchmal', 'oft', 'nie'],
      },
      {
        question: 'What is the plural of “der Bahnhof”?',
        correct: 'die Bahnhöfe',
        options: ['die Bahnhofe', 'die Bahnhöfe', 'der Bahnhöfe', 'die Bahnhöfen'],
      },
      {
        question: 'Which word means “usually”?',
        correct: 'normalerweise',
        options: ['manchmal', 'normalerweise', 'oft', 'regelmäßig'],
      },
      {
        question: 'What does “die Rechnung” mean in a restaurant?',
        correct: 'the bill',
        options: ['the menu', 'the bill', 'the tip', 'the order'],
      },
      {
        question: 'How do you say “I would like...” in German?',
        correct: 'Ich hätte gern...',
        options: ['Ich möchte...', 'Ich hätte gern...', 'Ich will...', 'Ich mag...'],
      },
      {
        question: 'What does “die Wohnung” mean?',
        correct: 'apartment',
        options: ['house', 'apartment', 'room', 'building'],
      },
      {
        question: 'How do you say “to apply” for a job?',
        correct: 'sich bewerben',
        options: ['bewerben', 'sich bewerben', 'anstellen', 'einstellen'],
      },
      {
        question: 'What does “das Krankenhaus” mean?',
        correct: 'hospital',
        options: ['doctor\'s office', 'hospital', 'pharmacy', 'clinic'],
      },
      {
        question: 'Which word means “to travel”?',
        correct: 'reisen',
        options: ['fahren', 'reisen', 'fliegen', 'wandern'],
      },
      {
        question: 'What does “der Beruf” mean?',
        correct: 'profession',
        options: ['work', 'profession', 'job', 'career'],
      },
      {
        question: 'How do you say “yesterday” in German?',
        correct: 'gestern',
        options: ['heute', 'morgen', 'gestern', 'vorgestern'],
      },
      {
        question: 'What does “die Freizeit” mean?',
        correct: 'free time',
        options: ['work time', 'free time', 'leisure', 'vacation'],
      },
      {
        question: 'Which word means “to try on” clothes?',
        correct: 'anprobieren',
        options: ['anziehen', 'anprobieren', 'tragen', 'ausziehen'],
      },
      {
        question: 'What does “die Größe” mean in clothing?',
        correct: 'size',
        options: ['color', 'size', 'price', 'style'],
      },
      {
        question: 'How do you say “I agree” in German?',
        correct: 'Ich stimme zu',
        options: ['Ich bin einverstanden', 'Ich stimme zu', 'Ich denke ja', 'Ich sage ja'],
      },
    ],
  },
  B1: {
    flashcards: [
      // Original B1 entries (4)
      {
        de: 'die Herausforderung',
        en: 'challenge',
        gender: 'die',
        plural: 'die Herausforderungen',
        hint: 'Something that is difficult but positive',
        examples: [
          {
            de: 'Dieser Job ist eine große Herausforderung.',
            en: 'This job is a big challenge.',
          },
        ],
      },
      {
        de: 'verantwortlich',
        en: 'responsible',
        hint: 'Describes someone who takes ownership',
        examples: [
          {
            de: 'Sie ist verantwortlich für das Projekt.',
            en: 'She is responsible for the project.',
          },
        ],
      },
      {
        de: 'die Erfahrung',
        en: 'experience',
        gender: 'die',
        plural: 'die Erfahrungen',
        hint: 'You gain this over time',
        examples: [
          {
            de: 'Er hat viel Erfahrung in diesem Bereich.',
            en: 'He has a lot of experience in this field.',
          },
        ],
      },
      {
        de: 'sich bewerben',
        en: 'to apply (for a job)',
        hint: 'You do this before getting hired',
        examples: [
          {
            de: 'Ich möchte mich auf diese Stelle bewerben.',
            en: 'I would like to apply for this position.',
          },
        ],
      },
      // New B1 Flashcards (996 additional) - Total B1: 1000
      // Work & Career (80)
      { de: 'die Karriere', en: 'career', hint: 'Professional path', examples: [{ de: 'Sie macht eine glänzende Karriere.', en: 'She has a brilliant career.' }] },
      { de: 'die Stelle', en: 'position', hint: 'Job', examples: [{ de: 'Er hat eine neue Stelle als Manager.', en: 'He has a new position as a manager.' }] },
      { de: 'die Bewerbung', en: 'application', hint: 'For job', examples: [{ de: 'Die Bewerbung muss vollständig sein.', en: 'The application must be complete.' }] },
      { de: 'das Anschreiben', en: 'cover letter', hint: 'Part of application', examples: [{ de: 'Ein überzeugendes Anschreiben.', en: 'A convincing cover letter.' }] },
      { de: 'der Lebenslauf', en: 'CV', hint: 'Resume', examples: [{ de: 'Im Lebenslauf stehen die Stationen.', en: 'In the CV are the stages.' }] },
      { de: 'das Vorstellungsgespräch', en: 'job interview', hint: 'Interview', examples: [{ de: 'Das Vorstellungsgespräch lief gut.', en: 'The job interview went well.' }] },
      { de: 'der Arbeitgeber', en: 'employer', hint: 'Company/boss', examples: [{ de: 'Mein Arbeitgeber bietet viele Vorteile.', en: 'My employer offers many benefits.' }] },
      { de: 'der Arbeitnehmer', en: 'employee', hint: 'Worker', examples: [{ de: 'Die Rechte der Arbeitnehmer.', en: 'The rights of employees.' }] },
      { de: 'die Firma', en: 'company', hint: 'Business', examples: [{ de: 'Er arbeitet bei einer internationalen Firma.', en: 'He works for an international company.' }] },
      { de: 'das Unternehmen', en: 'enterprise', hint: 'Business', examples: [{ de: 'Ein mittelständisches Unternehmen.', en: 'A medium-sized company.' }] },
      { de: 'der Konzern', en: 'corporation', hint: 'Large company', examples: [{ de: 'Ein globaler Konzern.', en: 'A global corporation.' }] },
      { de: 'die Abteilung', en: 'department', hint: 'Division', examples: [{ de: 'In welcher Abteilung arbeitest du?', en: 'In which department do you work?' }] },
      { de: 'der Kollege', en: 'colleague', hint: 'Co-worker', examples: [{ de: 'Meine Kollegen sind kompetent.', en: 'My colleagues are competent.' }] },
      { de: 'der Vorgesetzte', en: 'superior', hint: 'Boss', examples: [{ de: 'Mein Vorgesetzter ist streng.', en: 'My superior is strict.' }] },
      { de: 'die Führungskraft', en: 'manager', hint: 'Leader', examples: [{ de: 'Als Führungskraft trägt man Verantwortung.', en: 'As a manager, you bear responsibility.' }] },
      { de: 'das Team', en: 'team', hint: 'Group', examples: [{ de: 'Unser Team arbeitet gut zusammen.', en: 'Our team works well together.' }] },
      { de: 'die Zusammenarbeit', en: 'cooperation', hint: 'Working together', examples: [{ de: 'Die Zusammenarbeit war produktiv.', en: 'The cooperation was productive.' }] },
      { de: 'das Projekt', en: 'project', hint: 'Task', examples: [{ de: 'Ein anspruchsvolles Projekt.', en: 'A demanding project.' }] },
      { de: 'die Aufgabe', en: 'task', hint: 'Duty', examples: [{ de: 'Eine komplexe Aufgabe lösen.', en: 'Solve a complex task.' }] },
      { de: 'die Verantwortung', en: 'responsibility', hint: 'Duty', examples: [{ de: 'Verantwortung übernehmen.', en: 'Take responsibility.' }] },
      { de: 'die Fähigkeit', en: 'ability', hint: 'Skill', examples: [{ de: 'Kommunikative Fähigkeiten.', en: 'Communication skills.' }] },
      { de: 'die Kompetenz', en: 'competence', hint: 'Skill', examples: [{ de: 'Fachliche Kompetenz.', en: 'Technical competence.' }] },
      { de: 'die Qualifikation', en: 'qualification', hint: 'Skill/degree', examples: [{ de: 'Die erforderlichen Qualifikationen.', en: 'The required qualifications.' }] },
      { de: 'die Ausbildung', en: 'training', hint: 'Vocational', examples: [{ de: 'Eine Ausbildung zum Fachinformatiker.', en: 'Training as an IT specialist.' }] },
      { de: 'das Studium', en: 'university studies', hint: 'Higher education', examples: [{ de: 'Das Studium der Betriebswirtschaft.', en: 'Studying business administration.' }] },
      { de: 'der Abschluss', en: 'degree', hint: 'Graduation', examples: [{ de: 'Den Masterabschluss machen.', en: 'Get a master\'s degree.' }] },
      { de: 'das Praktikum', en: 'internship', hint: 'Work experience', examples: [{ de: 'Ein Praktikum im Ausland.', en: 'An internship abroad.' }] },
      { de: 'die Weiterbildung', en: 'further education', hint: 'Advanced training', examples: [{ de: 'Sich durch Weiterbildung qualifizieren.', en: 'Qualify through further education.' }] },
      { de: 'der Kurs', en: 'course', hint: 'Class', examples: [{ de: 'Einen Kurs belegen.', en: 'Take a course.' }] },
      { de: 'das Seminar', en: 'seminar', hint: 'Workshop', examples: [{ de: 'Ein Seminar zum Thema Führung.', en: 'A seminar on leadership.' }] },
      { de: 'die Fortbildung', en: 'advanced training', hint: 'Learn more', examples: [{ de: 'Regelmäßige Fortbildungen besuchen.', en: 'Attend regular training.' }] },
      { de: 'die Erfahrung', en: 'experience', hint: 'Knowledge from doing', examples: [{ de: 'Praktische Erfahrung sammeln.', en: 'Gain practical experience.' }] },
      { de: 'die Berufserfahrung', en: 'work experience', hint: 'Experience in job', examples: [{ de: 'Mit 10 Jahren Berufserfahrung.', en: 'With 10 years of work experience.' }] },
      { de: 'die Kenntnisse', en: 'knowledge', hint: 'What you know', examples: [{ de: 'Gute Englischkenntnisse.', en: 'Good English skills.' }] },
      { de: 'die Sprachkenntnisse', en: 'language skills', hint: 'Languages', examples: [{ de: 'Seine Sprachkenntnisse sind ausgezeichnet.', en: 'His language skills are excellent.' }] },
      { de: 'das Gehalt', en: 'salary', hint: 'Monthly pay', examples: [{ de: 'Ein attraktives Gehalt.', en: 'An attractive salary.' }] },
      { de: 'der Lohn', en: 'wage', hint: 'Hourly pay', examples: [{ de: 'Der Mindestlohn.', en: 'The minimum wage.' }] },
      { de: 'die Steuer', en: 'tax', hint: 'Taxes', examples: [{ de: 'Vom Bruttogehalt werden Steuern abgezogen.', en: 'Taxes are deducted from gross salary.' }] },
      { de: 'das Netto', en: 'net', hint: 'After tax', examples: [{ de: 'Das Nettoeinkommen.', en: 'Net income.' }] },
      { de: 'das Brutto', en: 'gross', hint: 'Before tax', examples: [{ de: 'Ein Bruttogehalt von 4000 Euro.', en: 'A gross salary of 4000 euros.' }] },
      { de: 'die Krankenversicherung', en: 'health insurance', hint: 'Insurance', examples: [{ de: 'Die Krankenversicherung ist Pflicht.', en: 'Health insurance is mandatory.' }] },
      { de: 'die Rente', en: 'pension', hint: 'Retirement money', examples: [{ de: 'In die Rente einzahlen.', en: 'Pay into the pension.' }] },
      { de: 'der Vertrag', en: 'contract', hint: 'Agreement', examples: [{ de: 'Einen Arbeitsvertrag unterschreiben.', en: 'Sign an employment contract.' }] },
      { de: 'die Probezeit', en: 'probation period', hint: 'Trial time', examples: [{ de: 'In der Probezeit kann man schnell kündigen.', en: 'During probation, you can quit quickly.' }] },
      { de: 'kündigen', en: 'to quit', hint: 'Leave job', examples: [{ de: 'Er hat fristgerecht gekündigt.', en: 'He quit on time.' }] },
      { de: 'die Kündigung', en: 'termination', hint: 'Notice', examples: [{ de: 'Die Kündigung erhalten.', en: 'Receive the termination.' }] },
      { de: 'entlassen', en: 'to fire', hint: 'Dismiss', examples: [{ de: 'Wegen Wirtschaftskrise entlassen.', en: 'Fired due to economic crisis.' }] },
      { de: 'die Entlassung', en: 'dismissal', hint: 'Fired', examples: [{ de: 'Die Entlassung war ungerecht.', en: 'The dismissal was unfair.' }] },
      { de: 'arbeitslos', en: 'unemployed', hint: 'No job', examples: [{ de: 'Arbeitslos gemeldet sein.', en: 'Be registered as unemployed.' }] },
      { de: 'die Arbeitslosigkeit', en: 'unemployment', hint: 'State of no job', examples: [{ de: 'Die Arbeitslosigkeit steigt.', en: 'Unemployment is rising.' }] },
      { de: 'das Arbeitsamt', en: 'employment office', hint: 'Job center', examples: [{ de: 'Zum Arbeitsamt gehen.', en: 'Go to the employment office.' }] },
      { de: 'das Arbeitslosengeld', en: 'unemployment benefit', hint: 'Money when jobless', examples: [{ de: 'Arbeitslosengeld beantragen.', en: 'Apply for unemployment benefit.' }] },
      { de: 'die Gewerkschaft', en: 'union', hint: 'Worker organization', examples: [{ de: 'In der Gewerkschaft organisieren.', en: 'Organize in the union.' }] },
      { de: 'der Streik', en: 'strike', hint: 'Work stoppage', examples: [{ de: 'Für höhere Löhne streiken.', en: 'Strike for higher wages.' }] },
      { de: 'die Arbeitszeit', en: 'working hours', hint: 'Hours worked', examples: [{ de: 'Flexible Arbeitszeiten.', en: 'Flexible working hours.' }] },
      { de: 'die Überstunden', en: 'overtime', hint: 'Extra hours', examples: [{ de: 'Überstunden machen.', en: 'Do overtime.' }] },
      { de: 'die Teilzeit', en: 'part-time', hint: 'Less than full', examples: [{ de: 'In Teilzeit arbeiten.', en: 'Work part-time.' }] },
      { de: 'die Vollzeit', en: 'full-time', hint: 'Full week', examples: [{ de: 'Eine Vollzeitstelle.', en: 'A full-time position.' }] },
      { de: 'die Schicht', en: 'shift', hint: 'Work period', examples: [{ de: 'Im Schichtdienst arbeiten.', en: 'Work in shifts.' }] },
      { de: 'die Beförderung', en: 'promotion', hint: 'Move up', examples: [{ de: 'Eine Beförderung zum Abteilungsleiter.', en: 'A promotion to department head.' }] },
      { de: 'die Gehaltserhöhung', en: 'pay raise', hint: 'More money', examples: [{ de: 'Eine Gehaltserhöhung bekommen.', en: 'Get a pay raise.' }] },
      { de: 'die Prämie', en: 'bonus', hint: 'Extra payment', examples: [{ de: 'Eine leistungsbezogene Prämie.', en: 'A performance-related bonus.' }] },
      { de: 'der Urlaub', en: 'vacation', hint: 'Holiday', examples: [{ de: '30 Tage Urlaub pro Jahr.', en: '30 days of vacation per year.' }] },
      { de: 'der Feiertag', en: 'public holiday', hint: 'Day off', examples: [{ de: 'Am Feiertag ist frei.', en: 'On public holidays, it\'s off.' }] },
      { de: 'die Elternzeit', en: 'parental leave', hint: 'Time off for child', examples: [{ de: 'Ein Jahr Elternzeit nehmen.', en: 'Take one year of parental leave.' }] },
      { de: 'die Mutterschutz', en: 'maternity protection', hint: 'Before/after birth', examples: [{ de: 'Im Mutterschutz sein.', en: 'Be on maternity leave.' }] },
      { de: 'der Arbeitsplatz', en: 'workplace', hint: 'Where you work', examples: [{ de: 'Einen sicheren Arbeitsplatz haben.', en: 'Have a secure job.' }] },
      { de: 'das Büro', en: 'office', hint: 'Work room', examples: [{ de: 'Ein modernes Büro.', en: 'A modern office.' }] },
      { de: 'das Homeoffice', en: 'home office', hint: 'Work from home', examples: [{ de: 'Im Homeoffice arbeiten.', en: 'Work from home.' }] },
      { de: 'der Chef', en: 'boss', hint: 'Leader', examples: [{ de: 'Mein Chef ist fair.', en: 'My boss is fair.' }] },
      { de: 'die Chefin', en: 'boss (female)', hint: 'Female boss', examples: [{ de: 'Meine Chefin ist kompetent.', en: 'My boss is competent.' }] },
      { de: 'der Mitarbeiter', en: 'employee', hint: 'Worker', examples: [{ de: 'Die Mitarbeiter sind motiviert.', en: 'The employees are motivated.' }] },
      { de: 'das Personal', en: 'staff', hint: 'Employees', examples: [{ de: 'Das Personal ist freundlich.', en: 'The staff is friendly.' }] },
      { de: 'die Personalabteilung', en: 'HR department', hint: 'Human Resources', examples: [{ de: 'In der Personalabteilung anrufen.', en: 'Call the HR department.' }] },
      { de: 'die Stelle', en: 'position', hint: 'Job opening', examples: [{ de: 'Eine Stelle ausschreiben.', en: 'Advertise a position.' }] },
      { de: 'die Ausschreibung', en: 'job posting', hint: 'Ad for job', examples: [{ de: 'Auf eine Ausschreibung antworten.', en: 'Respond to a job posting.' }] },
      { de: 'der Bewerber', en: 'applicant', hint: 'Person applying', examples: [{ de: 'Viele Bewerber für die Stelle.', en: 'Many applicants for the position.' }] },
      { de: 'die Bewerberin', en: 'applicant (female)', hint: 'Female applying', examples: [{ de: 'Die Bewerberin war überzeugend.', en: 'The applicant was convincing.' }] },

      // Education & Learning (70)
      { de: 'die Bildung', en: 'education', hint: 'Learning', examples: [{ de: 'Bildung ist wichtig.', en: 'Education is important.' }] },
      { de: 'das Bildungssystem', en: 'education system', hint: 'School/university system', examples: [{ de: 'Das deutsche Bildungssystem.', en: 'The German education system.' }] },
      { de: 'die Schule', en: 'school', hint: 'Institution', examples: [{ de: 'Die Schule ist aus.', en: 'School is out.' }] },
      { de: 'die Grundschule', en: 'primary school', hint: 'Elementary', examples: [{ de: 'In die Grundschule gehen.', en: 'Go to primary school.' }] },
      { de: 'die weiterführende Schule', en: 'secondary school', hint: 'After primary', examples: [{ de: 'Welche weiterführende Schule?', en: 'Which secondary school?' }] },
      { de: 'das Gymnasium', en: 'high school (academic)', hint: 'University prep', examples: [{ de: 'Aufs Gymnasium gehen.', en: 'Go to high school.' }] },
      { de: 'die Realschule', en: 'secondary school', hint: 'Intermediate', examples: [{ de: 'Die Realschule besuchen.', en: 'Attend Realschule.' }] },
      { de: 'die Hauptschule', en: 'secondary school', hint: 'Basic', examples: [{ de: 'Nach der Hauptschule eine Ausbildung.', en: 'After Hauptschule, an apprenticeship.' }] },
      { de: 'die Gesamtschule', en: 'comprehensive school', hint: 'All levels', examples: [{ de: 'Auf die Gesamtschule gehen.', en: 'Go to comprehensive school.' }] },
      { de: 'das Abitur', en: 'high school diploma', hint: 'University entrance', examples: [{ de: 'Abitur machen.', en: 'Take the Abitur.' }] },
      { de: 'der Schüler', en: 'pupil', hint: 'School student', examples: [{ de: 'Die Schüler lernen.', en: 'The pupils learn.' }] },
      { de: 'die Schülerin', en: 'pupil (female)', hint: 'School student', examples: [{ de: 'Eine fleißige Schülerin.', en: 'A diligent pupil.' }] },
      { de: 'der Lehrer', en: 'teacher', hint: 'Educator', examples: [{ de: 'Der Lehrer erklärt.', en: 'The teacher explains.' }] },
      { de: 'die Lehrerin', en: 'teacher (female)', hint: 'Educator', examples: [{ de: 'Eine engagierte Lehrerin.', en: 'A committed teacher.' }] },
      { de: 'der Professor', en: 'professor', hint: 'University teacher', examples: [{ de: 'Der Professor hält eine Vorlesung.', en: 'The professor gives a lecture.' }] },
      { de: 'die Professorin', en: 'professor (female)', hint: 'University teacher', examples: [{ de: 'Eine bekannte Professorin.', en: 'A famous professor.' }] },
      { de: 'der Dozent', en: 'lecturer', hint: 'Teaches at university', examples: [{ de: 'Der Dozent erklärt die Theorie.', en: 'The lecturer explains the theory.' }] },
      { de: 'die Dozentin', en: 'lecturer (female)', hint: 'Teacher at uni', examples: [{ de: 'Eine kompetente Dozentin.', en: 'A competent lecturer.' }] },
      { de: 'der Student', en: 'student (male)', hint: 'University', examples: [{ de: 'Er ist Student der Medizin.', en: 'He is a medical student.' }] },
      { de: 'die Studentin', en: 'student (female)', hint: 'University', examples: [{ de: 'Sie ist Studentin.', en: 'She is a student.' }] },
      { de: 'das Studium', en: 'studies', hint: 'University education', examples: [{ de: 'Das Studium dauert 4 Jahre.', en: 'The studies last 4 years.' }] },
      { de: 'der Studiengang', en: 'course of study', hint: 'Program', examples: [{ de: 'Welcher Studiengang?', en: 'Which course of study?' }] },
      { de: 'das Fach', en: 'subject', hint: 'Field', examples: [{ de: 'Mein Fach ist Germanistik.', en: 'My subject is German studies.' }] },
      { de: 'das Semester', en: 'semester', hint: 'Half-year term', examples: [{ de: 'Im ersten Semester.', en: 'In the first semester.' }] },
      { de: 'die Vorlesung', en: 'lecture', hint: 'Large class', examples: [{ de: 'In die Vorlesung gehen.', en: 'Go to the lecture.' }] },
      { de: 'das Seminar', en: 'seminar', hint: 'Small class', examples: [{ de: 'Am Seminar teilnehmen.', en: 'Participate in the seminar.' }] },
      { de: 'das Tutorium', en: 'tutorial', hint: 'Small group', examples: [{ de: 'Zum Tutorium gehen.', en: 'Go to the tutorial.' }] },
      { de: 'die Prüfung', en: 'exam', hint: 'Test', examples: [{ de: 'Eine schwierige Prüfung.', en: 'A difficult exam.' }] },
      { de: 'die Klausur', en: 'written exam', hint: 'Test in writing', examples: [{ de: 'Eine Klausur schreiben.', en: 'Take a written exam.' }] },
      { de: 'die mündliche Prüfung', en: 'oral exam', hint: 'Speak test', examples: [{ de: 'Die mündliche Prüfung besteht.', en: 'Pass the oral exam.' }] },
      { de: 'bestehen', en: 'to pass', hint: 'Succeed', examples: [{ de: 'Die Prüfung bestehen.', en: 'Pass the exam.' }] },
      { de: 'durchfallen', en: 'to fail', hint: 'Not pass', examples: [{ de: 'Bei der Prüfung durchfallen.', en: 'Fail the exam.' }] },
      { de: 'die Note', en: 'grade', hint: 'Score', examples: [{ de: 'Eine gute Note bekommen.', en: 'Get a good grade.' }] },
      { de: 'die Zensur', en: 'grade', hint: 'Mark', examples: [{ de: 'Die Zensuren sind da.', en: 'The grades are in.' }] },
      { de: 'das Zeugnis', en: 'report card', hint: 'List of grades', examples: [{ de: 'Das Zeugnis bekommen.', en: 'Get the report card.' }] },
      { de: 'der Schein', en: 'certificate', hint: 'Proof of course', examples: [{ de: 'Einen Schein erwerben.', en: 'Acquire a certificate.' }] },
      { de: 'der Abschluss', en: 'degree', hint: 'Completion', examples: [{ de: 'Den Bachelorabschluss machen.', en: 'Get a bachelor\'s degree.' }] },
      { de: 'der Bachelor', en: 'bachelor', hint: 'First degree', examples: [{ de: 'Bachelor of Arts.', en: 'Bachelor of Arts.' }] },
      { de: 'der Master', en: 'master', hint: 'Advanced degree', examples: [{ de: 'Master of Science.', en: 'Master of Science.' }] },
      { de: 'die Promotion', en: 'doctorate', hint: 'PhD', examples: [{ de: 'Promotion an der Universität.', en: 'Doctorate at the university.' }] },
      { de: 'die Dissertation', en: 'dissertation', hint: 'PhD thesis', examples: [{ de: 'An der Dissertation schreiben.', en: 'Write the dissertation.' }] },
      { de: 'die Forschung', en: 'research', hint: 'Academic investigation', examples: [{ de: 'In der Forschung arbeiten.', en: 'Work in research.' }] },
      { de: 'der Forscher', en: 'researcher', hint: 'Scientist', examples: [{ de: 'Der Forscher macht Experimente.', en: 'The researcher does experiments.' }] },
      { de: 'das Labor', en: 'lab', hint: 'Laboratory', examples: [{ de: 'Im Labor arbeiten.', en: 'Work in the lab.' }] },
      { de: 'die Universität', en: 'university', hint: 'Higher education', examples: [{ de: 'An der Universität studieren.', en: 'Study at the university.' }] },
      { de: 'die Hochschule', en: 'college', hint: 'Higher education', examples: [{ de: 'An der Fachhochschule.', en: 'At the university of applied sciences.' }] },
      { de: 'die Fachhochschule', en: 'university of applied sciences', hint: 'Practical focus', examples: [{ de: 'An der Fachhochschule studieren.', en: 'Study at the university of applied sciences.' }] },
      { de: 'die Bibliothek', en: 'library', hint: 'Place with books', examples: [{ de: 'In der Bibliothek lernen.', en: 'Study in the library.' }] },
      { de: 'der Campus', en: 'campus', hint: 'University grounds', examples: [{ de: 'Auf dem Campus.', en: 'On campus.' }] },
      { de: 'das Wohnheim', en: 'dormitory', hint: 'Student housing', examples: [{ de: 'Im Wohnheim wohnen.', en: 'Live in the dorm.' }] },
      { de: 'die Mensa', en: 'cafeteria', hint: 'Student restaurant', examples: [{ de: 'In der Mensa essen.', en: 'Eat in the cafeteria.' }] },
      { de: 'das Stipendium', en: 'scholarship', hint: 'Financial aid', examples: [{ de: 'Ein Stipendium bekommen.', en: 'Get a scholarship.' }] },
      { de: 'die Voraussetzung', en: 'requirement', hint: 'Prerequisite', examples: [{ de: 'Die Voraussetzungen erfüllen.', en: 'Meet the requirements.' }] },
      { de: 'die Zulassung', en: 'admission', hint: 'Permission to study', examples: [{ de: 'Die Zulassung erhalten.', en: 'Receive admission.' }] },
      { de: 'der Numerus Clausus', en: 'NC', hint: 'Grade limit', examples: [{ de: 'Medizin hat einen Numerus Clausus.', en: 'Medicine has a numerus clausus.' }] },
      { de: 'die Bewerbung', en: 'application', hint: 'For studies', examples: [{ de: 'Die Bewerbung für das Studium.', en: 'The application for studies.' }] },
      { de: 'immatrikulieren', en: 'to enroll', hint: 'Register at uni', examples: [{ de: 'Sich an der Uni immatrikulieren.', en: 'Enroll at the university.' }] },
      { de: 'exmatrikulieren', en: 'to unenroll', hint: 'Leave uni', examples: [{ de: 'Sich exmatrikulieren.', en: 'Unenroll.' }] },
      { de: 'das Semesterticket', en: 'semester ticket', hint: 'Public transport pass', examples: [{ de: 'Mit dem Semesterticket fahren.', en: 'Travel with the semester ticket.' }] },
      { de: 'die Vorlesungszeit', en: 'lecture period', hint: 'When classes are', examples: [{ de: 'In der Vorlesungszeit.', en: 'During the lecture period.' }] },
      { de: 'die vorlesungsfreie Zeit', en: 'semester break', hint: 'No classes', examples: [{ de: 'In der vorlesungsfreien Zeit arbeiten.', en: 'Work during the break.' }] },
      { de: 'das Auslandssemester', en: 'semester abroad', hint: 'Study in another country', examples: [{ de: 'Ein Auslandssemester in Spanien.', en: 'A semester abroad in Spain.' }] },
      { de: 'die Sprachkenntnisse', en: 'language skills', hint: 'Languages', examples: [{ de: 'Seine Sprachkenntnisse verbessern.', en: 'Improve his language skills.' }] },
      { de: 'der Sprachkurs', en: 'language course', hint: 'Learn language', examples: [{ de: 'Einen Sprachkurs besuchen.', en: 'Attend a language course.' }] },
      { de: 'das Sprachniveau', en: 'language level', hint: 'A1, A2, etc.', examples: [{ de: 'Das Sprachniveau B1.', en: 'Language level B1.' }] },
      { de: 'die Sprachprüfung', en: 'language exam', hint: 'Test of language', examples: [{ de: 'Die Sprachprüfung bestehen.', en: 'Pass the language exam.' }] },
      { de: 'das Zertifikat', en: 'certificate', hint: 'Official document', examples: [{ de: 'Ein Zertifikat erhalten.', en: 'Receive a certificate.' }] },
      { de: 'der Kurs', en: 'course', hint: 'Class', examples: [{ de: 'Einen Kurs belegen.', en: 'Take a course.' }] },
      { de: 'der Workshop', en: 'workshop', hint: 'Hands-on class', examples: [{ de: 'An einem Workshop teilnehmen.', en: 'Participate in a workshop.' }] },

      // Society & Citizenship (70)
      { de: 'die Gesellschaft', en: 'society', hint: 'People in community', examples: [{ de: 'In unserer Gesellschaft.', en: 'In our society.' }] },
      { de: 'der Staat', en: 'state', hint: 'Country/government', examples: [{ de: 'Der Staat sorgt für Ordnung.', en: 'The state ensures order.' }] },
      { de: 'die Regierung', en: 'government', hint: 'Leaders', examples: [{ de: 'Die Regierung beschließt Gesetze.', en: 'The government passes laws.' }] },
      { de: 'die Politik', en: 'politics', hint: 'Political affairs', examples: [{ de: 'Sich für Politik interessieren.', en: 'Be interested in politics.' }] },
      { de: 'der Politiker', en: 'politician', hint: 'Person in politics', examples: [{ de: 'Die Politiker diskutieren.', en: 'The politicians discuss.' }] },
      { de: 'die Politikerin', en: 'politician (female)', hint: 'Woman in politics', examples: [{ de: 'Eine engagierte Politikerin.', en: 'A committed politician.' }] },
      { de: 'die Partei', en: 'political party', hint: 'Group in politics', examples: [{ de: 'Welche Partei wählst du?', en: 'Which party do you vote for?' }] },
      { de: 'die Wahl', en: 'election', hint: 'Voting', examples: [{ de: 'Zur Wahl gehen.', en: 'Go to the elections.' }] },
      { de: 'wählen', en: 'to vote', hint: 'Choose in election', examples: [{ de: 'Den Kanzler wählen.', en: 'Elect the chancellor.' }] },
      { de: 'der Wähler', en: 'voter', hint: 'Person voting', examples: [{ de: 'Die Wähler entscheiden.', en: 'The voters decide.' }] },
      { de: 'die Stimme', en: 'vote', hint: 'One vote', examples: [{ de: 'Seine Stimme abgeben.', en: 'Cast his vote.' }] },
      { de: 'das Gesetz', en: 'law', hint: 'Rule', examples: [{ de: 'Ein Gesetz verabschieden.', en: 'Pass a law.' }] },
      { de: 'die Verfassung', en: 'constitution', hint: 'Basic law', examples: [{ de: 'Die deutsche Verfassung.', en: 'The German constitution.' }] },
      { de: 'das Grundgesetz', en: 'Basic Law', hint: 'German constitution', examples: [{ de: 'Im Grundgesetz stehen die Grundrechte.', en: 'The basic rights are in the Basic Law.' }] },
      { de: 'das Recht', en: 'right', hint: 'Legal entitlement', examples: [{ de: 'Das Recht auf freie Meinungsäußerung.', en: 'The right to free speech.' }] },
      { de: 'die Pflicht', en: 'duty', hint: 'Obligation', examples: [{ de: 'Schulpflicht in Deutschland.', en: 'Compulsory education in Germany.' }] },
      { de: 'die Freiheit', en: 'freedom', hint: 'Liberty', examples: [{ de: 'Freiheit ist ein hohes Gut.', en: 'Freedom is a high good.' }] },
      { de: 'die Meinungsfreiheit', en: 'freedom of speech', hint: 'Say what you think', examples: [{ de: 'Die Meinungsfreiheit ist ein Grundrecht.', en: 'Freedom of speech is a basic right.' }] },
      { de: 'die Pressefreiheit', en: 'press freedom', hint: 'Media free', examples: [{ de: 'Für die Pressefreiheit kämpfen.', en: 'Fight for press freedom.' }] },
      { de: 'die Demokratie', en: 'democracy', hint: 'Rule by people', examples: [{ de: 'In einer Demokratie leben.', en: 'Live in a democracy.' }] },
      { de: 'die Diktatur', en: 'dictatorship', hint: 'Rule by one', examples: [{ de: 'Gegen die Diktatur protestieren.', en: 'Protest against the dictatorship.' }] },
      { de: 'der Bürger', en: 'citizen', hint: 'Member of state', examples: [{ de: 'Die Bürger haben Rechte.', en: 'Citizens have rights.' }] },
      { de: 'die Bürgerin', en: 'citizen (female)', hint: 'Female citizen', examples: [{ de: 'Jede Bürgerin darf wählen.', en: 'Every female citizen may vote.' }] },
      { de: 'die Staatsbürgerschaft', en: 'citizenship', hint: 'Nationality', examples: [{ de: 'Die deutsche Staatsbürgerschaft beantragen.', en: 'Apply for German citizenship.' }] },
      { de: 'der Pass', en: 'passport', hint: 'Travel document', examples: [{ de: 'Einen deutschen Pass haben.', en: 'Have a German passport.' }] },
      { de: 'der Ausweis', en: 'ID card', hint: 'Identification', examples: [{ de: 'Den Ausweis vorzeigen.', en: 'Show the ID.' }] },
      { de: 'das Asyl', en: 'asylum', hint: 'Protection', examples: [{ de: 'Asyl beantragen.', en: 'Apply for asylum.' }] },
      { de: 'der Flüchtling', en: 'refugee', hint: 'Person fleeing', examples: [{ de: 'Den Flüchtlingen helfen.', en: 'Help refugees.' }] },
      { de: 'die Migration', en: 'migration', hint: 'Moving countries', examples: [{ de: 'Migration ist ein globales Phänomen.', en: 'Migration is a global phenomenon.' }] },
      { de: 'der Migrationshintergrund', en: 'migration background', hint: 'Family from elsewhere', examples: [{ de: 'Viele haben Migrationshintergrund.', en: 'Many have a migration background.' }] },
      { de: 'die Integration', en: 'integration', hint: 'Fitting in', examples: [{ de: 'Integration in die Gesellschaft.', en: 'Integration into society.' }] },
      { de: 'sich integrieren', en: 'to integrate', hint: 'Become part of', examples: [{ de: 'Sich in die Gesellschaft integrieren.', en: 'Integrate into society.' }] },
      { de: 'die Kultur', en: 'culture', hint: 'Customs, arts', examples: [{ de: 'Die deutsche Kultur kennenlernen.', en: 'Get to know German culture.' }] },
      { de: 'die Tradition', en: 'tradition', hint: 'Custom', examples: [{ de: 'Traditionen pflegen.', en: 'Maintain traditions.' }] },
      { de: 'der Brauch', en: 'custom', hint: 'Traditional practice', examples: [{ de: 'Ein alter Brauch.', en: 'An old custom.' }] },
      { de: 'das Fest', en: 'festival', hint: 'Celebration', examples: [{ de: 'Das Oktoberfest.', en: 'The Oktoberfest.' }] },
      { de: 'der Feiertag', en: 'public holiday', hint: 'Day off', examples: [{ de: 'Weihnachten ist ein Feiertag.', en: 'Christmas is a public holiday.' }] },
      { de: 'die Religion', en: 'religion', hint: 'Faith', examples: [{ de: 'Die Freiheit der Religion.', en: 'Freedom of religion.' }] },
      { de: 'der Glaube', en: 'belief', hint: 'Faith', examples: [{ de: 'Der christliche Glaube.', en: 'The Christian faith.' }] },
      { de: 'die Kirche', en: 'church', hint: 'Place of worship', examples: [{ de: 'In die Kirche gehen.', en: 'Go to church.' }] },
      { de: 'die Moschee', en: 'mosque', hint: 'Muslim worship', examples: [{ de: 'In die Moschee gehen.', en: 'Go to the mosque.' }] },
      { de: 'die Synagoge', en: 'synagogue', hint: 'Jewish worship', examples: [{ de: 'Die Synagoge besuchen.', en: 'Visit the synagogue.' }] },
      { de: 'der Atheist', en: 'atheist', hint: 'No belief in God', examples: [{ de: 'Er ist Atheist.', en: 'He is an atheist.' }] },
      { de: 'die Toleranz', en: 'tolerance', hint: 'Acceptance', examples: [{ de: 'Toleranz gegenüber anderen.', en: 'Tolerance towards others.' }] },
      { de: 'der Respekt', en: 'respect', hint: 'Esteem', examples: [{ de: 'Respekt vor dem Anderen.', en: 'Respect for others.' }] },
      { de: 'die Diskriminierung', en: 'discrimination', hint: 'Unfair treatment', examples: [{ de: 'Gegen Diskriminierung kämpfen.', en: 'Fight against discrimination.' }] },
      { de: 'die Gleichberechtigung', en: 'equal rights', hint: 'Equality', examples: [{ de: 'Für Gleichberechtigung von Mann und Frau.', en: 'For equal rights of men and women.' }] },
      { de: 'die Gleichstellung', en: 'equal treatment', hint: 'Equality', examples: [{ de: 'Die Gleichstellung fördern.', en: 'Promote equality.' }] },
      { de: 'die Inklusion', en: 'inclusion', hint: 'Including all', examples: [{ de: 'Inklusion in der Schule.', en: 'Inclusion in school.' }] },
      { de: 'die Armut', en: 'poverty', hint: 'Being poor', examples: [{ de: 'In Armut leben.', en: 'Live in poverty.' }] },
      { de: 'der Reichtum', en: 'wealth', hint: 'Being rich', examples: [{ de: 'Großer Reichtum.', en: 'Great wealth.' }] },
      { de: 'die soziale Gerechtigkeit', en: 'social justice', hint: 'Fairness', examples: [{ de: 'Für soziale Gerechtigkeit kämpfen.', en: 'Fight for social justice.' }] },
      { de: 'das Sozialsystem', en: 'social system', hint: 'Welfare', examples: [{ de: 'Das deutsche Sozialsystem.', en: 'The German social system.' }] },
      { de: 'die Rente', en: 'pension', hint: 'Retirement pay', examples: [{ de: 'In die Rente gehen.', en: 'Go into retirement.' }] },
      { de: 'die Arbeitslosenhilfe', en: 'unemployment assistance', hint: 'Money for jobless', examples: [{ de: 'Arbeitslosenhilfe beziehen.', en: 'Receive unemployment assistance.' }] },
      { de: 'das Kindergeld', en: 'child benefit', hint: 'Money for children', examples: [{ de: 'Kindergeld beantragen.', en: 'Apply for child benefit.' }] },
      { de: 'das Elterngeld', en: 'parental allowance', hint: 'Money for parents', examples: [{ de: 'Elterngeld erhalten.', en: 'Receive parental allowance.' }] },
      { de: 'die Krankenkasse', en: 'health insurance', hint: 'Insurance', examples: [{ de: 'Bei der Krankenkasse versichert.', en: 'Insured with the health insurance.' }] },
      { de: 'die Pflegeversicherung', en: 'long-term care insurance', hint: 'For elderly care', examples: [{ de: 'Pflegeversicherung zahlen.', en: 'Pay for care insurance.' }] },
      { de: 'die Arbeitslosenversicherung', en: 'unemployment insurance', hint: 'Insurance for job loss', examples: [{ de: 'In die Arbeitslosenversicherung einzahlen.', en: 'Pay into unemployment insurance.' }] },
      { de: 'die Gewerkschaft', en: 'union', hint: 'Worker organization', examples: [{ de: 'Der Gewerkschaft beitreten.', en: 'Join the union.' }] },
      { de: 'der Streik', en: 'strike', hint: 'Work stoppage', examples: [{ de: 'Für bessere Bedingungen streiken.', en: 'Strike for better conditions.' }] },
      { de: 'die Demonstration', en: 'demonstration', hint: 'Public protest', examples: [{ de: 'An einer Demo teilnehmen.', en: 'Participate in a demo.' }] },
      { de: 'demonstrieren', en: 'to demonstrate', hint: 'Protest publicly', examples: [{ de: 'Für Frieden demonstrieren.', en: 'Demonstrate for peace.' }] },
      { de: 'die Bürgerinitiative', en: 'citizens\' initiative', hint: 'Local group', examples: [{ de: 'Eine Bürgerinitiative gründen.', en: 'Found a citizens\' initiative.' }] },
      { de: 'das Ehrenamt', en: 'volunteer work', hint: 'Unpaid work', examples: [{ de: 'Sich ehrenamtlich engagieren.', en: 'Do volunteer work.' }] },
      { de: 'der Verein', en: 'club', hint: 'Organization', examples: [{ de: 'In einem Verein Mitglied sein.', en: 'Be a member of a club.' }] },
      { de: 'die Spende', en: 'donation', hint: 'Gift to charity', examples: [{ de: 'Eine Spende geben.', en: 'Give a donation.' }] },
      { de: 'spenden', en: 'to donate', hint: 'Give money/goods', examples: [{ de: 'Für einen guten Zweck spenden.', en: 'Donate for a good cause.' }] },
      { de: 'die Stiftung', en: 'foundation', hint: 'Charitable organization', examples: [{ de: 'Eine Stiftung gründen.', en: 'Found a foundation.' }] },

      // Media & Communication (70)
      { de: 'die Medien', en: 'media', hint: 'TV, press, internet', examples: [{ de: 'In den Medien wird berichtet.', en: 'It is reported in the media.' }] },
      { de: 'die Nachrichten', en: 'news', hint: 'Current events', examples: [{ de: 'Die Nachrichten um 20 Uhr.', en: 'The news at 8 p.m.' }] },
      { de: 'die Zeitung', en: 'newspaper', hint: 'Daily paper', examples: [{ de: 'Eine Zeitung abonnieren.', en: 'Subscribe to a newspaper.' }] },
      { de: 'die Tageszeitung', en: 'daily newspaper', hint: 'Paper daily', examples: [{ de: 'Die lokale Tageszeitung.', en: 'The local daily newspaper.' }] },
      { de: 'die Zeitschrift', en: 'magazine', hint: 'Periodical', examples: [{ de: 'Eine Zeitschrift lesen.', en: 'Read a magazine.' }] },
      { de: 'das Magazin', en: 'magazine', hint: 'Glossy periodical', examples: [{ de: 'Ein politisches Magazin.', en: 'A political magazine.' }] },
      { de: 'der Artikel', en: 'article', hint: 'Written piece', examples: [{ de: 'Einen Artikel verfassen.', en: 'Write an article.' }] },
      { de: 'der Journalist', en: 'journalist', hint: 'News reporter', examples: [{ de: 'Der Journalist recherchiert.', en: 'The journalist researches.' }] },
      { de: 'die Journalistin', en: 'journalist (female)', hint: 'News reporter', examples: [{ de: 'Eine investigative Journalistin.', en: 'An investigative journalist.' }] },
      { de: 'die Presse', en: 'press', hint: 'Newspapers/journalists', examples: [{ de: 'Die Pressefreiheit.', en: 'Press freedom.' }] },
      { de: 'die Pressekonferenz', en: 'press conference', hint: 'Media event', examples: [{ de: 'Eine Pressekonferenz geben.', en: 'Give a press conference.' }] },
      { de: 'die Schlagzeile', en: 'headline', hint: 'Title of news', examples: [{ de: 'Die Schlagzeilen heute.', en: 'Today\'s headlines.' }] },
      { de: 'die Quelle', en: 'source', hint: 'Origin of info', examples: [{ de: 'Die Quelle angeben.', en: 'Cite the source.' }] },
      { de: 'glaubwürdig', en: 'credible', hint: 'Trustworthy', examples: [{ de: 'Eine glaubwürdige Quelle.', en: 'A credible source.' }] },
      { de: 'die Information', en: 'information', hint: 'Data', examples: [{ de: 'Informationen sammeln.', en: 'Gather information.' }] },
      { de: 'informieren', en: 'to inform', hint: 'Give info', examples: [{ de: 'Sich informieren über.', en: 'Inform oneself about.' }] },
      { de: 'berichten', en: 'to report', hint: 'Tell news', examples: [{ de: 'Über ein Ereignis berichten.', en: 'Report on an event.' }] },
      { de: 'der Bericht', en: 'report', hint: 'News story', examples: [{ de: 'Ein ausführlicher Bericht.', en: 'A detailed report.' }] },
      { de: 'die Meldung', en: 'message/report', hint: 'Short news', examples: [{ de: 'Eine wichtige Meldung.', en: 'An important message.' }] },
      { de: 'die Schlagzeile', en: 'headline', hint: 'Title', examples: [{ de: 'Die Schlagzeile auf der Titelseite.', en: 'The headline on the front page.' }] },
      { de: 'die Titelseite', en: 'front page', hint: 'First page', examples: [{ de: 'Auf der Titelseite erscheinen.', en: 'Appear on the front page.' }] },
      { de: 'der Leitartikel', en: 'editorial', hint: 'Opinion piece', examples: [{ de: 'Der Leitartikel in der Zeitung.', en: 'The editorial in the newspaper.' }] },
      { de: 'das Interview', en: 'interview', hint: 'Q&A', examples: [{ de: 'Ein Interview mit dem Kanzler.', en: 'An interview with the chancellor.' }] },
      { de: 'interviewen', en: 'to interview', hint: 'Ask questions', examples: [{ de: 'Den Star interviewen.', en: 'Interview the star.' }] },
      { de: 'die Umfrage', en: 'survey', hint: 'Ask people', examples: [{ de: 'Eine Umfrage durchführen.', en: 'Conduct a survey.' }] },
      { de: 'das Fernsehen', en: 'television', hint: 'TV', examples: [{ de: 'Im Fernsehen läuft ein Film.', en: 'A movie is on TV.' }] },
      { de: 'der Fernsehsender', en: 'TV channel', hint: 'Station', examples: [{ de: 'Auf welchem Sender?', en: 'On which channel?' }] },
      { de: 'das Programm', en: 'program', hint: 'Schedule', examples: [{ de: 'Das Fernsehprogramm.', en: 'The TV program.' }] },
      { de: 'die Sendung', en: 'broadcast', hint: 'Show', examples: [{ de: 'Eine interessante Sendung.', en: 'An interesting show.' }] },
      { de: 'die Serie', en: 'series', hint: 'TV show', examples: [{ de: 'Eine spannende Serie.', en: 'An exciting series.' }] },
      { de: 'die Dokumentation', en: 'documentary', hint: 'Factual film', examples: [{ de: 'Eine Dokumentation über Tiere.', en: 'A documentary about animals.' }] },
      { de: 'die Talkshow', en: 'talk show', hint: 'Chat show', examples: [{ de: 'In einer Talkshow auftreten.', en: 'Appear on a talk show.' }] },
      { de: 'die Reality-Show', en: 'reality show', hint: 'Unscripted TV', examples: [{ de: 'Reality-Shows sind beliebt.', en: 'Reality shows are popular.' }] },
      { de: 'die Werbung', en: 'advertisement', hint: 'Commercials', examples: [{ de: 'Werbung im Fernsehen.', en: 'TV commercials.' }] },
      { de: 'die Werbepause', en: 'commercial break', hint: 'Pause for ads', examples: [{ de: 'In der Werbepause.', en: 'During the commercial break.' }] },
      { de: 'das Radio', en: 'radio', hint: 'Audio broadcast', examples: [{ de: 'Radio hören.', en: 'Listen to the radio.' }] },
      { de: 'der Radiosender', en: 'radio station', hint: 'Channel', examples: [{ de: 'Welchen Radiosender hörst du?', en: 'Which radio station do you listen to?' }] },
      { de: 'der Podcast', en: 'podcast', hint: 'Digital audio', examples: [{ de: 'Einen Podcast abonnieren.', en: 'Subscribe to a podcast.' }] },
      { de: 'das Internet', en: 'internet', hint: 'World Wide Web', examples: [{ de: 'Im Internet surfen.', en: 'Surf the internet.' }] },
      { de: 'das World Wide Web', en: 'World Wide Web', hint: 'WWW', examples: [{ de: 'Im World Wide Web.', en: 'In the World Wide Web.' }] },
      { de: 'die Webseite', en: 'website', hint: 'Site', examples: [{ de: 'Die Webseite besuchen.', en: 'Visit the website.' }] },
      { de: 'die Homepage', en: 'homepage', hint: 'Main page', examples: [{ de: 'Auf der Homepage finden Sie Infos.', en: 'On the homepage you find info.' }] },
      { de: 'der Link', en: 'link', hint: 'Hyperlink', examples: [{ de: 'Auf den Link klicken.', en: 'Click on the link.' }] },
      { de: 'klicken', en: 'to click', hint: 'Press mouse button', examples: [{ de: 'Hier klicken.', en: 'Click here.' }] },
      { de: 'die Suchmaschine', en: 'search engine', hint: 'Google etc.', examples: [{ de: 'In der Suchmaschine suchen.', en: 'Search in the search engine.' }] },
      { de: 'googeln', en: 'to google', hint: 'Search online', examples: [{ de: 'Einfach googeln.', en: 'Just google it.' }] },
      { de: 'das soziale Netzwerk', en: 'social network', hint: 'Facebook etc.', examples: [{ de: 'In sozialen Netzwerken aktiv.', en: 'Active on social networks.' }] },
      { de: 'Facebook', en: 'Facebook', hint: 'Social media', examples: [{ de: 'Auf Facebook posten.', en: 'Post on Facebook.' }] },
      { de: 'Instagram', en: 'Instagram', hint: 'Photo app', examples: [{ de: 'Fotos auf Instagram teilen.', en: 'Share photos on Instagram.' }] },
      { de: 'Twitter', en: 'Twitter', hint: 'Microblogging', examples: [{ de: 'Auf Twitter folgen.', en: 'Follow on Twitter.' }] },
      { de: 'der Beitrag', en: 'post', hint: 'Social media post', examples: [{ de: 'Einen Beitrag teilen.', en: 'Share a post.' }] },
      { de: 'der Like', en: 'like', hint: 'Positive reaction', examples: [{ de: 'Viele Likes bekommen.', en: 'Get many likes.' }] },
      { de: 'liken', en: 'to like', hint: 'Press like', examples: [{ de: 'Ich like dein Foto.', en: 'I like your photo.' }] },
      { de: 'kommentieren', en: 'to comment', hint: 'Leave comment', examples: [{ de: 'Den Beitrag kommentieren.', en: 'Comment on the post.' }] },
      { de: 'der Kommentar', en: 'comment', hint: 'Response', examples: [{ de: 'Einen Kommentar hinterlassen.', en: 'Leave a comment.' }] },
      { de: 'der Influencer', en: 'influencer', hint: 'Social media star', examples: [{ de: 'Ein bekannter Influencer.', en: 'A famous influencer.' }] },
      { de: 'die Influencerin', en: 'influencer (female)', hint: 'Social media star', examples: [{ de: 'Die Influencerin wirbt für Produkte.', en: 'The influencer advertises products.' }] },
      { de: 'der Algorithmus', en: 'algorithm', hint: 'Computer process', examples: [{ de: 'Der Algorithmus entscheidet.', en: 'The algorithm decides.' }] },
      { de: 'die Filterblase', en: 'filter bubble', hint: 'Echo chamber', examples: [{ de: 'In der Filterblase stecken.', en: 'Stuck in the filter bubble.' }] },
      { de: 'die Fake News', en: 'fake news', hint: 'False info', examples: [{ de: 'Fake News erkennen.', en: 'Recognize fake news.' }] },
      { de: 'die Verschwörungstheorie', en: 'conspiracy theory', hint: 'Secret plot idea', examples: [{ de: 'An Verschwörungstheorien glauben.', en: 'Believe in conspiracy theories.' }] },
      { de: 'der Datenschutz', en: 'data protection', hint: 'Privacy', examples: [{ de: 'Datenschutz ist wichtig.', en: 'Data protection is important.' }] },
      { de: 'die Privatsphäre', en: 'privacy', hint: 'Private life', examples: [{ de: 'Die Privatsphäre schützen.', en: 'Protect privacy.' }] },
      { de: 'die Überwachung', en: 'surveillance', hint: 'Watching', examples: [{ de: 'Überwachung durch Kameras.', en: 'Surveillance by cameras.' }] },
      { de: 'die Zensur', en: 'censorship', hint: 'Suppressing info', examples: [{ de: 'Gegen die Zensur.', en: 'Against censorship.' }] },
      { de: 'die Meinungsfreiheit', en: 'freedom of speech', hint: 'Say what you want', examples: [{ de: 'Für Meinungsfreiheit eintreten.', en: 'Advocate for freedom of speech.' }] },
      { de: 'die Pressefreiheit', en: 'press freedom', hint: 'Free media', examples: [{ de: 'Die Pressefreiheit verteidigen.', en: 'Defend press freedom.' }] },
      { de: 'der Journalismus', en: 'journalism', hint: 'Profession', examples: [{ de: 'Qualitätsjournalismus.', en: 'Quality journalism.' }] },
      { de: 'die Medienkompetenz', en: 'media literacy', hint: 'Understanding media', examples: [{ de: 'Medienkompetenz fördern.', en: 'Promote media literacy.' }] },

      // Environment & Nature (70)
      { de: 'die Umwelt', en: 'environment', hint: 'Nature around us', examples: [{ de: 'Die Umwelt schützen.', en: 'Protect the environment.' }] },
      { de: 'der Umweltschutz', en: 'environmental protection', hint: 'Saving nature', examples: [{ de: 'Sich für Umweltschutz einsetzen.', en: 'Commit to environmental protection.' }] },
      { de: 'die Umweltverschmutzung', en: 'pollution', hint: 'Dirtying nature', examples: [{ de: 'Die Umweltverschmutzung ist ein Problem.', en: 'Pollution is a problem.' }] },
      { de: 'die Luftverschmutzung', en: 'air pollution', hint: 'Dirty air', examples: [{ de: 'Luftverschmutzung in Städten.', en: 'Air pollution in cities.' }] },
      { de: 'die Wasserverschmutzung', en: 'water pollution', hint: 'Dirty water', examples: [{ de: 'Die Wasserverschmutzung bekämpfen.', en: 'Fight water pollution.' }] },
      { de: 'der Klimawandel', en: 'climate change', hint: 'Global warming', examples: [{ de: 'Der Klimawandel ist real.', en: 'Climate change is real.' }] },
      { de: 'die Erderwärmung', en: 'global warming', hint: 'Earth heating', examples: [{ de: 'Die Erderwärmung stoppen.', en: 'Stop global warming.' }] },
      { de: 'der Treibhauseffekt', en: 'greenhouse effect', hint: 'Warming gases', examples: [{ de: 'Der Treibhauseffekt verstärkt sich.', en: 'The greenhouse effect is intensifying.' }] },
      { de: 'das Treibhausgas', en: 'greenhouse gas', hint: 'CO2, methane', examples: [{ de: 'Treibhausgase reduzieren.', en: 'Reduce greenhouse gases.' }] },
      { de: 'das CO2', en: 'CO2', hint: 'Carbon dioxide', examples: [{ de: 'CO2-Ausstoß verringern.', en: 'Reduce CO2 emissions.' }] },
      { de: 'der CO2-Fußabdruck', en: 'carbon footprint', hint: 'Your CO2 impact', examples: [{ de: 'Den CO2-Fußabdruck verkleinern.', en: 'Reduce the carbon footprint.' }] },
      { de: 'die erneuerbare Energie', en: 'renewable energy', hint: 'Solar, wind', examples: [{ de: 'Auf erneuerbare Energien umsteigen.', en: 'Switch to renewable energy.' }] },
      { de: 'die Solarenergie', en: 'solar energy', hint: 'From sun', examples: [{ de: 'Solarenergie nutzen.', en: 'Use solar energy.' }] },
      { de: 'die Windenergie', en: 'wind energy', hint: 'From wind', examples: [{ de: 'Windenergie ist sauber.', en: 'Wind energy is clean.' }] },
      { de: 'die Wasserkraft', en: 'hydropower', hint: 'From water', examples: [{ de: 'Wasserkraftwerke.', en: 'Hydroelectric power plants.' }] },
      { de: 'die Biomasse', en: 'biomass', hint: 'Organic material', examples: [{ de: 'Biomasse als Energiequelle.', en: 'Biomass as an energy source.' }] },
      { de: 'die Atomenergie', en: 'nuclear energy', hint: 'Atomic power', examples: [{ de: 'Atomenergie ist umstritten.', en: 'Nuclear energy is controversial.' }] },
      { de: 'der Atomausstieg', en: 'nuclear phase-out', hint: 'Stop nuclear', examples: [{ de: 'Der Atomausstieg in Deutschland.', en: 'The nuclear phase-out in Germany.' }] },
      { de: 'die Energiewende', en: 'energy transition', hint: 'Change to renewable', examples: [{ de: 'Die Energiewende schaffen.', en: 'Achieve the energy transition.' }] },
      { de: 'der Klimaschutz', en: 'climate protection', hint: 'Protect climate', examples: [{ de: 'Maßnahmen für den Klimaschutz.', en: 'Measures for climate protection.' }] },
      { de: 'das Klimaabkommen', en: 'climate agreement', hint: 'International pact', examples: [{ de: 'Das Pariser Klimaabkommen.', en: 'The Paris climate agreement.' }] },
      { de: 'die Klimakonferenz', en: 'climate conference', hint: 'Meeting on climate', examples: [{ de: 'Auf der Klimakonferenz diskutieren.', en: 'Discuss at the climate conference.' }] },
      { de: 'der Klimaaktivist', en: 'climate activist', hint: 'Fights for climate', examples: [{ de: 'Die Klimaaktivisten protestieren.', en: 'The climate activists protest.' }] },
      { de: 'die Klimabewegung', en: 'climate movement', hint: 'Group action', examples: [{ de: 'Fridays for Future.', en: 'Fridays for Future.' }] },
      { de: 'der Klimastreik', en: 'climate strike', hint: 'Protest for climate', examples: [{ de: 'Am Klimastreik teilnehmen.', en: 'Participate in the climate strike.' }] },
      { de: 'die Nachhaltigkeit', en: 'sustainability', hint: 'Long-term care', examples: [{ de: 'Nachhaltigkeit ist wichtig.', en: 'Sustainability is important.' }] },
      { de: 'nachhaltig', en: 'sustainable', hint: 'Eco-friendly', examples: [{ de: 'Nachhaltig produzieren.', en: 'Produce sustainably.' }] },
      { de: 'der ökologische Fußabdruck', en: 'ecological footprint', hint: 'Impact on earth', examples: [{ de: 'Den ökologischen Fußabdruck verringern.', en: 'Reduce the ecological footprint.' }] },
      { de: 'die Biodiversität', en: 'biodiversity', hint: 'Variety of life', examples: [{ de: 'Die Biodiversität erhalten.', en: 'Preserve biodiversity.' }] },
      { de: 'das Ökosystem', en: 'ecosystem', hint: 'System of nature', examples: [{ de: 'Das fragile Ökosystem.', en: 'The fragile ecosystem.' }] },
      { de: 'der Lebensraum', en: 'habitat', hint: 'Living space', examples: [{ de: 'Der Lebensraum der Tiere.', en: 'The habitat of animals.' }] },
      { de: 'der Artenschutz', en: 'species protection', hint: 'Save species', examples: [{ de: 'Artenschutz ist wichtig.', en: 'Species protection is important.' }] },
      { de: 'das Aussterben', en: 'extinction', hint: 'No more left', examples: [{ de: 'Vom Aussterben bedroht.', en: 'Threatened with extinction.' }] },
      { de: 'bedrohte Arten', en: 'endangered species', hint: 'At risk', examples: [{ de: 'Rote Liste bedrohter Arten.', en: 'Red list of endangered species.' }] },
      { de: 'der Regenwald', en: 'rainforest', hint: 'Tropical forest', examples: [{ de: 'Der Regenwald wird abgeholzt.', en: 'The rainforest is being deforested.' }] },
      { de: 'die Abholzung', en: 'deforestation', hint: 'Cutting trees', examples: [{ de: 'Die Abholzung stoppen.', en: 'Stop deforestation.' }] },
      { de: 'der Wald', en: 'forest', hint: 'Woods', examples: [{ de: 'Der Wald stirbt.', en: 'The forest is dying.' }] },
      { de: 'das Waldsterben', en: 'forest dieback', hint: 'Forests dying', examples: [{ de: 'Das Waldsterben durch sauren Regen.', en: 'Forest dieback from acid rain.' }] },
      { de: 'die Luft', en: 'air', hint: 'We breathe', examples: [{ de: 'Saubere Luft ist wichtig.', en: 'Clean air is important.' }] },
      { de: 'das Wasser', en: 'water', hint: 'Liquid', examples: [{ de: 'Wasser sparen.', en: 'Save water.' }] },
      { de: 'das Grundwasser', en: 'groundwater', hint: 'Water underground', examples: [{ de: 'Das Grundwasser ist verschmutzt.', en: 'The groundwater is polluted.' }] },
      { de: 'der Müll', en: 'trash', hint: 'Waste', examples: [{ de: 'Müll trennen.', en: 'Separate trash.' }] },
      { de: 'der Plastikmüll', en: 'plastic waste', hint: 'Plastic trash', examples: [{ de: 'Plastikmüll im Meer.', en: 'Plastic waste in the ocean.' }] },
      { de: 'die Mülltrennung', en: 'waste separation', hint: 'Sorting trash', examples: [{ de: 'Mülltrennung ist Pflicht.', en: 'Waste separation is mandatory.' }] },
      { de: 'das Recycling', en: 'recycling', hint: 'Reusing materials', examples: [{ de: 'Recycling von Papier.', en: 'Recycling of paper.' }] },
      { de: 'recyceln', en: 'to recycle', hint: 'Reuse', examples: [{ de: 'Plastik recyceln.', en: 'Recycle plastic.' }] },
      { de: 'der Biomüll', en: 'organic waste', hint: 'Food scraps', examples: [{ de: 'Biomüll in die braune Tonne.', en: 'Organic waste in the brown bin.' }] },
      { de: 'der gelbe Sack', en: 'yellow bag', hint: 'For packaging', examples: [{ de: 'Plastik in den gelben Sack.', en: 'Plastic in the yellow bag.' }] },
      { de: 'das Altglas', en: 'waste glass', hint: 'Used glass', examples: [{ de: 'Altglas in den Container.', en: 'Waste glass in the container.' }] },
      { de: 'das Altpapier', en: 'waste paper', hint: 'Used paper', examples: [{ de: 'Altpapier sammeln.', en: 'Collect waste paper.' }] },
      { de: 'die Kreislaufwirtschaft', en: 'circular economy', hint: 'Reuse economy', examples: [{ de: 'Kreislaufwirtschaft fördern.', en: 'Promote circular economy.' }] },
      { de: 'die Wegwerfgesellschaft', en: 'throwaway society', hint: 'Use once, discard', examples: [{ de: 'Die Wegwerfgesellschaft kritisieren.', en: 'Criticize the throwaway society.' }] },
      { de: 'der Konsum', en: 'consumption', hint: 'Buying goods', examples: [{ de: 'Bewusster Konsum.', en: 'Conscious consumption.' }] },
      { de: 'der Konsument', en: 'consumer', hint: 'Buyer', examples: [{ de: 'Die Macht der Konsumenten.', en: 'The power of consumers.' }] },
      { de: 'die Verpackung', en: 'packaging', hint: 'Wrapper', examples: [{ de: 'Verpackung vermeiden.', en: 'Avoid packaging.' }] },
      { de: 'unverpackt', en: 'unpackaged', hint: 'No packaging', examples: [{ de: 'Unverpackt einkaufen.', en: 'Shop unpackaged.' }] },
      { de: 'die Mehrwegflasche', en: 'refillable bottle', hint: 'Returnable', examples: [{ de: 'Mehrwegflaschen sind besser.', en: 'Refillable bottles are better.' }] },
      { de: 'die Einwegflasche', en: 'disposable bottle', hint: 'Throw away', examples: [{ de: 'Einwegflaschen vermeiden.', en: 'Avoid disposable bottles.' }] },
      { de: 'der ökologische Landbau', en: 'organic farming', hint: 'Eco farming', examples: [{ de: 'Produkte aus ökologischem Landbau.', en: 'Products from organic farming.' }] },
      { de: 'das Bio-Siegel', en: 'organic seal', hint: 'Certification', examples: [{ de: 'Auf das Bio-Siegel achten.', en: 'Look for the organic seal.' }] },
      { de: 'der faire Handel', en: 'fair trade', hint: 'Fair conditions', examples: [{ de: 'Fair gehandelte Produkte kaufen.', en: 'Buy fair trade products.' }] },
      { de: 'das Fairtrade-Siegel', en: 'Fairtrade seal', hint: 'Certification', examples: [{ de: 'Mit Fairtrade-Siegel.', en: 'With Fairtrade seal.' }] },
      { de: 'die Tierhaltung', en: 'animal husbandry', hint: 'Keeping animals', examples: [{ de: 'Artgerechte Tierhaltung.', en: 'Humane animal husbandry.' }] },
      { de: 'die Massentierhaltung', en: 'factory farming', hint: 'Intensive farming', examples: [{ de: 'Gegen Massentierhaltung.', en: 'Against factory farming.' }] },
      { de: 'das Tierwohl', en: 'animal welfare', hint: 'Well-being of animals', examples: [{ de: 'Für mehr Tierwohl.', en: 'For more animal welfare.' }] },
      { de: 'der Tierschutz', en: 'animal protection', hint: 'Protecting animals', examples: [{ de: 'Sich für Tierschutz einsetzen.', en: 'Commit to animal protection.' }] },
      { de: 'der Tierschutzverein', en: 'animal welfare organization', hint: 'Group', examples: [{ de: 'Im Tierschutzverein aktiv.', en: 'Active in the animal welfare organization.' }] },
      { de: 'die Vegetarier', en: 'vegetarians', hint: 'No meat', examples: [{ de: 'Immer mehr Vegetarier.', en: 'More and more vegetarians.' }] },
      { de: 'die Veganer', en: 'vegans', hint: 'No animal products', examples: [{ de: 'Vegane Ernährung.', en: 'Vegan diet.' }] },
      { de: 'das Elektroauto', en: 'electric car', hint: 'EV', examples: [{ de: 'Auf Elektroautos umsteigen.', en: 'Switch to electric cars.' }] },
      { de: 'die Elektromobilität', en: 'electric mobility', hint: 'Electric transport', examples: [{ de: 'Elektromobilität fördern.', en: 'Promote electric mobility.' }] },
      { de: 'der öffentliche Nahverkehr', en: 'public transport', hint: 'Buses, trains', examples: [{ de: 'Den öffentlichen Nahverkehr nutzen.', en: 'Use public transport.' }] },

      // Technology & Innovation (70)
      { de: 'die Technologie', en: 'technology', hint: 'Tech', examples: [{ de: 'Neue Technologien entwickeln.', en: 'Develop new technologies.' }] },
      { de: 'die Technik', en: 'technology/engineering', hint: 'Technical aspects', examples: [{ de: 'Die Technik dahinter.', en: 'The technology behind it.' }] },
      { de: 'die Innovation', en: 'innovation', hint: 'New idea', examples: [{ de: 'Technologische Innovationen.', en: 'Technological innovations.' }] },
      { de: 'die Forschung', en: 'research', hint: 'Investigation', examples: [{ de: 'Forschung und Entwicklung.', en: 'Research and development.' }] },
      { de: 'die Entwicklung', en: 'development', hint: 'Creating new', examples: [{ de: 'Die Entwicklung neuer Produkte.', en: 'The development of new products.' }] },
      { de: 'das Labor', en: 'lab', hint: 'Laboratory', examples: [{ de: 'Im Labor experimentieren.', en: 'Experiment in the lab.' }] },
      { de: 'das Experiment', en: 'experiment', hint: 'Test', examples: [{ de: 'Ein Experiment durchführen.', en: 'Conduct an experiment.' }] },
      { de: 'der Wissenschaftler', en: 'scientist', hint: 'Researcher', examples: [{ de: 'Der Wissenschaftler forscht.', en: 'The scientist researches.' }] },
      { de: 'die Wissenschaftlerin', en: 'scientist (female)', hint: 'Researcher', examples: [{ de: 'Eine bekannte Wissenschaftlerin.', en: 'A famous scientist.' }] },
      { de: 'die Entdeckung', en: 'discovery', hint: 'Finding something', examples: [{ de: 'Eine wichtige Entdeckung.', en: 'An important discovery.' }] },
      { de: 'entdecken', en: 'to discover', hint: 'Find', examples: [{ de: 'Ein neues Element entdecken.', en: 'Discover a new element.' }] },
      { de: 'die Erfindung', en: 'invention', hint: 'Creating new', examples: [{ de: 'Die Erfindung des Computers.', en: 'The invention of the computer.' }] },
      { de: 'erfinden', en: 'to invent', hint: 'Create new', examples: [{ de: 'Wer hat das Telefon erfunden?', en: 'Who invented the telephone?' }] },
      { de: 'der Erfinder', en: 'inventor', hint: 'Creator', examples: [{ de: 'Der Erfinder des Motors.', en: 'The inventor of the engine.' }] },
      { de: 'die Erfinderin', en: 'inventor (female)', hint: 'Female creator', examples: [{ de: 'Eine geniale Erfinderin.', en: 'A brilliant inventor.' }] },
      { de: 'das Patent', en: 'patent', hint: 'Legal protection', examples: [{ de: 'Ein Patent anmelden.', en: 'Apply for a patent.' }] },
      { de: 'die Digitalisierung', en: 'digitalization', hint: 'Going digital', examples: [{ de: 'Die Digitalisierung der Gesellschaft.', en: 'The digitalization of society.' }] },
      { de: 'digital', en: 'digital', hint: 'Electronic', examples: [{ de: 'Digitale Medien.', en: 'Digital media.' }] },
      { de: 'der Computer', en: 'computer', hint: 'PC', examples: [{ de: 'Am Computer arbeiten.', en: 'Work on the computer.' }] },
      { de: 'der Laptop', en: 'laptop', hint: 'Portable', examples: [{ de: 'Den Laptop mitnehmen.', en: 'Take the laptop.' }] },
      { de: 'das Tablet', en: 'tablet', hint: 'Touch device', examples: [{ de: 'Auf dem Tablet lesen.', en: 'Read on the tablet.' }] },
      { de: 'das Smartphone', en: 'smartphone', hint: 'Phone', examples: [{ de: 'Das Smartphone nutzen.', en: 'Use the smartphone.' }] },
      { de: 'das Handy', en: 'mobile phone', hint: 'Cell phone', examples: [{ de: 'Das Handy ist leer.', en: 'The phone is dead.' }] },
      { de: 'die App', en: 'app', hint: 'Application', examples: [{ de: 'Eine App herunterladen.', en: 'Download an app.' }] },
      { de: 'die Software', en: 'software', hint: 'Programs', examples: [{ de: 'Die Software installieren.', en: 'Install the software.' }] },
      { de: 'die Hardware', en: 'hardware', hint: 'Physical parts', examples: [{ de: 'Die Hardware aufrüsten.', en: 'Upgrade the hardware.' }] },
      { de: 'das Betriebssystem', en: 'operating system', hint: 'Windows, iOS', examples: [{ de: 'Das Betriebssystem aktualisieren.', en: 'Update the operating system.' }] },
      { de: 'die Daten', en: 'data', hint: 'Information', examples: [{ de: 'Daten speichern.', en: 'Save data.' }] },
      { de: 'die Cloud', en: 'cloud', hint: 'Online storage', examples: [{ de: 'In der Cloud speichern.', en: 'Save in the cloud.' }] },
      { de: 'künstliche Intelligenz', en: 'artificial intelligence', hint: 'AI', examples: [{ de: 'Künstliche Intelligenz entwickelt sich.', en: 'Artificial intelligence is developing.' }] },
      { de: 'der Roboter', en: 'robot', hint: 'Machine', examples: [{ de: 'Roboter in der Industrie.', en: 'Robots in industry.' }] },
      { de: 'automatisiert', en: 'automated', hint: 'Automatic', examples: [{ de: 'Automatisierte Prozesse.', en: 'Automated processes.' }] },
      { de: 'die Automatisierung', en: 'automation', hint: 'Making automatic', examples: [{ de: 'Automatisierung der Produktion.', en: 'Automation of production.' }] },
      { de: 'das Internet der Dinge', en: 'Internet of Things', hint: 'IoT', examples: [{ de: 'Vernetzte Geräte.', en: 'Connected devices.' }] },
      { de: 'vernetzt', en: 'connected', hint: 'Networked', examples: [{ de: 'Vernetzte Systeme.', en: 'Connected systems.' }] },
      { de: 'das Smart Home', en: 'smart home', hint: 'Intelligent home', examples: [{ de: 'Das Smart Home steuern.', en: 'Control the smart home.' }] },
      { de: 'die virtuelle Realität', en: 'virtual reality', hint: 'VR', examples: [{ de: 'In virtuelle Realität eintauchen.', en: 'Immerse in virtual reality.' }] },
      { de: 'die erweiterte Realität', en: 'augmented reality', hint: 'AR', examples: [{ de: 'Apps mit erweiterter Realität.', en: 'Apps with augmented reality.' }] },
      { de: 'der 3D-Drucker', en: '3D printer', hint: 'Prints objects', examples: [{ de: 'Mit dem 3D-Drucker drucken.', en: 'Print with the 3D printer.' }] },
      { de: 'der Chip', en: 'chip', hint: 'Microchip', examples: [{ de: 'Der Chip im Computer.', en: 'The chip in the computer.' }] },
      { de: 'der Prozessor', en: 'processor', hint: 'CPU', examples: [{ de: 'Ein schneller Prozessor.', en: 'A fast processor.' }] },
      { de: 'der Speicher', en: 'memory', hint: 'Storage', examples: [{ de: 'Viel Speicherplatz.', en: 'Lots of storage space.' }] },
      { de: 'die Festplatte', en: 'hard drive', hint: 'Storage device', examples: [{ de: 'Die externe Festplatte.', en: 'The external hard drive.' }] },
      { de: 'der USB-Stick', en: 'USB stick', hint: 'Portable storage', examples: [{ de: 'Daten auf USB-Stick speichern.', en: 'Save data on USB stick.' }] },
      { de: 'die Schnittstelle', en: 'interface', hint: 'Connection point', examples: [{ de: 'Die Schnittstelle zwischen Geräten.', en: 'The interface between devices.' }] },
      { de: 'der Algorithmus', en: 'algorithm', hint: 'Process steps', examples: [{ de: 'Der Algorithmus berechnet.', en: 'The algorithm calculates.' }] },
      { de: 'die Blockchain', en: 'blockchain', hint: 'Distributed ledger', examples: [{ de: 'Blockchain-Technologie.', en: 'Blockchain technology.' }] },
      { de: 'die Kryptowährung', en: 'cryptocurrency', hint: 'Bitcoin etc.', examples: [{ de: 'In Kryptowährungen investieren.', en: 'Invest in cryptocurrencies.' }] },
      { de: 'Bitcoin', en: 'Bitcoin', hint: 'Cryptocurrency', examples: [{ de: 'Bitcoin kaufen.', en: 'Buy Bitcoin.' }] },
      { de: 'das Online-Banking', en: 'online banking', hint: 'Bank online', examples: [{ de: 'Online-Banking nutzen.', en: 'Use online banking.' }] },
      { de: 'die Cybersicherheit', en: 'cybersecurity', hint: 'Security online', examples: [{ de: 'Cybersicherheit ist wichtig.', en: 'Cybersecurity is important.' }] },
      { de: 'die Hacker', en: 'hackers', hint: 'Break into systems', examples: [{ de: 'Hacker greifen an.', en: 'Hackers attack.' }] },
      { de: 'der Virenschutz', en: 'virus protection', hint: 'Antivirus', examples: [{ de: 'Virenschutz installieren.', en: 'Install virus protection.' }] },
      { de: 'die Firewall', en: 'firewall', hint: 'Security barrier', examples: [{ de: 'Die Firewall aktivieren.', en: 'Activate the firewall.' }] },
      { de: 'das Passwort', en: 'password', hint: 'Secret code', examples: [{ de: 'Ein sicheres Passwort wählen.', en: 'Choose a secure password.' }] },
      { de: 'die Verschlüsselung', en: 'encryption', hint: 'Coding data', examples: [{ de: 'Ende-zu-Ende-Verschlüsselung.', en: 'End-to-end encryption.' }] },
      { de: 'die Privatsphäre', en: 'privacy', hint: 'Private life', examples: [{ de: 'Die Privatsphäre schützen.', en: 'Protect privacy.' }] },
      { de: 'der Datenschutz', en: 'data protection', hint: 'Privacy', examples: [{ de: 'Datenschutz-Grundverordnung.', en: 'General Data Protection Regulation.' }] },
      { de: 'die Datenschutzerklärung', en: 'privacy policy', hint: 'Info on data use', examples: [{ de: 'Der Datenschutzerklärung zustimmen.', en: 'Agree to the privacy policy.' }] },
      { de: 'die sozialen Medien', en: 'social media', hint: 'Social networks', examples: [{ de: 'In sozialen Medien aktiv.', en: 'Active on social media.' }] },
      { de: 'der Influencer', en: 'influencer', hint: 'Social media star', examples: [{ de: 'Ein Influencer mit vielen Followern.', en: 'An influencer with many followers.' }] },
      { de: 'die Follower', en: 'followers', hint: 'People following', examples: [{ de: 'Tausende Follower.', en: 'Thousands of followers.' }] },
      { de: 'der Algorithmus', en: 'algorithm', hint: 'Decides what you see', examples: [{ de: 'Der Algorithmus zeigt Beiträge.', en: 'The algorithm shows posts.' }] },
      { de: 'die Filterblase', en: 'filter bubble', hint: 'Echo chamber', examples: [{ de: 'In der Filterblase gefangen.', en: 'Trapped in the filter bubble.' }] },
      { de: 'die Echokammer', en: 'echo chamber', hint: 'Only similar views', examples: [{ de: 'In der Echokammer.', en: 'In the echo chamber.' }] },
      { de: 'die Desinformation', en: 'disinformation', hint: 'False info', examples: [{ de: 'Desinformation verbreiten.', en: 'Spread disinformation.' }] },
      { de: 'die Fake News', en: 'fake news', hint: 'Fake news', examples: [{ de: 'Fake News erkennen.', en: 'Recognize fake news.' }] },
      { de: 'die Medienkompetenz', en: 'media literacy', hint: 'Understanding media', examples: [{ de: 'Medienkompetenz fördern.', en: 'Promote media literacy.' }] },
      { de: 'die digitale Spaltung', en: 'digital divide', hint: 'Inequality in access', examples: [{ de: 'Die digitale Spaltung überwinden.', en: 'Overcome the digital divide.' }] },
      { de: 'die Zukunftstechnologie', en: 'future technology', hint: 'Tech of tomorrow', examples: [{ de: 'In Zukunftstechnologien investieren.', en: 'Invest in future technologies.' }] },

      // Health & Medicine (70)
      { de: 'die Gesundheit', en: 'health', hint: 'Well-being', examples: [{ de: 'Die Gesundheit ist das Wichtigste.', en: 'Health is the most important thing.' }] },
      { de: 'die Krankheit', en: 'illness', hint: 'Sickness', examples: [{ de: 'Eine schwere Krankheit.', en: 'A serious illness.' }] },
      { de: 'das Gesundheitswesen', en: 'healthcare system', hint: 'Medical system', examples: [{ de: 'Das deutsche Gesundheitswesen.', en: 'The German healthcare system.' }] },
      { de: 'die Krankenkasse', en: 'health insurance', hint: 'Insurance', examples: [{ de: 'Bei der Krankenkasse versichern.', en: 'Insure with the health insurance.' }] },
      { de: 'die gesetzliche Krankenversicherung', en: 'statutory health insurance', hint: 'Public', examples: [{ de: 'In der gesetzlichen Krankenversicherung.', en: 'In the statutory health insurance.' }] },
      { de: 'die private Krankenversicherung', en: 'private health insurance', hint: 'Private', examples: [{ de: 'In die private Krankenversicherung wechseln.', en: 'Switch to private health insurance.' }] },
      { de: 'der Arzt', en: 'doctor', hint: 'Medical professional', examples: [{ de: 'Zum Arzt gehen.', en: 'Go to the doctor.' }] },
      { de: 'die Ärztin', en: 'doctor (female)', hint: 'Female doctor', examples: [{ de: 'Eine kompetente Ärztin.', en: 'A competent doctor.' }] },
      { de: 'der Hausarzt', en: 'general practitioner', hint: 'Family doctor', examples: [{ de: 'Zum Hausarzt gehen.', en: 'Go to the GP.' }] },
      { de: 'der Facharzt', en: 'specialist', hint: 'Specialized doctor', examples: [{ de: 'Überweisung zum Facharzt.', en: 'Referral to a specialist.' }] },
      { de: 'der Zahnarzt', en: 'dentist', hint: 'Teeth doctor', examples: [{ de: 'Zweimal im Jahr zum Zahnarzt.', en: 'Twice a year to the dentist.' }] },
      { de: 'der Augenarzt', en: 'eye doctor', hint: 'Ophthalmologist', examples: [{ de: 'Beim Augenarzt den Sehtest machen.', en: 'Do the eye test at the eye doctor.' }] },
      { de: 'der Hautarzt', en: 'dermatologist', hint: 'Skin doctor', examples: [{ de: 'Zum Hautarzt wegen Ausschlag.', en: 'To the dermatologist for a rash.' }] },
      { de: 'der Orthopäde', en: 'orthopedist', hint: 'Bones/joints', examples: [{ de: 'Zum Orthopäden wegen Rückenschmerzen.', en: 'To the orthopedist for back pain.' }] },
      { de: 'der Gynäkologe', en: 'gynecologist', hint: 'Women\'s doctor', examples: [{ de: 'Zur Vorsorge zum Gynäkologen.', en: 'To the gynecologist for check-up.' }] },
      { de: 'der Urologe', en: 'urologist', hint: 'Urinary tract', examples: [{ de: 'Zum Urologen gehen.', en: 'Go to the urologist.' }] },
      { de: 'der Kinderarzt', en: 'pediatrician', hint: 'Children\'s doctor', examples: [{ de: 'Mit dem Kind zum Kinderarzt.', en: 'With the child to the pediatrician.' }] },
      { de: 'der Psychiater', en: 'psychiatrist', hint: 'Mental health doctor', examples: [{ de: 'Hilfe beim Psychiater suchen.', en: 'Seek help from a psychiatrist.' }] },
      { de: 'der Psychologe', en: 'psychologist', hint: 'Mental health expert', examples: [{ de: 'Zum Psychologen gehen.', en: 'Go to the psychologist.' }] },
      { de: 'die Therapie', en: 'therapy', hint: 'Treatment', examples: [{ de: 'Eine Therapie machen.', en: 'Do therapy.' }] },
      { de: 'der Therapeut', en: 'therapist', hint: 'Gives therapy', examples: [{ de: 'Beim Therapeuten in Behandlung.', en: 'In treatment with the therapist.' }] },
      { de: 'die Praxis', en: 'practice', hint: 'Doctor\'s office', examples: [{ de: 'In der Praxis warten.', en: 'Wait in the practice.' }] },
      { de: 'das Krankenhaus', en: 'hospital', hint: 'Clinic', examples: [{ de: 'Ins Krankenhaus eingeliefert.', en: 'Admitted to the hospital.' }] },
      { de: 'die Klinik', en: 'clinic', hint: 'Hospital', examples: [{ de: 'In der Klinik behandelt.', en: 'Treated in the clinic.' }] },
      { de: 'die Notaufnahme', en: 'emergency room', hint: 'ER', examples: [{ de: 'In die Notaufnahme kommen.', en: 'Come to the emergency room.' }] },
      { de: 'der Notarzt', en: 'emergency doctor', hint: 'Doctor for emergencies', examples: [{ de: 'Den Notarzt rufen.', en: 'Call the emergency doctor.' }] },
      { de: 'der Rettungswagen', en: 'ambulance', hint: 'Emergency vehicle', examples: [{ de: 'Mit dem Rettungswagen abtransportieren.', en: 'Transport with the ambulance.' }] },
      { de: 'die Operation', en: 'surgery', hint: 'Medical procedure', examples: [{ de: 'Eine Operation durchführen.', en: 'Perform a surgery.' }] },
      { de: 'operieren', en: 'to operate', hint: 'Perform surgery', examples: [{ de: 'Am Herzen operieren.', en: 'Operate on the heart.' }] },
      { de: 'die Diagnose', en: 'diagnosis', hint: 'Identifying illness', examples: [{ de: 'Die Diagnose stellen.', en: 'Make the diagnosis.' }] },
      { de: 'diagnostizieren', en: 'to diagnose', hint: 'Identify illness', examples: [{ de: 'Krebs diagnostizieren.', en: 'Diagnose cancer.' }] },
      { de: 'die Behandlung', en: 'treatment', hint: 'Medical care', examples: [{ de: 'Die Behandlung beginnt.', en: 'The treatment begins.' }] },
      { de: 'behandeln', en: 'to treat', hint: 'Give medical care', examples: [{ de: 'Den Patienten behandeln.', en: 'Treat the patient.' }] },
      { de: 'das Medikament', en: 'medication', hint: 'Medicine', examples: [{ de: 'Ein Medikament verschreiben.', en: 'Prescribe a medication.' }] },
      { de: 'die Tablette', en: 'pill', hint: 'Solid medicine', examples: [{ de: 'Eine Tablette einnehmen.', en: 'Take a pill.' }] },
      { de: 'die Dosis', en: 'dose', hint: 'Amount', examples: [{ de: 'Die richtige Dosis.', en: 'The correct dose.' }] },
      { de: 'die Nebenwirkung', en: 'side effect', hint: 'Unwanted effect', examples: [{ de: 'Nebenwirkungen des Medikaments.', en: 'Side effects of the medication.' }] },
      { de: 'die Impfung', en: 'vaccination', hint: 'Shot', examples: [{ de: 'Gegen Grippe impfen.', en: 'Vaccinate against flu.' }] },
      { de: 'impfen', en: 'to vaccinate', hint: 'Give vaccine', examples: [{ de: 'Die Kinder impfen.', en: 'Vaccinate the children.' }] },
      { de: 'der Impfstoff', en: 'vaccine', hint: 'Immunization agent', examples: [{ de: 'Ein neuer Impfstoff.', en: 'A new vaccine.' }] },
      { de: 'die Vorsorge', en: 'prevention', hint: 'Preventive care', examples: [{ de: 'Zur Vorsorge gehen.', en: 'Go for preventive care.' }] },
      { de: 'die Vorsorgeuntersuchung', en: 'check-up', hint: 'Regular exam', examples: [{ de: 'Zur Vorsorgeuntersuchung.', en: 'For the check-up.' }] },
      { de: 'der Blutdruck', en: 'blood pressure', hint: 'BP', examples: [{ de: 'Den Blutdruck messen.', en: 'Measure blood pressure.' }] },
      { de: 'hoher Blutdruck', en: 'high blood pressure', hint: 'Hypertension', examples: [{ de: 'Hohen Blutdruck haben.', en: 'Have high blood pressure.' }] },
      { de: 'der Blutzucker', en: 'blood sugar', hint: 'Glucose', examples: [{ de: 'Den Blutzucker kontrollieren.', en: 'Control blood sugar.' }] },
      { de: 'Diabetes', en: 'diabetes', hint: 'Sugar disease', examples: [{ de: 'Diabetes Typ 2.', en: 'Type 2 diabetes.' }] },
      { de: 'die Allergie', en: 'allergy', hint: 'Reaction', examples: [{ de: 'Eine Allergie gegen Pollen.', en: 'An allergy to pollen.' }] },
      { de: 'allergisch', en: 'allergic', hint: 'Has allergy', examples: [{ de: 'Allergisch gegen Nüsse.', en: 'Allergic to nuts.' }] },
      { de: 'die Erkältung', en: 'cold', hint: 'Common illness', examples: [{ de: 'Eine Erkältung auskurieren.', en: 'Get over a cold.' }] },
      { de: 'die Grippe', en: 'flu', hint: 'Influenza', examples: [{ de: 'An Grippe erkranken.', en: 'Get the flu.' }] },
      { de: 'der Husten', en: 'cough', hint: 'Cough', examples: [{ de: 'Husten und Schnupfen.', en: 'Cough and runny nose.' }] },
      { de: 'der Schnupfen', en: 'runny nose', hint: 'Cold symptom', examples: [{ de: 'Schnupfen haben.', en: 'Have a runny nose.' }] },
      { de: 'das Fieber', en: 'fever', hint: 'High temperature', examples: [{ de: 'Fieber messen.', en: 'Take temperature.' }] },
      { de: 'die Kopfschmerzen', en: 'headache', hint: 'Pain in head', examples: [{ de: 'Starke Kopfschmerzen haben.', en: 'Have a bad headache.' }] },
      { de: 'die Migräne', en: 'migraine', hint: 'Severe headache', examples: [{ de: 'Unter Migräne leiden.', en: 'Suffer from migraines.' }] },
      { de: 'die Rückenschmerzen', en: 'back pain', hint: 'Pain in back', examples: [{ de: 'Chronische Rückenschmerzen.', en: 'Chronic back pain.' }] },
      { de: 'die Schmerzen', en: 'pain', hint: 'Ache', examples: [{ de: 'Unter Schmerzen leiden.', en: 'Suffer from pain.' }] },
      { de: 'die Verletzung', en: 'injury', hint: 'Damage to body', examples: [{ de: 'Eine Sportverletzung.', en: 'A sports injury.' }] },
      { de: 'sich verletzen', en: 'to injure oneself', hint: 'Get hurt', examples: [{ de: 'Beim Sport verletzen.', en: 'Get injured during sports.' }] },
      { de: 'der Bruch', en: 'fracture', hint: 'Broken bone', examples: [{ de: 'Ein Beinbruch.', en: 'A leg fracture.' }] },
      { de: 'der Gips', en: 'cast', hint: 'Plaster cast', examples: [{ de: 'Den Arm in Gips.', en: 'The arm in a cast.' }] },
      { de: 'die Wunde', en: 'wound', hint: 'Cut/injury', examples: [{ de: 'Die Wunde verbinden.', en: 'Dress the wound.' }] },
      { de: 'das Pflaster', en: 'band-aid', hint: 'Sticky bandage', examples: [{ de: 'Ein Pflaster aufkleben.', en: 'Put on a band-aid.' }] },
      { de: 'der Verband', en: 'bandage', hint: 'Wrap', examples: [{ de: 'Den Verband wechseln.', en: 'Change the bandage.' }] },
      { de: 'die Krankmeldung', en: 'sick note', hint: 'Notice of illness', examples: [{ de: 'Eine Krankmeldung einreichen.', en: 'Submit a sick note.' }] },
     { de: 'krankgeschrieben', en: 'on sick leave', hint: "Doctor's note", examples: [{ de: 'Eine Woche krankgeschrieben.', en: 'On sick leave for a week.' }] },
      { de: 'der Krankenstand', en: 'sick leave', hint: 'Time off sick', examples: [{ de: 'Im Krankenstand sein.', en: 'Be on sick leave.' }] },
      { de: 'die Genesung', en: 'recovery', hint: 'Getting better', examples: [{ de: 'Eine schnelle Genesung wünschen.', en: 'Wish a speedy recovery.' }] },
      { de: 'sich erholen', en: 'to recover', hint: 'Get better', examples: [{ de: 'Von der Krankheit erholen.', en: 'Recover from the illness.' }] },

      // Feelings & Emotions (80)
      { de: 'die Emotion', en: 'emotion', hint: 'Feeling', examples: [{ de: 'Starke Emotionen zeigen.', en: 'Show strong emotions.' }] },
      { de: 'das Gefühl', en: 'feeling', hint: 'Sensation', examples: [{ de: 'Ein komisches Gefühl.', en: 'A strange feeling.' }] },
      { de: 'die Stimmung', en: 'mood', hint: 'Atmosphere', examples: [{ de: 'Die Stimmung ist gut.', en: 'The mood is good.' }] },
      { de: 'die Laune', en: 'mood', hint: 'Temper', examples: [{ de: 'Gute Laune haben.', en: 'Be in a good mood.' }] },
      { de: 'glücklich', en: 'happy', hint: 'Joyful', examples: [{ de: 'Ich bin so glücklich!', en: 'I am so happy!' }] },
      { de: 'das Glück', en: 'happiness', hint: 'Joy', examples: [{ de: 'Das Glück suchen.', en: 'Seek happiness.' }] },
      { de: 'traurig', en: 'sad', hint: 'Unhappy', examples: [{ de: 'Aus traurigem Anlass.', en: 'On a sad occasion.' }] },
      { de: 'die Trauer', en: 'sadness', hint: 'Grief', examples: [{ de: 'In tiefer Trauer.', en: 'In deep sadness.' }] },
      { de: 'wütend', en: 'angry', hint: 'Mad', examples: [{ de: 'Wütend auf jemanden sein.', en: 'Be angry at someone.' }] },
      { de: 'die Wut', en: 'anger', hint: 'Rage', examples: [{ de: 'Seine Wut kontrollieren.', en: 'Control his anger.' }] },
      { de: 'sich ärgern', en: 'to be annoyed', hint: 'Get angry', examples: [{ de: 'Sich über Kleinigkeiten ärgern.', en: 'Get annoyed about small things.' }] },
      { de: 'der Ärger', en: 'annoyance', hint: 'Trouble', examples: [{ de: 'Ärger mit dem Chef.', en: 'Trouble with the boss.' }] },
      { de: 'Angst haben', en: 'to be afraid', hint: 'Fear', examples: [{ de: 'Angst vor der Zukunft haben.', en: 'Be afraid of the future.' }] },
      { de: 'die Angst', en: 'fear', hint: 'Fear', examples: [{ de: 'Ängste überwinden.', en: 'Overcome fears.' }] },
      { de: 'ängstlich', en: 'anxious', hint: 'Fearful', examples: [{ de: 'Ein ängstliches Kind.', en: 'An anxious child.' }] },
      { de: 'sich fürchten', en: 'to be scared', hint: 'Fear', examples: [{ de: 'Sich vor Spinnen fürchten.', en: 'Be scared of spiders.' }] },
      { de: 'die Furcht', en: 'fear', hint: 'Terror', examples: [{ de: 'Furcht vor dem Unbekannten.', en: 'Fear of the unknown.' }] },
      { de: 'die Panik', en: 'panic', hint: 'Sudden fear', examples: [{ de: 'In Panik geraten.', en: 'Go into panic.' }] },
      { de: 'sich freuen', en: 'to be glad', hint: 'Be happy', examples: [{ de: 'Sich auf den Urlaub freuen.', en: 'Look forward to vacation.' }] },
      { de: 'die Freude', en: 'joy', hint: 'Happiness', examples: [{ de: 'Freude am Leben.', en: 'Joy of life.' }] },
      { de: 'erfreut', en: 'pleased', hint: 'Happy', examples: [{ de: 'Erfreut über die Nachricht.', en: 'Pleased about the news.' }] },
      { de: 'sich langweilen', en: 'to be bored', hint: 'Have nothing to do', examples: [{ de: 'Sich im Unterricht langweilen.', en: 'Be bored in class.' }] },
      { de: 'die Langeweile', en: 'boredom', hint: 'Tedium', examples: [{ de: 'Aus Langeweile fernsehen.', en: 'Watch TV out of boredom.' }] },
      { de: 'langweilig', en: 'boring', hint: 'Not interesting', examples: [{ de: 'Ein langweiliger Film.', en: 'A boring movie.' }] },
      { de: 'überrascht', en: 'surprised', hint: 'Unexpected', examples: [{ de: 'Überrascht von der Neuigkeit.', en: 'Surprised by the news.' }] },
      { de: 'die Überraschung', en: 'surprise', hint: 'Unexpected event', examples: [{ de: 'Eine angenehme Überraschung.', en: 'A pleasant surprise.' }] },
      { de: 'enttäuscht', en: 'disappointed', hint: 'Let down', examples: [{ de: 'Von der Entscheidung enttäuscht.', en: 'Disappointed by the decision.' }] },
      { de: 'die Enttäuschung', en: 'disappointment', hint: 'Letdown', examples: [{ de: 'Eine große Enttäuschung.', en: 'A big disappointment.' }] },
      { de: 'zufrieden', en: 'satisfied', hint: 'Content', examples: [{ de: 'Mit dem Ergebnis zufrieden.', en: 'Satisfied with the result.' }] },
      { de: 'die Zufriedenheit', en: 'satisfaction', hint: 'Contentment', examples: [{ de: 'Ein Gefühl der Zufriedenheit.', en: 'A feeling of satisfaction.' }] },
      { de: 'unzufrieden', en: 'dissatisfied', hint: 'Not satisfied', examples: [{ de: 'Mit dem Service unzufrieden.', en: 'Dissatisfied with the service.' }] },
      { de: 'die Unzufriedenheit', en: 'dissatisfaction', hint: 'Discontent', examples: [{ de: 'Die Unzufriedenheit wächst.', en: 'Dissatisfaction grows.' }] },
      { de: 'neidisch', en: 'envious', hint: 'Jealous', examples: [{ de: 'Neidisch auf den Erfolg.', en: 'Envious of the success.' }] },
      { de: 'der Neid', en: 'envy', hint: 'Jealousy', examples: [{ de: 'Neid ist ein schlechter Begleiter.', en: 'Envy is a bad companion.' }] },
      { de: 'eifersüchtig', en: 'jealous', hint: 'Romantic jealousy', examples: [{ de: 'Eifersüchtig auf den Ex.', en: 'Jealous of the ex.' }] },
      { de: 'die Eifersucht', en: 'jealousy', hint: 'Romantic jealousy', examples: [{ de: 'Eifersucht in der Beziehung.', en: 'Jealousy in the relationship.' }] },
      { de: 'stolz', en: 'proud', hint: 'Pride', examples: [{ de: 'Stolz auf die Kinder.', en: 'Proud of the children.' }] },
      { de: 'der Stolz', en: 'pride', hint: 'Pride', examples: [{ de: 'Mit Stolz erfüllt.', en: 'Filled with pride.' }] },
      { de: 'schüchtern', en: 'shy', hint: 'Timid', examples: [{ de: 'Ein schüchternes Lächeln.', en: 'A shy smile.' }] },
      { de: 'die Schüchternheit', en: 'shyness', hint: 'Timidity', examples: [{ de: 'Seine Schüchternheit überwinden.', en: 'Overcome his shyness.' }] },
      { de: 'selbstbewusst', en: 'self-confident', hint: 'Confident', examples: [{ de: 'Selbstbewusst auftreten.', en: 'Appear self-confident.' }] },
      { de: 'das Selbstbewusstsein', en: 'self-confidence', hint: 'Confidence', examples: [{ de: 'An Selbstbewusstsein gewinnen.', en: 'Gain self-confidence.' }] },
      { de: 'unsicher', en: 'insecure', hint: 'Not sure', examples: [{ de: 'Sich unsicher fühlen.', en: 'Feel insecure.' }] },
      { de: 'die Unsicherheit', en: 'insecurity', hint: 'Lack of confidence', examples: [{ de: 'Ängste und Unsicherheiten.', en: 'Fears and insecurities.' }] },
      { de: 'nervös', en: 'nervous', hint: 'Anxious', examples: [{ de: 'Vor der Prüfung nervös.', en: 'Nervous before the exam.' }] },
      { de: 'die Nervosität', en: 'nervousness', hint: 'Anxiety', examples: [{ de: 'Die Nervosität steigt.', en: 'Nervousness rises.' }] },
      { de: 'ruhig', en: 'calm', hint: 'Not nervous', examples: [{ de: 'Ruhig und gelassen.', en: 'Calm and composed.' }] },
      { de: 'die Ruhe', en: 'calm', hint: 'Peace', examples: [{ de: 'Die Ruhe bewahren.', en: 'Keep calm.' }] },
      { de: 'aufgeregt', en: 'excited', hint: 'Agitated', examples: [{ de: 'Aufgeregt vor dem Konzert.', en: 'Excited before the concert.' }] },
      { de: 'die Aufregung', en: 'excitement', hint: 'Agitation', examples: [{ de: 'Große Aufregung herrscht.', en: 'Great excitement prevails.' }] },
      { de: 'gespannt', en: 'curious', hint: 'Eager to know', examples: [{ de: 'Gespannt auf die Fortsetzung.', en: 'Curious about the continuation.' }] },
      { de: 'die Spannung', en: 'tension', hint: 'Suspense', examples: [{ de: 'Die Spannung im Film.', en: 'The suspense in the movie.' }] },
      { de: 'verliebt', en: 'in love', hint: 'Loving feeling', examples: [{ de: 'Hoffnungslos verliebt.', en: 'Hopelessly in love.' }] },
      { de: 'die Verliebtheit', en: 'being in love', hint: 'Love state', examples: [{ de: 'Die erste Verliebtheit.', en: 'First love.' }] },
      { de: 'einsam', en: 'lonely', hint: 'Alone and sad', examples: [{ de: 'Sich einsam fühlen.', en: 'Feel lonely.' }] },
      { de: 'die Einsamkeit', en: 'loneliness', hint: 'Being alone', examples: [{ de: 'Unter Einsamkeit leiden.', en: 'Suffer from loneliness.' }] },
      { de: 'allein', en: 'alone', hint: 'By yourself', examples: [{ de: 'Allein zu Hause.', en: 'Alone at home.' }] },
      { de: 'die Liebe', en: 'love', hint: 'Affection', examples: [{ de: 'Die große Liebe finden.', en: 'Find the great love.' }] },
      { de: 'lieben', en: 'to love', hint: 'Feel love', examples: [{ de: 'Jemanden lieben.', en: 'Love someone.' }] },
      { de: 'der Hass', en: 'hatred', hint: 'Strong dislike', examples: [{ de: 'Hass und Gewalt.', en: 'Hatred and violence.' }] },
      { de: 'hassen', en: 'to hate', hint: 'Strongly dislike', examples: [{ de: 'Ungerechtigkeit hassen.', en: 'Hate injustice.' }] },
      { de: 'die Sehnsucht', en: 'longing', hint: 'Yearning', examples: [{ de: 'Sehnsucht nach der Heimat.', en: 'Longing for home.' }] },
      { de: 'sich sehnen', en: 'to long for', hint: 'Yearn', examples: [{ de: 'Sich nach Frieden sehnen.', en: 'Long for peace.' }] },
      { de: 'die Hoffnung', en: 'hope', hint: 'Positive expectation', examples: [{ de: 'Die Hoffnung nicht aufgeben.', en: 'Don\'t give up hope.' }] },
      { de: 'hoffen', en: 'to hope', hint: 'Wish for', examples: [{ de: 'Auf Besserung hoffen.', en: 'Hope for improvement.' }] },
      { de: 'hoffnungslos', en: 'hopeless', hint: 'No hope', examples: [{ de: 'Eine hoffnungslose Situation.', en: 'A hopeless situation.' }] },
      { de: 'die Verzweiflung', en: 'despair', hint: 'Hopelessness', examples: [{ de: 'In Verzweiflung geraten.', en: 'Fall into despair.' }] },
      { de: 'verzweifelt', en: 'desperate', hint: 'In despair', examples: [{ de: 'Verzweifelt nach Hilfe suchen.', en: 'Desperately look for help.' }] },
      { de: 'die Dankbarkeit', en: 'gratitude', hint: 'Thankfulness', examples: [{ de: 'Dankbarkeit zeigen.', en: 'Show gratitude.' }] },
      { de: 'dankbar', en: 'grateful', hint: 'Thankful', examples: [{ de: 'Für die Hilfe dankbar.', en: 'Grateful for the help.' }] },
      { de: 'die Schuld', en: 'guilt', hint: 'Responsibility for wrong', examples: [{ de: 'Ein schlechtes Gewissen.', en: 'A guilty conscience.' }] },
      { de: 'schuldig', en: 'guilty', hint: 'At fault', examples: [{ de: 'Sich schuldig fühlen.', en: 'Feel guilty.' }] },
      { de: 'die Scham', en: 'shame', hint: 'Embarrassment', examples: [{ de: 'Vor Scham erröten.', en: 'Blush with shame.' }] },
      { de: 'sich schämen', en: 'to be ashamed', hint: 'Feel shame', examples: [{ de: 'Sich für sein Verhalten schämen.', en: 'Be ashamed of his behavior.' }] },
      { de: 'peinlich', en: 'embarrassing', hint: 'Awkward', examples: [{ de: 'Eine peinliche Situation.', en: 'An embarrassing situation.' }] },
      { de: 'die Peinlichkeit', en: 'embarrassment', hint: 'Awkwardness', examples: [{ de: 'Die Peinlichkeit überwinden.', en: 'Overcome the embarrassment.' }] },
      { de: 'die Reue', en: 'regret', hint: 'Remorse', examples: [{ de: 'Reue zeigen.', en: 'Show regret.' }] },
      { de: 'bereuen', en: 'to regret', hint: 'Feel sorry for', examples: [{ de: 'Eine Entscheidung bereuen.', en: 'Regret a decision.' }] },
      { de: 'die Zuneigung', en: 'affection', hint: 'Warm feeling', examples: [{ de: 'Zuneigung zeigen.', en: 'Show affection.' }] },
      { de: 'zärtlich', en: 'tender', hint: 'Gentle', examples: [{ de: 'Ein zärtlicher Kuss.', en: 'A tender kiss.' }] },

      // Opinions & Arguments (80)
      { de: 'die Meinung', en: 'opinion', hint: 'View', examples: [{ de: 'Meine Meinung ist...', en: 'My opinion is...' }] },
      { de: 'meiner Meinung nach', en: 'in my opinion', hint: 'IMO', examples: [{ de: 'Meiner Meinung nach ist das falsch.', en: 'In my opinion, that is wrong.' }] },
      { de: 'meiner Ansicht nach', en: 'in my view', hint: 'IMO', examples: [{ de: 'Meiner Ansicht nach stimmt das.', en: 'In my view, that is correct.' }] },
      { de: 'finden', en: 'to think', hint: 'Express opinion', examples: [{ de: 'Ich finde den Film gut.', en: 'I think the movie is good.' }] },
      { de: 'glauben', en: 'to believe', hint: 'Think', examples: [{ de: 'Ich glaube, er hat recht.', en: 'I believe he is right.' }] },
      { de: 'denken', en: 'to think', hint: 'Consider', examples: [{ de: 'Was denkst du?', en: 'What do you think?' }] },
      { de: 'meinen', en: 'to mean/think', hint: 'Opine', examples: [{ de: 'Wie meinst du das?', en: 'What do you mean by that?' }] },
      { de: 'halten von', en: 'to think of', hint: 'Opinion', examples: [{ de: 'Was hältst du von der Idee?', en: 'What do you think of the idea?' }] },
      { de: 'einschätzen', en: 'to assess', hint: 'Judge', examples: [{ de: 'Die Situation richtig einschätzen.', en: 'Assess the situation correctly.' }] },
      { de: 'beurteilen', en: 'to judge', hint: 'Form opinion', examples: [{ de: 'Jemanden beurteilen.', en: 'Judge someone.' }] },
      { de: 'die Einstellung', en: 'attitude', hint: 'Viewpoint', examples: [{ de: 'Eine positive Einstellung haben.', en: 'Have a positive attitude.' }] },
      { de: 'die Haltung', en: 'stance', hint: 'Position', examples: [{ de: 'Eine klare Haltung zeigen.', en: 'Show a clear stance.' }] },
      { de: 'zustimmen', en: 'to agree', hint: 'Say yes', examples: [{ de: 'Ich stimme dir voll und ganz zu.', en: 'I completely agree with you.' }] },
      { de: 'die Zustimmung', en: 'agreement', hint: 'Approval', examples: [{ de: 'Allgemeine Zustimmung finden.', en: 'Find general agreement.' }] },
      { de: 'widersprechen', en: 'to disagree', hint: 'Say no', examples: [{ de: 'Ich muss widersprechen.', en: 'I have to disagree.' }] },
      { de: 'der Widerspruch', en: 'contradiction', hint: 'Disagreement', examples: [{ de: 'Im Widerspruch stehen.', en: 'Be in contradiction.' }] },
      { de: 'diskutieren', en: 'to discuss', hint: 'Talk about', examples: [{ de: 'Über ein Thema diskutieren.', en: 'Discuss a topic.' }] },
      { de: 'die Diskussion', en: 'discussion', hint: 'Talk', examples: [{ de: 'Eine hitzige Diskussion.', en: 'A heated discussion.' }] },
      { de: 'debattieren', en: 'to debate', hint: 'Formal discussion', examples: [{ de: 'Im Parlament debattieren.', en: 'Debate in parliament.' }] },
      { de: 'die Debatte', en: 'debate', hint: 'Formal discussion', examples: [{ de: 'Eine politische Debatte.', en: 'A political debate.' }] },
      { de: 'das Argument', en: 'argument', hint: 'Reason', examples: [{ de: 'Ein überzeugendes Argument.', en: 'A convincing argument.' }] },
      { de: 'argumentieren', en: 'to argue', hint: 'Give reasons', examples: [{ de: 'Für eine Sache argumentieren.', en: 'Argue for a cause.' }] },
      { de: 'überzeugen', en: 'to convince', hint: 'Make believe', examples: [{ de: 'Jemanden von einer Idee überzeugen.', en: 'Convince someone of an idea.' }] },
      { de: 'überzeugend', en: 'convincing', hint: 'Persuasive', examples: [{ de: 'Ein überzeugendes Argument.', en: 'A convincing argument.' }] },
      { de: 'die Überzeugung', en: 'conviction', hint: 'Strong belief', examples: [{ de: 'Aus Überzeugung handeln.', en: 'Act out of conviction.' }] },
      { de: 'behaupten', en: 'to claim', hint: 'State without proof', examples: [{ de: 'Er behauptet, dass...', en: 'He claims that...' }] },
      { de: 'die Behauptung', en: 'claim', hint: 'Statement', examples: [{ de: 'Eine unbelegte Behauptung.', en: 'An unsubstantiated claim.' }] },
      { de: 'beweisen', en: 'to prove', hint: 'Show truth', examples: [{ de: 'Die Richtigkeit beweisen.', en: 'Prove the correctness.' }] },
      { de: 'der Beweis', en: 'proof', hint: 'Evidence', examples: [{ de: 'Einen Beweis liefern.', en: 'Provide proof.' }] },
      { de: 'die Tatsache', en: 'fact', hint: 'Truth', examples: [{ de: 'Das ist eine Tatsache.', en: 'That is a fact.' }] },
      { de: 'tatsächlich', en: 'actually', hint: 'In fact', examples: [{ de: 'Das ist tatsächlich wahr.', en: 'That is actually true.' }] },
      { de: 'angeblich', en: 'allegedly', hint: 'Supposedly', examples: [{ de: 'Er ist angeblich krank.', en: 'He is allegedly sick.' }] },
      { de: 'offensichtlich', en: 'obvious', hint: 'Clearly', examples: [{ de: 'Das ist offensichtlich falsch.', en: 'That is obviously wrong.' }] },
      { de: 'wahrscheinlich', en: 'probable', hint: 'Likely', examples: [{ de: 'Wahrscheinlich kommt er.', en: 'He is probably coming.' }] },
      { de: 'unwahrscheinlich', en: 'unlikely', hint: 'Not probable', examples: [{ de: 'Das ist unwahrscheinlich.', en: 'That is unlikely.' }] },
      { de: 'möglich', en: 'possible', hint: 'Could be', examples: [{ de: 'Alles ist möglich.', en: 'Everything is possible.' }] },
      { de: 'unmöglich', en: 'impossible', hint: 'Cannot be', examples: [{ de: 'Das ist unmöglich!', en: 'That is impossible!' }] },
      { de: 'sicher', en: 'certain', hint: 'Sure', examples: [{ de: 'Bist du dir sicher?', en: 'Are you sure?' }] },
      { de: 'unsicher', en: 'uncertain', hint: 'Not sure', examples: [{ de: 'Ich bin mir unsicher.', en: 'I am unsure.' }] },
      { de: 'die Sicherheit', en: 'certainty', hint: 'Sureness', examples: [{ de: 'Mit Sicherheit.', en: 'With certainty.' }] },
      { de: 'der Zweifel', en: 'doubt', hint: 'Uncertainty', examples: [{ de: 'An etwas zweifeln.', en: 'Doubt something.' }] },
      { de: 'zweifeln', en: 'to doubt', hint: 'Not believe', examples: [{ de: 'Ich zweifle an seiner Geschichte.', en: 'I doubt his story.' }] },
      { de: 'zweifelhaft', en: 'doubtful', hint: 'Questionable', examples: [{ de: 'Eine zweifelhafte Behauptung.', en: 'A doubtful claim.' }] },
      { de: 'bestätigen', en: 'to confirm', hint: 'Verify', examples: [{ de: 'Die Nachricht bestätigen.', en: 'Confirm the news.' }] },
      { de: 'die Bestätigung', en: 'confirmation', hint: 'Verification', examples: [{ de: 'Eine Bestätigung erhalten.', en: 'Receive confirmation.' }] },
      { de: 'verneinen', en: 'to deny', hint: 'Say no', examples: [{ de: 'Die Schuld verneinen.', en: 'Deny guilt.' }] },
      { de: 'die Verneinung', en: 'denial', hint: 'Saying no', examples: [{ de: 'Eine klare Verneinung.', en: 'A clear denial.' }] },
      { de: 'einwenden', en: 'to object', hint: 'Raise objection', examples: [{ de: 'Gegen einen Vorschlag einwenden.', en: 'Object to a proposal.' }] },
      { de: 'der Einwand', en: 'objection', hint: 'Counter-argument', examples: [{ de: 'Einen Einwand haben.', en: 'Have an objection.' }] },
      { de: 'die Kritik', en: 'criticism', hint: 'Negative feedback', examples: [{ de: 'Kritik äußern.', en: 'Express criticism.' }] },
      { de: 'kritisieren', en: 'to criticize', hint: 'Find fault', examples: [{ de: 'Die Regierung kritisieren.', en: 'Criticize the government.' }] },
      { de: 'kritisch', en: 'critical', hint: 'Judging', examples: [{ de: 'Eine kritische Haltung.', en: 'A critical attitude.' }] },
      { de: 'loben', en: 'to praise', hint: 'Say good things', examples: [{ de: 'Die Leistung loben.', en: 'Praise the performance.' }] },
      { de: 'das Lob', en: 'praise', hint: 'Positive feedback', examples: [{ de: 'Lob bekommen.', en: 'Get praise.' }] },
      { de: 'die Anerkennung', en: 'recognition', hint: 'Appreciation', examples: [{ de: 'Anerkennung verdienen.', en: 'Deserve recognition.' }] },
      { de: 'anerkennen', en: 'to recognize', hint: 'Appreciate', examples: [{ de: 'Die Leistung anerkennen.', en: 'Recognize the achievement.' }] },
      { de: 'die Zustimmung', en: 'approval', hint: 'Agreement', examples: [{ de: 'Allgemeine Zustimmung.', en: 'General approval.' }] },
      { de: 'die Ablehnung', en: 'rejection', hint: 'Refusal', examples: [{ de: 'Auf Ablehnung stoßen.', en: 'Meet with rejection.' }] },
      { de: 'ablehnen', en: 'to reject', hint: 'Say no', examples: [{ de: 'Ein Angebot ablehnen.', en: 'Reject an offer.' }] },
      { de: 'befürworten', en: 'to support', hint: 'Be in favor', examples: [{ de: 'Eine Maßnahme befürworten.', en: 'Support a measure.' }] },
      { de: 'der Befürworter', en: 'supporter', hint: 'Proponent', examples: [{ de: 'Befürworter der Reform.', en: 'Supporters of the reform.' }] },
      { de: 'der Gegner', en: 'opponent', hint: 'Against', examples: [{ de: 'Gegner der Atomkraft.', en: 'Opponents of nuclear power.' }] },
      { de: 'die Position', en: 'position', hint: 'Standpoint', examples: [{ de: 'Eine klare Position beziehen.', en: 'Take a clear position.' }] },
      { de: 'der Standpunkt', en: 'point of view', hint: 'Perspective', examples: [{ de: 'Aus meinem Standpunkt.', en: 'From my point of view.' }] },
      { de: 'der Aspekt', en: 'aspect', hint: 'Angle', examples: [{ de: 'Ein wichtiger Aspekt.', en: 'An important aspect.' }] },
      { de: 'der Gesichtspunkt', en: 'viewpoint', hint: 'Perspective', examples: [{ de: 'Unter diesem Gesichtspunkt.', en: 'From this viewpoint.' }] },
      { de: 'die Perspektive', en: 'perspective', hint: 'View', examples: [{ de: 'Eine andere Perspektive.', en: 'A different perspective.' }] },
      { de: 'sich einigen', en: 'to agree', hint: 'Reach consensus', examples: [{ de: 'Auf einen Kompromiss einigen.', en: 'Agree on a compromise.' }] },
      { de: 'die Einigung', en: 'agreement', hint: 'Consensus', examples: [{ de: 'Eine Einigung erzielen.', en: 'Reach an agreement.' }] },
      { de: 'der Kompromiss', en: 'compromise', hint: 'Middle ground', examples: [{ de: 'Einen Kompromiss finden.', en: 'Find a compromise.' }] },
      { de: 'verhandeln', en: 'to negotiate', hint: 'Discuss terms', examples: [{ de: 'Über den Preis verhandeln.', en: 'Negotiate the price.' }] },
      { de: 'die Verhandlung', en: 'negotiation', hint: 'Discussion', examples: [{ de: 'In Verhandlungen stehen.', en: 'Be in negotiations.' }] },
      { de: 'der Streit', en: 'argument', hint: 'Fight', examples: [{ de: 'Einen Streit schlichten.', en: 'Settle an argument.' }] },
      { de: 'der Konflikt', en: 'conflict', hint: 'Serious disagreement', examples: [{ de: 'Einen Konflikt lösen.', en: 'Resolve a conflict.' }] },
      { de: 'die Lösung', en: 'solution', hint: 'Answer', examples: [{ de: 'Eine Lösung finden.', en: 'Find a solution.' }] },
      { de: 'lösen', en: 'to solve', hint: 'Find answer', examples: [{ de: 'Ein Problem lösen.', en: 'Solve a problem.' }] },
      { de: 'die Entscheidung', en: 'decision', hint: 'Choice', examples: [{ de: 'Eine Entscheidung treffen.', en: 'Make a decision.' }] },
      { de: 'entscheiden', en: 'to decide', hint: 'Choose', examples: [{ de: 'Sich für etwas entscheiden.', en: 'Decide on something.' }] },

      // Abstract Concepts (80)
      { de: 'die Idee', en: 'idea', hint: 'Thought', examples: [{ de: 'Eine gute Idee haben.', en: 'Have a good idea.' }] },
      { de: 'der Gedanke', en: 'thought', hint: 'Idea', examples: [{ de: 'Ein interessanter Gedanke.', en: 'An interesting thought.' }] },
      { de: 'das Konzept', en: 'concept', hint: 'Abstract idea', examples: [{ de: 'Ein neues Konzept entwickeln.', en: 'Develop a new concept.' }] },
      { de: 'die Theorie', en: 'theory', hint: 'Explanation', examples: [{ de: 'Eine wissenschaftliche Theorie.', en: 'A scientific theory.' }] },
      { de: 'die Praxis', en: 'practice', hint: 'Real world', examples: [{ de: 'Theorie und Praxis.', en: 'Theory and practice.' }] },
      { de: 'das Prinzip', en: 'principle', hint: 'Rule', examples: [{ de: 'Aus Prinzip handeln.', en: 'Act on principle.' }] },
      { de: 'die Methode', en: 'method', hint: 'Way of doing', examples: [{ de: 'Eine effektive Methode.', en: 'An effective method.' }] },
      { de: 'das System', en: 'system', hint: 'Organized set', examples: [{ de: 'Das Bildungssystem.', en: 'The education system.' }] },
      { de: 'die Struktur', en: 'structure', hint: 'Arrangement', examples: [{ de: 'Eine klare Struktur.', en: 'A clear structure.' }] },
      { de: 'die Funktion', en: 'function', hint: 'Purpose', examples: [{ de: 'Die Funktion des Geräts.', en: 'The function of the device.' }] },
      { de: 'der Prozess', en: 'process', hint: 'Series of steps', examples: [{ de: 'Ein komplexer Prozess.', en: 'A complex process.' }] },
      { de: 'die Entwicklung', en: 'development', hint: 'Growth', examples: [{ de: 'Die wirtschaftliche Entwicklung.', en: 'Economic development.' }] },
      { de: 'der Fortschritt', en: 'progress', hint: 'Advancement', examples: [{ de: 'Technischer Fortschritt.', en: 'Technical progress.' }] },
      { de: 'die Verbesserung', en: 'improvement', hint: 'Making better', examples: [{ de: 'Eine Verbesserung erreichen.', en: 'Achieve an improvement.' }] },
      { de: 'die Veränderung', en: 'change', hint: 'Alteration', examples: [{ de: 'Eine Veränderung herbeiführen.', en: 'Bring about a change.' }] },
      { de: 'die Möglichkeit', en: 'possibility', hint: 'Option', examples: [{ de: 'Alle Möglichkeiten prüfen.', en: 'Check all possibilities.' }] },
      { de: 'die Chance', en: 'chance', hint: 'Opportunity', examples: [{ de: 'Eine Chance nutzen.', en: 'Use an opportunity.' }] },
      { de: 'das Risiko', en: 'risk', hint: 'Danger', examples: [{ de: 'Ein Risiko eingehen.', en: 'Take a risk.' }] },
      { de: 'die Gefahr', en: 'danger', hint: 'Peril', examples: [{ de: 'In Gefahr sein.', en: 'Be in danger.' }] },
      { de: 'die Sicherheit', en: 'safety', hint: 'Freedom from danger', examples: [{ de: 'Für Sicherheit sorgen.', en: 'Ensure safety.' }] },
      { de: 'die Qualität', en: 'quality', hint: 'Standard', examples: [{ de: 'Gute Qualität.', en: 'Good quality.' }] },
      { de: 'die Quantität', en: 'quantity', hint: 'Amount', examples: [{ de: 'Quantität statt Qualität.', en: 'Quantity instead of quality.' }] },
      { de: 'der Wert', en: 'value', hint: 'Worth', examples: [{ de: 'Den Wert erkennen.', en: 'Recognize the value.' }] },
      { de: 'die Bedeutung', en: 'meaning', hint: 'Significance', examples: [{ de: 'Die Bedeutung des Wortes.', en: 'The meaning of the word.' }] },
      { de: 'der Sinn', en: 'sense', hint: 'Purpose', examples: [{ de: 'Den Sinn des Lebens suchen.', en: 'Seek the meaning of life.' }] },
      { de: 'das Ziel', en: 'goal', hint: 'Objective', examples: [{ de: 'Sich ein Ziel setzen.', en: 'Set a goal.' }] },
      { de: 'der Zweck', en: 'purpose', hint: 'Reason for', examples: [{ de: 'Dem Zweck dienen.', en: 'Serve the purpose.' }] },
      { de: 'die Absicht', en: 'intention', hint: 'Plan', examples: [{ de: 'In guter Absicht.', en: 'With good intention.' }] },
      { de: 'die Ursache', en: 'cause', hint: 'Reason', examples: [{ de: 'Die Ursache des Problems.', en: 'The cause of the problem.' }] },
      { de: 'die Wirkung', en: 'effect', hint: 'Result', examples: [{ de: 'Ursache und Wirkung.', en: 'Cause and effect.' }] },
      { de: 'die Folge', en: 'consequence', hint: 'Result', examples: [{ de: 'Die Folgen tragen.', en: 'Bear the consequences.' }] },
      { de: 'der Grund', en: 'reason', hint: 'Motive', examples: [{ de: 'Aus diesem Grund.', en: 'For this reason.' }] },
      { de: 'der Zusammenhang', en: 'context', hint: 'Relation', examples: [{ de: 'Im Zusammenhang mit.', en: 'In connection with.' }] },
      { de: 'der Unterschied', en: 'difference', hint: 'Dissimilarity', examples: [{ de: 'Einen Unterschied machen.', en: 'Make a difference.' }] },
      { de: 'die Ähnlichkeit', en: 'similarity', hint: 'Resemblance', examples: [{ de: 'Eine gewisse Ähnlichkeit.', en: 'A certain similarity.' }] },
      { de: 'das Beispiel', en: 'example', hint: 'Illustration', examples: [{ de: 'Zum Beispiel.', en: 'For example.' }] },
      { de: 'der Fall', en: 'case', hint: 'Instance', examples: [{ de: 'In diesem Fall.', en: 'In this case.' }] },
      { de: 'die Situation', en: 'situation', hint: 'Circumstances', examples: [{ de: 'Eine schwierige Situation.', en: 'A difficult situation.' }] },
      { de: 'die Lage', en: 'situation', hint: 'State of affairs', examples: [{ de: 'Über die Lage informieren.', en: 'Inform about the situation.' }] },
      { de: 'der Zustand', en: 'condition', hint: 'State', examples: [{ de: 'In gutem Zustand.', en: 'In good condition.' }] },
      { de: 'die Realität', en: 'reality', hint: 'Actual world', examples: [{ de: 'Der Realität ins Auge sehen.', en: 'Face reality.' }] },
      { de: 'die Wirklichkeit', en: 'reality', hint: 'Real world', examples: [{ de: 'In der Wirklichkeit.', en: 'In reality.' }] },
      { de: 'die Illusion', en: 'illusion', hint: 'False belief', examples: [{ de: 'Sich Illusionen machen.', en: 'Make illusions.' }] },
      { de: 'der Traum', en: 'dream', hint: 'Sleep vision', examples: [{ de: 'Einen Traum haben.', en: 'Have a dream.' }] },
      { de: 'die Fantasie', en: 'imagination', hint: 'Creative thought', examples: [{ de: 'Seiner Fantasie freien Lauf lassen.', en: 'Let his imagination run wild.' }] },
      { de: 'die Kreativität', en: 'creativity', hint: 'Innovation', examples: [{ de: 'Kreativität fördern.', en: 'Promote creativity.' }] },
      { de: 'die Inspiration', en: 'inspiration', hint: 'Creative spark', examples: [{ de: 'Inspiration finden.', en: 'Find inspiration.' }] },
      { de: 'das Talent', en: 'talent', hint: 'Natural ability', examples: [{ de: 'Ein Talent für Musik.', en: 'A talent for music.' }] },
      { de: 'die Fähigkeit', en: 'ability', hint: 'Skill', examples: [{ de: 'Fähigkeiten entwickeln.', en: 'Develop abilities.' }] },
      { de: 'die Fertigkeit', en: 'skill', hint: 'Learned ability', examples: [{ de: 'Praktische Fertigkeiten.', en: 'Practical skills.' }] },
      { de: 'die Kompetenz', en: 'competence', hint: 'Proficiency', examples: [{ de: 'Fachliche Kompetenz.', en: 'Technical competence.' }] },
      { de: 'das Wissen', en: 'knowledge', hint: 'What you know', examples: [{ de: 'Wissen vermitteln.', en: 'Convey knowledge.' }] },
      { de: 'die Weisheit', en: 'wisdom', hint: 'Deep understanding', examples: [{ de: 'Mit Weisheit handeln.', en: 'Act with wisdom.' }] },
      { de: 'die Erfahrung', en: 'experience', hint: 'Practical knowledge', examples: [{ de: 'Aus Erfahrung lernen.', en: 'Learn from experience.' }] },
      { de: 'die Erkenntnis', en: 'insight', hint: 'Realization', examples: [{ de: 'Eine wichtige Erkenntnis.', en: 'An important insight.' }] },
      { de: 'das Bewusstsein', en: 'consciousness', hint: 'Awareness', examples: [{ de: 'Das Bewusstsein schärfen.', en: 'Sharpen awareness.' }] },
      { de: 'die Aufmerksamkeit', en: 'attention', hint: 'Focus', examples: [{ de: 'Aufmerksamkeit schenken.', en: 'Pay attention.' }] },
      { de: 'die Konzentration', en: 'concentration', hint: 'Focus', examples: [{ de: 'Die Konzentration verlieren.', en: 'Lose concentration.' }] },
      { de: 'die Wahrnehmung', en: 'perception', hint: 'How you see', examples: [{ de: 'Die Wahrnehmung der Realität.', en: 'The perception of reality.' }] },
      { de: 'das Verständnis', en: 'understanding', hint: 'Comprehension', examples: [{ de: 'Verständnis zeigen.', en: 'Show understanding.' }] },
      { de: 'die Einsicht', en: 'insight', hint: 'Understanding', examples: [{ de: 'Zur Einsicht kommen.', en: 'Come to insight.' }] },
      { de: 'die Vernunft', en: 'reason', hint: 'Rationality', examples: [{ de: 'Vernunft walten lassen.', en: 'Use reason.' }] },
      { de: 'die Logik', en: 'logic', hint: 'Rational thought', examples: [{ de: 'Der Logik folgen.', en: 'Follow logic.' }] },
      { de: 'die Intuition', en: 'intuition', hint: 'Gut feeling', examples: [{ de: 'Auf die Intuition hören.', en: 'Listen to intuition.' }] },
      { de: 'das Gewissen', en: 'conscience', hint: 'Inner voice', examples: [{ de: 'Ein schlechtes Gewissen.', en: 'A guilty conscience.' }] },
      { de: 'die Moral', en: 'morals', hint: 'Right/wrong', examples: [{ de: 'Gegen die Moral verstoßen.', en: 'Violate morals.' }] },
      { de: 'die Ethik', en: 'ethics', hint: 'Moral principles', examples: [{ de: 'Ethische Fragen.', en: 'Ethical questions.' }] },
      { de: 'die Wahrheit', en: 'truth', hint: 'Reality', examples: [{ de: 'Die Wahrheit sagen.', en: 'Tell the truth.' }] },
      { de: 'die Lüge', en: 'lie', hint: 'Falsehood', examples: [{ de: 'Eine Lüge erzählen.', en: 'Tell a lie.' }] },
      { de: 'lügen', en: 'to lie', hint: 'Tell untruth', examples: [{ de: 'Er lügt oft.', en: 'He often lies.' }] },
      { de: 'ehrlich', en: 'honest', hint: 'Truthful', examples: [{ de: 'Sei ehrlich zu mir.', en: 'Be honest with me.' }] },
      { de: 'die Ehrlichkeit', en: 'honesty', hint: 'Truthfulness', examples: [{ de: 'Ehrlichkeit währt am längsten.', en: 'Honesty is the best policy.' }] },
      { de: 'fair', en: 'fair', hint: 'Just', examples: [{ de: 'Ein faires Angebot.', en: 'A fair offer.' }] },
      { de: 'die Fairness', en: 'fairness', hint: 'Justice', examples: [{ de: 'Für Fairness sorgen.', en: 'Ensure fairness.' }] },
      { de: 'gerecht', en: 'just', hint: 'Fair', examples: [{ de: 'Eine gerechte Entscheidung.', en: 'A just decision.' }] },
      { de: 'die Gerechtigkeit', en: 'justice', hint: 'Fairness', examples: [{ de: 'Soziale Gerechtigkeit.', en: 'Social justice.' }] },
      { de: 'die Freiheit', en: 'freedom', hint: 'Liberty', examples: [{ de: 'In Freiheit leben.', en: 'Live in freedom.' }] },
      { de: 'die Gleichheit', en: 'equality', hint: 'Same rights', examples: [{ de: 'Gleichheit aller Menschen.', en: 'Equality of all people.' }] },
      { de: 'die Ungleichheit', en: 'inequality', hint: 'Not equal', examples: [{ de: 'Soziale Ungleichheit.', en: 'Social inequality.' }] },
      { de: 'der Frieden', en: 'peace', hint: 'No war', examples: [{ de: 'In Frieden leben.', en: 'Live in peace.' }] },
      { de: 'der Krieg', en: 'war', hint: 'Armed conflict', examples: [{ de: 'Krieg führen.', en: 'Wage war.' }] },
    ],
    quiz: [
      // Original B1 quiz entries (2)
      {
        question: 'What does “obwohl” express in a sentence?',
        correct: 'Contrast (although)',
        options: [
          'Reason (because)',
          'Time (when)',
          'Condition (if)',
          'Contrast (although)',
        ],
      },
      {
        question: 'Pick the best translation: “Er ist zuverlässig.”',
        correct: 'He is reliable.',
        options: [
          'He is funny.',
          'He is on time.',
          'He is reliable.',
          'He is lazy.',
        ],
      },
      // New B1 Quiz Questions (8 more to make 10 total, but adding several)
      {
        question: 'What does “die Herausforderung” mean?',
        correct: 'the challenge',
        options: ['the experience', 'the challenge', 'the responsibility', 'the difficulty'],
      },
      {
        question: 'How do you say “to apply for a job” in German?',
        correct: 'sich bewerben',
        options: ['sich bewerben', 'sich anstellen', 'sich verabschieden', 'sich verändern'],
      },
      {
        question: 'What does “verantwortlich” mean?',
        correct: 'responsible',
        options: ['responsible', 'reliable', 'experienced', 'difficult'],
      },
      {
        question: 'Which word means “experience” (as in life experience)?',
        correct: 'die Erfahrung',
        options: ['die Erfahrung', 'das Erlebnis', 'das Wissen', 'die Kenntnis'],
      },
      {
        question: 'What does “die Bewerbung” mean?',
        correct: 'the application',
        options: ['the job', 'the application', 'the interview', 'the position'],
      },
      {
        question: 'How do you say “I would like to apply for this position”?',
        correct: 'Ich möchte mich auf diese Stelle bewerben.',
        options: [
          'Ich möchte diese Stelle haben.',
          'Ich möchte mich auf diese Stelle bewerben.',
          'Ich interessiere mich für die Stelle.',
          'Ich suche eine Stelle.',
        ],
      },
      {
        question: 'What does “die Kenntnisse” mean?',
        correct: 'knowledge/skills',
        options: ['acquaintances', 'knowledge/skills', 'experiences', 'abilities'],
      },
      {
        question: 'Which of these is a subordinating conjunction meaning “because”?',
        correct: 'weil',
        options: ['denn', 'weil', 'deshalb', 'trotzdem'],
      },
      {
        question: 'What does “trotzdem” mean?',
        correct: 'nevertheless',
        options: ['although', 'nevertheless', 'because', 'therefore'],
      },
      {
        question: 'How do you say “I am responsible for the project”?',
        correct: 'Ich bin verantwortlich für das Projekt.',
        options: [
          'Ich bin zuständig für das Projekt.',
          'Ich bin verantwortlich für das Projekt.',
          'Ich mache das Projekt.',
          'Das Projekt gehört mir.',
        ],
      },
      {
        question: 'What does “die Fähigkeit” mean?',
        correct: 'ability',
        options: ['ability', 'skill', 'knowledge', 'talent'],
      },
      {
        question: 'Which word means “to improve”?',
        correct: 'verbessern',
        options: ['verbessern', 'verschlechtern', 'verändern', 'verstehen'],
      },
      {
        question: 'What does “die Gesellschaft” mean?',
        correct: 'society',
        options: ['company', 'society', 'community', 'association'],
      },
      {
        question: 'How do you say “in my opinion”?',
        correct: 'meiner Meinung nach',
        options: ['meine Meinung', 'meiner Meinung nach', 'ich meine', 'nach meiner Meinung'],
      },
      {
        question: 'What does “die Umwelt” mean?',
        correct: 'environment',
        options: ['world', 'environment', 'surroundings', 'nature'],
      },
      {
        question: 'Which word means “sustainable”?',
        correct: 'nachhaltig',
        options: ['haltbar', 'nachhaltig', 'dauerhaft', 'langfristig'],
      },
    ],
  },
};

const initialProgress = {
  stats: LEVELS.reduce(
    (acc, level) => ({
      ...acc,
      [level]: {
        flashcardsSeen: 0,
        flashcardsKnown: 0,
        quizPlayed: 0,
        quizCorrect: 0,
        currentFlashcardIndex: 0,
        currentQuizIndex: 0,
      },
    }),
    {},
  ),
}

function chunkArray(arr, size) {
  const result = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

function getQuizzesForLevel(level) {
  const quizArr = WORD_SETS[level]?.quiz ?? []
  return chunkArray(quizArr, 7).map((questions, i) => ({
    id: String(i + 1),
    name: `Quiz ${i + 1}`,
    questions,
  }))
}

function loadProgress() {
  try {
    if (typeof window === 'undefined') return initialProgress
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialProgress
    const parsed = JSON.parse(raw)
    return { ...initialProgress, ...parsed }
  } catch {
    return initialProgress
  }
}

function saveProgress(progress) {
  try {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // ignore write failures
  }
}

function useGameProgress() {
  const [progress, setProgress] = useState(() => loadProgress())

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const updateLevel = useCallback((level, updater) => {
    setProgress((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [level]: updater(prev.stats[level]),
      },
    }))
  }, [])

  return { progress, updateLevel }
}

function ProgressBadges({ stats }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {LEVELS.map((level) => {
        const s = stats[level]
        const flashRate = s.flashcardsSeen
          ? Math.round((s.flashcardsKnown / s.flashcardsSeen) * 100)
          : 0
        const quizRate = s.quizPlayed
          ? Math.round((s.quizCorrect / s.quizPlayed) * 100)
          : 0

        return (
          <div
            key={level}
            className="group relative overflow-hidden rounded-2xl bg-gray-800/50 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gray-900/50"
          >
            <div className="absolute inset-0 bg-gray-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Level
                  </p>
                  <p className="text-2xl font-bold text-white">{level}</p>
                </div>
                <div className="text-right text-xs space-y-1">
                  <p className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-gray-400" />
                    <span className="text-gray-300">Flash:</span>
                    <span className="font-semibold text-gray-300">
                      {flashRate}%
                    </span>
                  </p>
                  <p className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-gray-400" />
                    <span className="text-gray-300">Quiz:</span>
                    <span className="font-semibold text-gray-300">
                      {quizRate}%
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function LevelSelector({ currentLevel, onSelect }) {
  return (
    <div className="inline-flex gap-2 rounded-2xl bg-gray-800/50 p-1.5 backdrop-blur-sm">
      {LEVELS.map((level) => (
        <button
          key={level}
          type="button"
          onClick={() => onSelect(level)}
          className={`relative px-5 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
            currentLevel === level
              ? 'text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          {currentLevel === level && (
            <span className="absolute inset-0 rounded-xl bg-gray-600 shadow-lg shadow-gray-900/25 animate-pulse-slow" />
          )}
          <span className="relative">{level}</span>
        </button>
      ))}
    </div>
  )
}

function FlashcardGame({ level, onKnownWord, onSeenWord, stats, onIndexChange }) {
  const allCards = WORD_SETS[level].flashcards
  const categories = FLASHCARD_CATEGORIES[level] ?? []
  const [selectedCategoryId, setSelectedCategoryId] = useState('all')
  const [index, setIndex] = useState(() => (stats?.currentFlashcardIndex ?? 0))
  const [showAnswer, setShowAnswer] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copiedExamplePart, setCopiedExamplePart] = useState(null) // { index, part: 'de'|'en' }

  const copyToClipboard = useCallback((text) => {
    if (typeof navigator?.clipboard?.writeText !== 'function') return
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }, [])

  const copyExampleToClipboard = useCallback((text, exampleIdx, part) => {
    if (typeof navigator?.clipboard?.writeText !== 'function') return
    navigator.clipboard.writeText(text).then(() => {
      setCopiedExamplePart({ index: exampleIdx, part })
      setTimeout(() => setCopiedExamplePart(null), 2000)
    }).catch(() => {})
  }, [])

  const categoryConfig = categories.find((c) => c.id === selectedCategoryId) ?? categories[0]
  const cards = useMemo(() => {
    if (!categoryConfig || categoryConfig.count === null) return allCards
    const end = categoryConfig.start + categoryConfig.count
    return allCards.slice(categoryConfig.start, Math.min(end, allCards.length))
  }, [allCards, categoryConfig])

  useEffect(() => {
    setSelectedCategoryId('all')
    setIndex(stats?.currentFlashcardIndex ?? 0)
    setShowAnswer(false)
  }, [level])

  // When switching category: reset to 0 for specific category, sync from stats for "all"
  useEffect(() => {
    if (selectedCategoryId === 'all') {
      const nextIndex = Math.min(stats?.currentFlashcardIndex ?? 0, allCards.length - 1)
      setIndex(Math.max(0, nextIndex))
    } else {
      setIndex(0)
    }
    setShowAnswer(false)
  }, [selectedCategoryId])

  // Only sync index from stats when viewing "all" – don’t reset when navigating in category mode
  useEffect(() => {
    if (selectedCategoryId === 'all') {
      const nextIndex = Math.min(stats?.currentFlashcardIndex ?? 0, allCards.length - 1)
      setIndex(Math.max(0, nextIndex))
    }
  }, [selectedCategoryId, stats?.currentFlashcardIndex, allCards.length])

  useEffect(() => {
    onSeenWord()
  }, [index, onSeenWord])

  const safeIndex = Math.min(index, Math.max(0, cards.length - 1))
  const card = cards[safeIndex]

  if (!card) {
    return (
      <div className="rounded-3xl bg-gray-800 p-8 text-center text-gray-400">
        No flashcards in this category. Try another category or level.
      </div>
    )
  }

  const viewedCount =
    stats && typeof stats.currentFlashcardIndex === 'number'
      ? stats.currentFlashcardIndex + 1
      : stats?.flashcardsSeen ?? 0

  const getGlobalIndex = (localIdx) =>
    categoryConfig?.count === null ? localIdx : (categoryConfig?.start ?? 0) + localIdx

  const goNext = () => {
    setShowAnswer(false)
    setIndex((i) => {
      const next = (i + 1) % cards.length
      if (onIndexChange) onIndexChange(getGlobalIndex(next))
      return next
    })
  }

  const goPrevious = () => {
    setIsFlipping(true)
    setTimeout(() => {
      setShowAnswer(false)
      setIndex((i) => {
        const next = (i - 1 + cards.length) % cards.length
        if (onIndexChange) onIndexChange(getGlobalIndex(next))
        return next
      })
      setIsFlipping(false)
    }, 300)
  }

  const handleKnown = () => {
    onKnownWord()
    goNext()
  }

  const toggleAnswer = () => {
    setIsFlipping(true)
    setTimeout(() => {
      setShowAnswer((s) => !s)
      setIsFlipping(false)
    }, 150)
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        className={`transform transition-all duration-300 ${
          isFlipping ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
        }`}
      >
        <div className="relative overflow-hidden rounded-3xl bg-gray-800 p-8 shadow-2xl">
          <div className={'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-20'} />
          
          <div className="relative">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="rounded-full bg-gray-700 px-3 py-1 text-xs font-medium text-gray-300">
                  Flashcard {safeIndex + 1}/{cards.length}
                </span>
                <span className="text-sm text-gray-400">Level {level}</span>
                {categories.length > 1 && (
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="rounded-lg border-0 bg-gray-700 px-2.5 py-1 text-xs font-medium text-gray-200 focus:ring-2 focus:ring-gray-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              <p className="text-4xl font-bold text-white">{card.de}</p>
              <button
                type="button"
                onClick={() => copyToClipboard(card.de)}
                title="Copy German word"
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  copied
                    ? 'bg-green-600/30 text-green-300'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                {copied ? (
                  <>
                    <span aria-hidden>✓</span>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <span aria-hidden>⎘</span>
                    <span>Copy</span>
                  </>
                )}
              </button>
              <a
                href={`https://translate.google.com/?sl=de&tl=en&text=${encodeURIComponent(card.de)}&op=translate`}
                title="Open in Google Translate"
                className="inline-flex items-center gap-1.5 rounded-lg bg-gray-700 px-3 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-gray-600 hover:text-white"
              >
                <span aria-hidden>🌐</span>
                <span>Translate</span>
              </a>
            </div>

            {showAnswer ? (
              <div className="space-y-4 animate-fade-in">
                <div className="rounded-xl bg-gray-700/50 p-4">
                  <p className="text-lg text-gray-200">{card.en}</p>
                  {card.hint && (
                    <p className="mt-2 text-sm text-gray-400">
                      {card.hint}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {card.examples && card.examples.length > 0 && (
                  <div className="space-y-3">
                    {(card.gender || card.plural) && (
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                        {card.gender && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-700/70 px-2.5 py-1 text-xs font-medium">
                            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                            <span>Gender: {card.gender}</span>
                          </span>
                        )}
                        {card.plural && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-700/70 px-2.5 py-1 text-xs font-medium">
                            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                            <span>Plural: {card.plural}</span>
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Examples
                    </p>
                    {card.examples.map((example, idx) => {
                      const deCopied = copiedExamplePart?.index === idx && copiedExamplePart?.part === 'de'
                      const enCopied = copiedExamplePart?.index === idx && copiedExamplePart?.part === 'en'
                      return (
                        <div key={idx} className="rounded-lg bg-gray-700/30 p-3">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <p className="text-gray-200 min-w-0 max-w-full">{example.de}</p>
                            <div className="flex flex-shrink-0 flex-grow-0 items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => copyExampleToClipboard(example.de, idx, 'de')}
                                title="Copy German example"
                                className={`inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-all duration-200 ${
                                  deCopied
                                    ? 'bg-green-600/30 text-green-300'
                                    : 'bg-gray-600/80 text-gray-300 hover:bg-gray-600 hover:text-white'
                                }`}
                              >
                                {deCopied ? '✓ Copied!' : '⎘ Copy'}
                              </button>
                              <a
                                href={`https://translate.google.com/?sl=de&tl=en&text=${encodeURIComponent(example.de)}&op=translate`}
                                title="Open German example in Google Translate"
                                className="inline-flex items-center gap-1 rounded-lg bg-gray-600/80 px-2 py-1.5 text-xs font-medium text-gray-300 transition-all duration-200 hover:bg-gray-600 hover:text-white"
                              >
                                🌐 Translate
                              </a>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap items-start justify-between gap-2">
                            <p className="mt-1 min-w-0 max-w-full text-sm text-gray-400">
                              {example.en}
                            </p>
                            <button
                              type="button"
                              onClick={() => copyExampleToClipboard(example.en, idx, 'en')}
                              title="Copy English translation"
                              className={`flex-shrink-0 inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-all duration-200 ${
                                enCopied
                                  ? 'bg-green-600/30 text-green-300'
                                  : 'bg-gray-600/80 text-gray-300 hover:bg-gray-600 hover:text-white'
                              }`}
                            >
                              {enCopied ? '✓ Copied!' : '⎘ Copy'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={toggleAnswer}
          className="group relative inline-flex w-full sm:w-auto items-center justify-center overflow-hidden rounded-xl bg-gray-700 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          <span className="absolute inset-0 bg-gray-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative flex items-center gap-2">
            {showAnswer ? 'Hide answer' : 'Show answer'}
          </span>
        </button>
        
        <button
          type="button"
          onClick={goPrevious}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gray-700 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          <span className="absolute inset-0 bg-gray-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative flex items-center gap-2">
            Previous
          </span>
        </button>
        
        <button
          type="button"
          onClick={handleKnown}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gray-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-gray-900/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gray-900/40"
        >
          <span className="absolute inset-0 bg-gray-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative flex items-center gap-2">
            Next
          </span>
        </button>
      </div>

      {stats && (
        <div className="mt-2 text-center text-xs text-gray-400">
          Viewed so far:{' '}
          <span className="font-semibold text-gray-200">{viewedCount}</span>{' '}
          cards · Known: <span className="font-semibold text-gray-200">{stats.flashcardsKnown}</span>
        </div>
      )}
    </div>
  )
}

function QuizGame({ level, onAnswer, stats }) {
  const allQuizzes = useMemo(() => getQuizzesForLevel(level), [level])
  const [selectedQuizId, setSelectedQuizId] = useState('1')
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState('')
  const [answered, setAnswered] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  const currentQuiz = allQuizzes.find((q) => q.id === selectedQuizId) ?? allQuizzes[0]
  const questions = currentQuiz?.questions ?? []

  useEffect(() => {
    setSelectedQuizId('1')
    setIndex(0)
    setSelected('')
    setAnswered(false)
    setCompleted(false)
    setCorrectCount(0)
  }, [level])

  useEffect(() => {
    setIndex(0)
    setSelected('')
    setAnswered(false)
    setCompleted(false)
    setCorrectCount(0)
  }, [selectedQuizId])

  const q = questions[index]

  if (!q) {
    return (
      <div className="rounded-3xl bg-gray-800 p-8 text-center text-gray-400">
        No quiz questions available. Try another level.
      </div>
    )
  }

  const shuffledOptions = useMemo(
    () => [...q.options].sort(() => Math.random() - 0.5),
    [index, selectedQuizId],
  )

  const submit = () => {
    if (!selected || answered) return
    const isCorrect = selected === q.correct
    setAnswered(true)
    if (isCorrect) {
      setCorrectCount((c) => c + 1)
    }
    onAnswer(isCorrect)
    if (index === questions.length - 1) {
      setCompleted(true)
    }
  }

  const next = () => {
    if (index === questions.length - 1) {
      setCompleted(true)
      return
    }
    setSelected('')
    setAnswered(false)
    setIndex((i) => i + 1)
  }

  const restart = () => {
    setIndex(0)
    setSelected('')
    setAnswered(false)
    setCompleted(false)
    setCorrectCount(0)
  }

  return (
    <div className="flex flex-col gap-6">
      {allQuizzes.length > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-400">Select quiz:</span>
          <div className="inline-flex gap-1.5 rounded-xl bg-gray-800/50 p-1.5 backdrop-blur-sm">
            {allQuizzes.map((quiz) => (
              <button
                key={quiz.id}
                type="button"
                onClick={() => setSelectedQuizId(quiz.id)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  selectedQuizId === quiz.id
                    ? 'bg-gray-600 text-white shadow-md'
                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                }`}
              >
                {quiz.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative overflow-hidden rounded-3xl bg-gray-800 p-8 shadow-2xl">
        <div className={'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-20'} />
        
        <div className="relative">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full bg-gray-700 px-3 py-1 text-xs font-medium text-gray-300">
              {currentQuiz?.name} · Question {index + 1}/{questions.length}
            </span>
          </div>

          <p className="mb-6 text-xl font-medium text-white">{q.question}</p>

          <div className="space-y-3">
            {shuffledOptions.map((option) => {
              const isSelected = option === selected
              const isCorrect = option === q.correct
              
              let buttonClasses = "w-full text-left rounded-xl border-2 p-4 transition-all duration-300"
              
              if (answered) {
                if (isCorrect) {
                  buttonClasses += " border-green-500 bg-green-500/20 text-green-200"
                } else if (isSelected && !isCorrect) {
                  buttonClasses += " border-red-500 bg-red-500/20 text-red-200"
                } else {
                  buttonClasses += " border-gray-700 text-gray-400 opacity-50"
                }
              } else {
                buttonClasses += isSelected
                  ? " border-gray-400 bg-gray-700/50 text-white"
                  : " border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-700/30"
              }

              return (
                <button
                  key={option}
                  type="button"
                  disabled={answered}
                  onClick={() => setSelected(option)}
                  className={buttonClasses}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-current text-xs">
                      {String.fromCharCode(65 + shuffledOptions.indexOf(option))}
                    </span>
                    {option}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={submit}
          disabled={!selected || answered}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gray-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-gray-900/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gray-900/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="absolute inset-0 bg-gray-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative flex items-center gap-2">
            Check answer
          </span>
        </button>

        {answered && !completed && (
          <button
            type="button"
            onClick={next}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gray-700 px-8 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <span className="absolute inset-0 bg-gray-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative flex items-center gap-2">
              Next question →
            </span>
          </button>
        )}
      </div>

      {completed && (
        <div className="rounded-3xl bg-gray-900/70 p-6 text-center shadow-xl">
          <h2 className="mb-3 text-2xl font-bold text-white">Quiz complete!</h2>
          <p className="mb-2 text-sm text-gray-200">
            You answered{' '}
            <span className="font-semibold text-white">{correctCount}</span> out of{' '}
            <span className="font-semibold text-white">{questions.length}</span> questions correctly.
          </p>
          <p className="mb-6 text-sm text-gray-400">
            Your score:{' '}
            <span className="font-semibold text-white">
              {questions.length
                ? Math.round((correctCount / questions.length) * 100)
                : 0}
              %
            </span>
          </p>
          {stats && (
            <div className="mb-6 text-xs text-gray-400">
              Total answered so far:{' '}
              <span className="font-semibold text-gray-200">{stats.quizPlayed}</span> · Total correct:{' '}
              <span className="font-semibold text-gray-200">{stats.quizCorrect}</span> · Overall accuracy:{' '}
              <span className="font-semibold text-gray-200">
                {stats.quizPlayed
                  ? Math.round((stats.quizCorrect / stats.quizPlayed) * 100)
                  : 0}
                %
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center justify-center rounded-xl bg-gray-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-gray-900/30 transition-all duration-300 hover:scale-105 hover:bg-gray-500"
          >
            Restart quiz
          </button>
        </div>
      )}
    </div>
  )
}

function App() {
  const { progress, updateLevel } = useGameProgress()
  const [level, setLevel] = useState('A1')
  const [activeTab, setActiveTab] = useState('flashcards')

  const currentStats = progress.stats[level]

  const handleSeenWord = useCallback(() => {
    updateLevel(level, (s) => ({
      ...s,
      flashcardsSeen: s.flashcardsSeen + 1,
    }))
  }, [level, updateLevel])

  const handleKnownWord = useCallback(() => {
    updateLevel(level, (s) => ({
      ...s,
      flashcardsKnown: s.flashcardsKnown + 1,
    }))
  }, [level, updateLevel])

  const handleFlashcardIndexChange = useCallback(
    (newIndex) => {
      updateLevel(level, (s) => ({
        ...s,
        currentFlashcardIndex: newIndex,
      }))
    },
    [level, updateLevel],
  )

  const handleQuizAnswer = useCallback(
    (isCorrect) => {
      updateLevel(level, (s) => ({
        ...s,
        quizPlayed: s.quizPlayed + 1,
        quizCorrect: s.quizCorrect + (isCorrect ? 1 : 0),
      }))
    },
    [level, updateLevel],
  )

  return (
    <div className="min-h-screen bg-gray-950">
      <div className={'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.02"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')]'} />
      
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-gray-700 px-3 py-1 text-xs font-bold text-white">
                German Learning
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Learn German with Play
            </h1>
            <p className="mt-2 max-w-2xl text-gray-400">
              Practice vocabulary and grammar with interactive flashcards and quizzes.
              Progress is saved automatically in your browser.
            </p>
          </div>
          <LevelSelector currentLevel={level} onSelect={setLevel} />
        </header>

        <main className="grid gap-8 lg:grid-cols-[1fr,320px]">
          <section className="space-y-6">
            <div className="flex gap-2 rounded-2xl bg-gray-800/50 p-1.5 backdrop-blur-sm w-fit">
              <button
                type="button"
                onClick={() => setActiveTab('flashcards')}
                className={`relative rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                  activeTab === 'flashcards'
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {activeTab === 'flashcards' && (
                  <span className="absolute inset-0 rounded-xl bg-gray-600" />
                )}
                <span className="relative flex items-center gap-2">
                  Flashcards
                </span>
              </button>
              
              <button
                type="button"
                onClick={() => setActiveTab('quiz')}
                className={`relative rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                  activeTab === 'quiz'
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {activeTab === 'quiz' && (
                  <span className="absolute inset-0 rounded-xl bg-gray-600" />
                )}
                <span className="relative flex items-center gap-2">
                  Quiz
                </span>
              </button>
            </div>

            {activeTab === 'flashcards'
              ? (
                <FlashcardGame
                  level={level}
                  stats={currentStats}
                  onSeenWord={handleSeenWord}
                  onKnownWord={handleKnownWord}
                  onIndexChange={handleFlashcardIndexChange}
                />
              )
              : (
                <QuizGame
                  level={level}
                  stats={currentStats}
                  onAnswer={handleQuizAnswer}
                />
              )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl bg-gray-800/30 p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white">Your Progress</h2>
              <p className="mt-1 text-sm text-gray-400">
                Track your learning journey
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-gray-300">Flashcards</span>
                    <span className="font-medium text-white">
                      {currentStats.flashcardsKnown} / {currentStats.flashcardsSeen || WORD_SETS[level].flashcards.length}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-700">
                    <div
                      className="h-full rounded-full bg-gray-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          currentStats.flashcardsSeen
                            ? (currentStats.flashcardsKnown /
                                currentStats.flashcardsSeen) *
                                100
                            : 0,
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-gray-300">Quiz Accuracy</span>
                    <span className="font-medium text-white">
                      {currentStats.quizPlayed
                        ? `${Math.round(
                            (currentStats.quizCorrect /
                              currentStats.quizPlayed) *
                              100,
                          )}%`
                        : '0%'}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-700">
                    <div
                      className="h-full rounded-full bg-gray-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          currentStats.quizPlayed
                            ? (currentStats.quizCorrect /
                                currentStats.quizPlayed) *
                                100
                            : 0,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <ProgressBadges stats={progress.stats} />
            </div>

            <div className="rounded-2xl bg-gray-800/30 p-6 backdrop-blur-sm">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                Study Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                  Say each German word out loud three times
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                  Create your own sentences with new words
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                  Practice daily for best results
                </li>
              </ul>
            </div>
          </aside>
        </main>

        <footer className="mt-12 flex items-center justify-between border-t border-gray-800 pt-6 text-xs text-gray-500">
          <span>✨ Progress saved locally in your browser</span>
          <span>Based on CEFR levels: A1 · A2 · B1</span>
        </footer>
      </div>
    </div>
  )
}

export default App