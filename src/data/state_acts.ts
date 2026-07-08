import { Act, StateAmendment } from '../types';

export const STATE_ACTS: Act[] = [
  {
    id: "maharashtra-police-1951",
    title: "The Maharashtra Police Act, 1951",
    shortTitle: "Maharashtra Police Act",
    year: 1951,
    type: "state",
    category: "Criminal",
    description: "An Act to consolidate and amend the law relating to the regulation of the Police Force in the State of Maharashtra and for certain other purposes.",
    chapters: [
      {
        id: "mah-police-ch3",
        number: "Chapter III",
        title: "Regulation, Control and Discipline of the Police Force",
        sections: [
          {
            id: "mah-police-sec33",
            actId: "maharashtra-police-1951",
            number: "Section 33",
            title: "Rules for regulation of traffic and for preserving order",
            text: "(1) The Commissioner and the District Magistrate, in areas under their respective charges, may make, alter, or rescind rules or orders for regulating traffic, preventing obstructions, and preserving public order in streets and public places.\n\nThis includes licensing and controlling musical instruments, loudspeakers, public processions, and assemblies in order to prevent public nuisance or breach of peace.",
            keywords: ["police powers", "processions", "loudspeakers", "traffic regulation", "public nuisance", "licensing"],
            crossReferences: ["const-art19", "bnss-sec35"]
          }
        ]
      }
    ]
  },
  {
    id: "karnataka-land-reforms-1961",
    title: "The Karnataka Land Reforms Act, 1961",
    shortTitle: "Karnataka Land Reforms Act",
    year: 1961,
    type: "state",
    category: "Civil",
    description: "An Act relating to land reforms in the State of Karnataka, placing ceilings on agricultural land ownership, abolishing tenancy, and vesting ownership of land in actual tillers.",
    chapters: [
      {
        id: "kar-land-ch4",
        number: "Chapter IV",
        title: "Ceilings on Land Holdings",
        sections: [
          {
            id: "kar-land-sec63",
            actId: "karnataka-land-reforms-1961",
            number: "Section 63",
            title: "Ceiling on Land",
            text: "(1) No person who is not a member of a family or who has no family shall, except as otherwise provided in this Act, be entitled to hold land in excess of the ceiling area.\n\n(2) The ceiling area for a person or a family shall be 10 units, provided that where a family consists of more than five members, the ceiling area shall be increased by 2 units for each member in excess of five, up to a maximum of 20 units.\n\nAny land held in excess of this ceiling shall be deemed to be surplus land and shall vest in the State Government, subject to payment of compensation as determined under this Act.",
            keywords: ["land ceiling", "agricultural land", "vesting", "surplus land", "land acquisition", "compensation"],
            crossReferences: ["const-art300a"]
          }
        ]
      }
    ]
  },
  {
    id: "delhi-shops-1954",
    title: "The Delhi Shops and Establishments Act, 1954",
    shortTitle: "Delhi Shops Act",
    year: 1954,
    type: "state",
    category: "Civil",
    description: "An Act to regulate the conditions of work and employment in shops, commercial establishments, hotels, restaurants, and theaters in the National Capital Territory of Delhi.",
    chapters: [
      {
        id: "del-shops-ch3",
        number: "Chapter III",
        title: "Hours of Work and Employment",
        sections: [
          {
            id: "del-shops-sec15",
            actId: "delhi-shops-1954",
            number: "Section 15",
            title: "Opening and closing hours",
            text: "(1) No shop or commercial establishment shall on any day be opened earlier than such hour or closed later than such hour as may be fixed by the Government by a general or special order.\n\n(2) The Government may fix different opening and closing hours for different classes of shops or commercial establishments or for different areas or for different times of the year.",
            keywords: ["opening hours", "closing hours", "working hours", "employment terms", "commercial establishment"],
            crossReferences: ["contract-sec10"]
          }
        ]
      }
    ]
  }
];

// Map containing specific state-wise amendments/modifications to Central Acts.
// This implements the "cross-referenced interaction between central and state Acts"
export const STATE_AMENDMENTS_MAP: Record<string, StateAmendment[]> = {
  "bnss-sec173": [
    {
      id: "mah-bnss-173",
      stateName: "Maharashtra",
      text: "Maharashtra State Amendment (investigation timeline & zero FIR protocol)",
      details: "In Section 173 of the BNSS, in its application to the State of Maharashtra, an amendment ensures that when information of a cognizable offence is received via electronic means, it must be recorded as a 'Zero FIR' immediately, and transferred to the concerned police station within 24 hours. Additionally, for offences carrying less than 3 years of imprisonment, a compulsory preliminary inquiry of up to 15 days is authorized before formal FIR registration.",
      year: 2024
    },
    {
      id: "kar-bnss-173",
      stateName: "Karnataka",
      text: "Karnataka State Amendment (electronic records validation)",
      details: "In Section 173 of the BNSS, in its application to the State of Karnataka, a provision has been added mandating that if an FIR is registered electronically, a secure cryptographic hash of the digital report must be sent automatically to the jurisdictional Magistrate's portal within 6 hours to prevent retrospective alteration of electronic logs.",
      year: 2024
    }
  ],
  "bnss-sec35": [
    {
      id: "mah-bnss-35",
      stateName: "Maharashtra",
      text: "Maharashtra Amendment (checks on arbitrary arrests)",
      details: "In Section 35 of the BNSS, the State of Maharashtra has inserted a sub-section requiring that every arrest made without warrant under this section for offences carrying under 7 years of imprisonment must receive written authorization from an officer not below the rank of Deputy Commissioner of Police (DCP) in urban areas or Superintendent of Police (SP) in rural areas, explaining the absolute necessity of arrest in writing.",
      year: 2024
    }
  ],
  "bns-sec103": [
    {
      id: "tn-bns-103",
      stateName: "Tamil Nadu",
      text: "Tamil Nadu Amendment (provisions for Honor Killings)",
      details: "In Section 103 of the BNS, in its application to the State of Tamil Nadu, a specific sub-section has been proposed to mandate that where a murder is committed in the name of 'honor' (caste/community opposition to marriage or relationship), the offence shall be tried in a designated Fast Track Court with a mandate to complete the trial within 6 months.",
      year: 2024
    }
  ],
  "contract-sec73": [
    {
      id: "up-contract-73",
      stateName: "Uttar Pradesh",
      text: "Uttar Pradesh Amendment (government contract breaches)",
      details: "Regarding Section 73 of the Contract Act, in its application to public infrastructure contracts in Uttar Pradesh, specific clauses have been established restricting the quantum of indirect or consequential damages that can be claimed against state government bodies, capping any breach-related compensation to 10% of the total contract value unless explicit fraud is proved.",
      year: 2021
    }
  ]
};

export function getStateAmendmentsForSection(sectionId: string): StateAmendment[] {
  return STATE_AMENDMENTS_MAP[sectionId] || [];
}
