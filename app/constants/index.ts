export const resumes: Resume[] = [
  {
    id: "1",
    companyName: "Google",
    jobTitle: "Frontend Developer",
    imagePath: "../../public/images/resume_01.png",
    resumePath: "/resumes/resume-1.pdf",
    feedback: {
      overallScore: 85,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "2",
    companyName: "Microsoft",
    jobTitle: "Cloud Engineer",
    imagePath: "../../public//images/resume_02.png",
    resumePath: "/resumes/resume-2.pdf",
    feedback: {
      overallScore: 55,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "3",
    companyName: "Apple",
    jobTitle: "iOS Developer",
    imagePath: "../../public/images/resume_03.png",
    resumePath: "/resumes/resume-3.pdf",
    feedback: {
      overallScore: 75,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
    {
    id: "4",
    companyName: "Google",
    jobTitle: "Frontend Developer",
    imagePath: "../../public/images/resume_01.png",
    resumePath: "/resumes/resume-1.pdf",
    feedback: {
      overallScore: 85,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "5",
    companyName: "Microsoft",
    jobTitle: "Cloud Engineer",
    imagePath: "../../public//images/resume_02.png",
    resumePath: "/resumes/resume-2.pdf",
    feedback: {
      overallScore: 55,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "6",
    companyName: "Apple",
    jobTitle: "iOS Developer",
    imagePath: "../../public/images/resume_03.png",
    resumePath: "/resumes/resume-3.pdf",
    feedback: {
      overallScore: 75,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
];

const AIResponseFormat = `
      interface Feedback {
      overallScore: number; //max 100
      ATS: {
        score: number; //rate based on ATS suitability
        tips: {
          type: "good" | "improve";
          tip: string; //give 3-4 tips
        }[];
      };
      toneAndStyle: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      content: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      structure: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      skills: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
    }`;

export const prepareInstructions = ({
  jobTitle,
  jobDescription,
}: {
  jobTitle: string;
  jobDescription: string;
}) =>
  `You are an experienced ATS (Applicant Tracking System) and resume analyst. Be honest and constructive.

  CONTEXT: The resume text below was extracted programmatically from a PDF, simulating how an ATS parses resumes.

  ATS PARSING ASSESSMENT - Evaluate the extracted text for these issues:

  MINOR issues (small penalty): Skills or secondary sections appearing slightly out of order due to multi-column layouts.
  These are cosmetic and most ATS systems handle them.

  MAJOR issues (heavy penalty — each should lower ATS score by 10-15 points):
  - Spaced-out letters in words (e.g. "T E C H N I C A L" instead of "TECHNICAL") — ATS cannot match keywords
  - Job descriptions/bullets SEPARATED from their company name and dates — ATS cannot associate experience correctly
  - Sidebar content (contact info, intro) injected in the middle of work experience — ATS misreads section boundaries
  - Dates appearing as a disconnected block rather than next to their respective roles
  - Garbled, unreadable, or fundamentally disordered text

  These major issues reflect real ATS failures. A resume with 2+ major issues should score below 50 on ATS
  regardless of how good the actual content is, because ATS cannot parse it properly.

  SCORING GUIDELINES - Be honest and accurate:
  - 0-30: Severely broken, ATS cannot parse it at all
  - 31-50: Multiple major structural/formatting problems causing real ATS parsing failures
  - 51-65: Parseable but has some structural issues, weak keyword alignment, or notable gaps
  - 66-80: Good resume with clear structure, decent keyword match, room for improvement
  - 81-90: Strong resume, well-structured, strong keyword alignment with minor gaps
  - 91-100: Near-perfect match — reserved for resumes precisely tailored to the role

  IMPORTANT: Do NOT inflate scores. A visually attractive resume with broken text extraction is still a BAD ATS resume.
  Score based on how well the extracted text can be parsed, not what you think the original looked like.

  Analyze this resume for the following role:
  Job title: ${jobTitle}
  Job description: ${jobDescription}

  Provide the feedback using the following format: ${AIResponseFormat}
  Return the analysis as a JSON object, without any other text and without the backticks.
  Do not include any other text or comments.`;