import { Act } from '../types';

export const CENTRAL_ACTS: Act[] = [
  {
    id: "constitution-1950",
    title: "The Constitution of India, 1950",
    shortTitle: "Constitution of India",
    year: 1950,
    type: "central",
    category: "Constitutional",
    description: "The supreme law of India, laying down the framework demarking fundamental political code, structure, procedures, powers, and duties of government institutions, and sets out fundamental rights, directive principles, and the duties of citizens.",
    chapters: [
      {
        id: "const-ch3",
        number: "Part III",
        title: "Fundamental Rights",
        sections: [
          {
            id: "const-art14",
            actId: "constitution-1950",
            number: "Article 14",
            title: "Equality before law",
            text: "The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.",
            keywords: ["equality", "discrimination", "justice", "fundamental rights", "reasonable classification", "arbitrariness"],
            crossReferences: ["const-art19", "const-art21"]
          },
          {
            id: "const-art19",
            actId: "constitution-1950",
            number: "Article 19",
            title: "Protection of certain rights regarding freedom of speech, etc.",
            text: "All citizens shall have the right—\n(a) to freedom of speech and expression;\n(b) to assemble peaceably and without arms;\n(c) to form associations or unions or co-operative societies;\n(d) to move freely throughout the territory of India;\n(e) to reside and settle in any part of the territory of India; and\n(g) to practise any profession, or to carry on any occupation, trade or business.\n\nNothing in sub-clause (a) shall affect the operation of any existing law, or prevent the State from making any law, in so far as such law imposes reasonable restrictions on the exercise of the right conferred by the said sub-clause in the interests of the sovereignty and integrity of India, the security of the State, friendly relations with foreign States, public order, decency or morality or in relation to contempt of court, defamation or incitement to an offence.",
            keywords: ["speech", "expression", "freedom", "assembly", "association", "trade", "profession", "reasonable restriction"],
            crossReferences: ["const-art14", "const-art21", "it-66a"]
          },
          {
            id: "const-art21",
            actId: "constitution-1950",
            number: "Article 21",
            title: "Protection of life and personal liberty",
            text: "No person shall be deprived of his life or personal liberty except according to procedure established by law.",
            keywords: ["life", "liberty", "privacy", "due process", "dignity", "arrest", "bail"],
            crossReferences: ["const-art14", "const-art19", "bnss-35", "bnss-480"]
          }
        ]
      },
      {
        id: "const-ch12",
        number: "Part XII",
        title: "Finance, Property, Contracts and Suits",
        sections: [
          {
            id: "const-art300a",
            actId: "constitution-1950",
            number: "Article 300A",
            title: "Persons not to be deprived of property save by authority of law",
            text: "No person shall be deprived of his property save by authority of law.",
            keywords: ["property", "deprivation", "compensation", "eminent domain", "acquisition"],
            crossReferences: ["contract-2", "contract-73"]
          }
        ]
      }
    ]
  },
  {
    id: "bns-2023",
    title: "The Bharatiya Nyaya Sanhita, 2023",
    shortTitle: "BNS, 2023",
    year: 2023,
    type: "central",
    category: "Criminal",
    description: "The primary penal code of India, replacing the Indian Penal Code (IPC) of 1860. It codifies substantive criminal law, defining offenses and prescribing punishments.",
    chapters: [
      {
        id: "bns-ch6",
        number: "Chapter VI",
        title: "Of Offences Affecting the Human Body",
        sections: [
          {
            id: "bns-sec103",
            actId: "bns-2023",
            number: "Section 103",
            title: "Punishment for murder",
            text: "(1) Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine.\n\n(2) When a group of five or more persons acting in concert commits murder on the ground of race, caste or community, sex, place of birth, language, personal belief or any other similar ground, each member of such group shall be punished with death or with imprisonment for life, and shall also be liable to fine.",
            oldSectionMapping: "IPC Section 302",
            keywords: ["murder", "punishment", "death penalty", "life imprisonment", "mob lynching", "homicide"],
            crossReferences: ["bnss-480", "bsa-57"]
          },
          {
            id: "bns-sec115",
            actId: "bns-2023",
            number: "Section 115",
            title: "Voluntarily causing hurt",
            text: "(1) Whoever does any act with the intention of thereby causing hurt to any person, or with the knowledge that he is likely thereby to cause hurt to any person, and does thereby cause hurt to any person, is said 'voluntarily to cause hurt'.\n\n(2) Whoever, except in the case provided for by section 122, voluntarily causes hurt, shall be punished with imprisonment of either description for a term which may extend to one year, or with fine which may extend to ten thousand rupees, or with both.",
            oldSectionMapping: "IPC Section 319, 321, 323",
            keywords: ["hurt", "bodily pain", "injury", "assault", "voluntarily", "fine"],
            crossReferences: ["bns-sec103", "bnss-35"]
          }
        ]
      },
      {
        id: "bns-ch17",
        number: "Chapter XVII",
        title: "Of Offences Against Property",
        sections: [
          {
            id: "bns-sec303",
            actId: "bns-2023",
            number: "Section 303",
            title: "Theft",
            text: "(1) Whoever, intending to take dishonestly any movable property out of the possession of any person without that person’s consent, moves that property in order to such taking, is said to commit theft.\n\n(2) Whoever commits theft shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both.\n\n(3) In case of second or subsequent conviction of any person under this section, he shall be punished with rigorous imprisonment for a term which shall not be less than one year but which may extend to five years, and with fine.",
            oldSectionMapping: "IPC Section 378, 379",
            keywords: ["theft", "property", "possession", "movable", "dishonest", "consent", "stealing"],
            crossReferences: ["bnss-35", "bnss-480"]
          }
        ]
      }
    ]
  },
  {
    id: "bnss-2023",
    title: "The Bharatiya Nagarik Suraksha Sanhita, 2023",
    shortTitle: "BNSS, 2023",
    year: 2023,
    type: "central",
    category: "Criminal",
    description: "The main legislation on procedure for administration of substantive criminal law in India, replacing the Code of Criminal Procedure (CrPC), 1973. It details arrest, investigation, bail, trial, and sentencing workflows.",
    chapters: [
      {
        id: "bnss-ch5",
        number: "Chapter V",
        title: "Arrest of Persons",
        sections: [
          {
            id: "bnss-sec35",
            actId: "bnss-2023",
            number: "Section 35",
            title: "When police may arrest without warrant",
            text: "(1) Any police officer may without an order from a Magistrate and without a warrant, arrest any person—\n(a) who commits, in the presence of a police officer, a cognizable offence;\n(b) against whom a reasonable complaint has been made, or credible information has been received, or a reasonable suspicion exists, that he has committed a cognizable offence punishable with imprisonment for a term which may be less than seven years or which may extend to seven years whether with or without fine, if the following conditions are satisfied, namely:—\n(i) the police officer has reason to believe on the basis of such complaint, information, or suspicion that such person has committed the said offence;\n(ii) the police officer is satisfied that such arrest is necessary—\n(a) to prevent such person from committing any further offence;\n(b) for proper investigation of the offence;\n(c) to prevent such person from causing the evidence of the offence to disappear or tampering with such evidence in any manner;\n(d) to prevent such person from making any inducement, threat or promise to any person acquainted with the facts of the case so as to dissuade him from disclosing such facts to the Court or to the police officer;\n(e) as unless such person is arrested, his presence in the Court whenever required cannot be assured.",
            oldSectionMapping: "CrPC Section 41",
            keywords: ["arrest", "warrant", "police powers", "cognizable", "safeguards", "investigation", "magistrate"],
            crossReferences: ["const-art21", "bnss-sec173", "bnss-sec480"]
          }
        ]
      },
      {
        id: "bnss-ch12",
        number: "Chapter XII",
        title: "Information to the Police and Their Powers to Investigate",
        sections: [
          {
            id: "bnss-sec173",
            actId: "bnss-2023",
            number: "Section 173",
            title: "Information in cognizable cases (FIR)",
            text: "(1) Every information relating to the commission of a cognizable offence, if given orally to an officer in charge of a police station, shall be reduced to writing by him or under his direction, and be read over to the informant; and every such information, whether given in writing or reduced to writing as aforesaid, shall be signed by the person giving it:\n\nProvided that if the information is given by the woman against whom an offence under section 64, section 65, section 66, section 67, section 68, section 69, section 70, section 71, section 124 of the Bharatiya Nyaya Sanhita, 2023 is alleged to have been committed or attempted, then such information shall be recorded by a woman police officer or any woman officer.\n\n(2) A copy of the information recorded under sub-section (1) shall be given forthwith, free of cost, to the informant.\n\n(3) Without prejudice to the provisions contained in sub-section (1), on receipt of information relating to the commission of any cognizable offence, which is punishable for seven years or more, the officer in charge of a police station may conduct a preliminary inquiry to ascertain whether there exists a prima facie case for proceeding in the matter.",
            oldSectionMapping: "CrPC Section 154",
            keywords: ["FIR", "first information report", "cognizable", "police station", "registration", "zero FIR", "preliminary inquiry"],
            crossReferences: ["bnss-sec35", "bsa-sec63"]
          }
        ]
      },
      {
        id: "bnss-ch35",
        number: "Chapter XXXV",
        title: "Provisions as to Bail and Bonds",
        sections: [
          {
            id: "bnss-sec480",
            actId: "bnss-2023",
            number: "Section 480",
            title: "When bail may be taken in case of non-bailable offence",
            text: "(1) When any person accused of, or suspected of, the commission of any non-bailable offence is arrested or detained without warrant by an officer in charge of a police station or appears or is brought before a Court other than the High Court or Court of Session, he may be released on bail, but—\n(i) such person shall not be so released if there appear reasonable grounds for believing that he has been guilty of an offence punishable with death or imprisonment for life;\n(ii) such person shall not be so released if such offence is a cognizable offence and he had been previously convicted of an offence punishable with death, imprisonment for life or imprisonment for seven years or more, or he had been previously convicted on two or more occasions of a cognizable offence punishable with imprisonment for three years or more but less than seven years:\n\nProvided that the Court may direct that a person referred to in clause (i) or clause (ii) be released on bail if such person is under the age of sixteen years or is a woman or is sick or infirm.",
            oldSectionMapping: "CrPC Section 437",
            keywords: ["bail", "non-bailable", "discretionary", "arrest", "warrant", "undertrial", "bonds"],
            crossReferences: ["const-art21", "bnss-sec35", "bns-sec103"]
          }
        ]
      }
    ]
  },
  {
    id: "bsa-2023",
    title: "The Bharatiya Sakshya Adhiniyam, 2023",
    shortTitle: "BSA, 2023",
    year: 2023,
    type: "central",
    category: "Criminal",
    description: "The primary law of evidence in India, replacing the Indian Evidence Act, 1872. It establishes rules regarding the admissibility of facts, witness testimony, and digital or electronic evidence.",
    chapters: [
      {
        id: "bsa-ch4",
        number: "Chapter IV",
        title: "Of Oral Evidence",
        sections: [
          {
            id: "bsa-sec57",
            actId: "bsa-2023",
            number: "Section 57",
            title: "Proof of facts by oral evidence",
            text: "All facts, except the contents of documents or electronic records, may be proved by oral evidence.",
            oldSectionMapping: "Evidence Act Section 59",
            keywords: ["oral evidence", "proof of facts", "witness", "testimony", "direct evidence", "hearsay"],
            crossReferences: ["bsa-sec63", "bns-sec103"]
          }
        ]
      },
      {
        id: "bsa-ch5",
        number: "Chapter V",
        title: "Of Documentary Evidence",
        sections: [
          {
            id: "bsa-sec63",
            actId: "bsa-2023",
            number: "Section 63",
            title: "Admissibility of electronic records",
            text: "(1) Notwithstanding anything contained in this Adhiniyam, any information contained in an electronic record which is printed on a paper, stored, recorded or copied in optical or magnetic media or any digital form produced by a computer shall be deemed to be also a document...\n\n(2) The electronic record shall be admissible in any proceedings, without further proof or production of the original, as evidence of any contents of the original or of any fact stated therein of which direct evidence would be admissible, if the conditions mentioned in this section are satisfied in relation to the information and computer in question.\n\n(3) The conditions referred to in sub-section (2) include:\n(a) the computer output containing the information was produced by the computer during the period over which the computer was used regularly to store or process information...\n(b) during the said period, information of the kind contained in the electronic record was regularly fed into the computer in the ordinary course of the said activities...",
            oldSectionMapping: "Evidence Act Section 65B",
            keywords: ["electronic record", "digital evidence", "admissibility", "certificate", "computer output", "65B certificate", "whatsapp evidence", "email"],
            crossReferences: ["bnss-sec173", "it-43a"]
          }
        ]
      }
    ]
  },
  {
    id: "contract-1872",
    title: "The Indian Contract Act, 1872",
    shortTitle: "Contract Act",
    year: 1872,
    type: "central",
    category: "Civil",
    description: "Defines the law relating to contracts in India. It codifies the rules regarding agreement formation, free consent, consideration, performance of contract, and consequences of a breach.",
    chapters: [
      {
        id: "contract-ch1",
        number: "Chapter I",
        title: "Of the Communication, Acceptance and Revocation of Proposals",
        sections: [
          {
            id: "contract-sec2",
            actId: "contract-1872",
            number: "Section 2",
            title: "Interpretation-clause",
            text: "In this Act the following words and expressions are used in the following senses, unless a contrary intention appears from the context:—\n(a) When one person signifies to another his willingness to do or to abstain from doing anything, with a view to obtaining the assent of that other to such act or abstinence, he is said to make a proposal;\n(b) When the person to whom the proposal is made signifies his assent thereto, the proposal is said to be accepted. A proposal, when accepted, becomes a promise;\n(d) When, at the desire of the promisor, the promisee or any other person has done or abstained from doing, or does or abstains from doing, or promises to do or to abstain from doing, something, such act or abstinence or promise is called a consideration for the promise;\n(h) An agreement enforceable by law is a contract;\n(i) An agreement which is enforceable by law at the option of one or more of the parties thereto, but not at the option of the other or others, is a voidable contract;\n(j) A contract which ceases to be enforceable by law becomes void when it ceases to be enforceable.",
            keywords: ["proposal", "acceptance", "promise", "consideration", "agreement", "contract", "void", "voidable"],
            crossReferences: ["contract-sec10", "contract-sec73"]
          },
          {
            id: "contract-sec10",
            actId: "contract-1872",
            number: "Section 10",
            title: "What agreements are contracts",
            text: "All agreements are contracts if they are made by the free consent of parties competent to contract, for a lawful consideration and with a lawful object, and are not hereby expressly declared to be void.\n\nNothing herein contained shall affect any law in force in India, and not hereby expressly repealed, by which any contract is required to be made in writing or in the presence of witnesses, or any law relating to the registration of documents.",
            keywords: ["free consent", "competent to contract", "lawful consideration", "lawful object", "void agreements"],
            crossReferences: ["contract-sec2", "const-art300a"]
          }
        ]
      },
      {
        id: "contract-ch6",
        number: "Chapter VI",
        title: "Of the Consequences of Breach of Contract",
        sections: [
          {
            id: "contract-sec73",
            actId: "contract-1872",
            number: "Section 73",
            title: "Compensation for loss or damage caused by breach of contract",
            text: "When a contract has been broken, the party who suffers by such breach is entitled to receive, from the party who has broken the contract, compensation for any loss or damage caused to him thereby, which naturally arose in the usual course of things from such breach, or which the parties knew, when they made the contract, to be likely to result from the breach of it.\n\nSuch compensation is not to be given for any remote and indirect loss or damage sustained by reason of the breach.",
            keywords: ["breach", "damages", "compensation", "loss", "liquidated damages", "contractual remedy", "mitigation of loss"],
            crossReferences: ["contract-sec2", "const-art300a"]
          }
        ]
      }
    ]
  },
  {
    id: "it-2000",
    title: "The Information Technology Act, 2000",
    shortTitle: "IT Act, 2000",
    year: 2000,
    type: "central",
    category: "Technology",
    description: "The primary law in India dealing with cybercrime and electronic commerce. It provides legal recognition for transactions carried out by means of electronic data interchange and other electronic communications.",
    chapters: [
      {
        id: "it-ch9",
        number: "Chapter IX",
        title: "Penalties, Compensation and Adjudication",
        sections: [
          {
            id: "it-sec43a",
            actId: "it-2000",
            number: "Section 43A",
            title: "Compensation for failure to protect sensitive personal data",
            text: "Where a body corporate, possessing, dealing or handling any sensitive personal data or information in a computer resource which it owns, controls or operates, is negligent in implementing and maintaining reasonable security practices and procedures and thereby causes wrongful loss or wrongful gain to any person, such body corporate shall be liable to pay damages by way of compensation to the person so affected.",
            keywords: ["data protection", "sensitive personal data", "SPDI", "negligence", "compensation", "body corporate", "reasonable security practices", "cybersecurity"],
            crossReferences: ["contract-sec73", "bsa-sec63"]
          }
        ]
      },
      {
        id: "it-ch11",
        number: "Chapter XI",
        title: "Offences",
        sections: [
          {
            id: "it-sec66a",
            actId: "it-2000",
            number: "Section 66A",
            title: "Punishment for sending offensive messages (Struck Down)",
            text: "[HISTORICAL STATUS: STRUCK DOWN by the Supreme Court of India in Shreya Singhal v. Union of India (2015) as it violated Article 19(1)(a) of the Constitution]\n\nAny person who sends, by means of a computer resource or a communication device,—\n(a) any information that is grossly offensive or has menacing character; or\n(b) any information which he knows to be false, but for the purpose of causing annoyance, inconvenience, danger, obstruction, insult, injury, criminal intimidation, enmity, hatred or ill will, persistently by making use of such computer resource or a communication device,\n(c) any electronic mail or electronic mail message for the purpose of causing annoyance or inconvenience or to deceive or to mislead the addressee or recipient about the origin of such messages,\nshall be punishable with imprisonment for a term which may extend to three years and with fine.",
            keywords: ["offensive messages", "struck down", "shreya singhal", "social media arrest", "freedom of speech", "constitutional validity"],
            crossReferences: ["const-art19", "bnss-sec35"]
          },
          {
            id: "it-sec66d",
            actId: "it-2000",
            number: "Section 66D",
            title: "Punishment for cheating by personation using computer resource",
            text: "Whoever, by means of any communication device or computer resource cheats by personating, shall be punished with imprisonment of either description for a term which may extend to three years and shall also be liable to fine which may extend to one lakh rupees.",
            keywords: ["personation", "impersonation", "online cheating", "phishing", "cyber fraud", "computer resource"],
            crossReferences: ["bns-sec303", "bnss-sec35"]
          }
        ]
      }
    ]
  },
  {
    id: "companies-2013",
    title: "The Companies Act, 2013",
    shortTitle: "Companies Act",
    year: 2013,
    type: "central",
    category: "Corporate",
    description: "Regulates incorporation of a company, responsibilities of a company, directors, dissolution of a company. It established significant developments such as Corporate Social Responsibility (CSR).",
    chapters: [
      {
        id: "comp-ch9",
        number: "Chapter IX",
        title: "Accounts of Companies",
        sections: [
          {
            id: "comp-sec135",
            actId: "companies-2013",
            number: "Section 135",
            title: "Corporate Social Responsibility",
            text: "(1) Every company having net worth of rupees five hundred crore or more, or turnover of rupees one thousand crore or more or a net profit of rupees five crore or more during any financial year shall constitute a Corporate Social Responsibility Committee of the Board consisting of three or more directors, out of which at least one director shall be an independent director...\n\n(5) The Board of every company referred to in sub-section (1), shall ensure that the company spends, in every financial year, at least two per cent. of the average net profits of the company made during the three immediately preceding financial years, in pursuance of its Corporate Social Responsibility Policy.",
            keywords: ["CSR", "corporate social responsibility", "net profit", "turnover", "directors", "social spending", "compliance"],
            crossReferences: ["comp-sec149"]
          }
        ]
      },
      {
        id: "comp-ch11",
        number: "Chapter XI",
        title: "Appointment and Qualifications of Directors",
        sections: [
          {
            id: "comp-sec149",
            actId: "companies-2013",
            number: "Section 149",
            title: "Company to have Board of Directors",
            text: "(1) Every company shall have a Board of Directors consisting of individuals as directors and shall have—\n(a) a minimum number of three directors in the case of a public company, two directors in the case of a private company, and one director in the case of a One Person Company; and\n(b) a maximum of fifteen directors:\n\nProvided that a company may appoint more than fifteen directors after passing a special resolution:\n\nProvided further that such class or classes of companies as may be prescribed, shall have at least one woman director.\n\n(3) Every company shall have at least one director who stays in India for a total period of not less than one hundred and eighty-two days during the financial year.",
            keywords: ["board of directors", "independent director", "woman director", "private company", "public company", "residency requirement"],
            crossReferences: ["comp-sec135"]
          }
        ]
      }
    ]
  }
];

export function getSectionById(sectionId: string) {
  for (const act of CENTRAL_ACTS) {
    for (const chapter of act.chapters) {
      const found = chapter.sections.find(s => s.id === sectionId);
      if (found) return { act, section: found };
    }
  }
  return null;
}
